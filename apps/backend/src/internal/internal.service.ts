import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MessageDirection, MessageStatus, MessageType } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { AppWebsocketGateway } from '../websocket/websocket.gateway';
import { InboundMessageDto } from './dto/inbound-message.dto';
import { MessageStatusDto } from './dto/message-status.dto';

@Injectable()
export class InternalService {
  constructor(private readonly prisma: PrismaService, private readonly websocket: AppWebsocketGateway) {}

  assertInternalToken(headerToken?: string) {
    const expected = process.env.INTERNAL_SERVICE_TOKEN;
    if (!expected || headerToken !== expected) throw new UnauthorizedException('invalid internal token');
  }

  async ingestInboundMessage(dto: InboundMessageDto) {
    const contactId = `wa:${dto.tenantId}:${dto.remoteJid}`;
    const contact = await this.prisma.contact.upsert({
      where: { id: contactId },
      create: { id: contactId, tenantId: dto.tenantId, name: dto.senderName, phone: dto.remoteJid.replace('@s.whatsapp.net', '') },
      update: { name: dto.senderName },
    });

    let conversation = await this.prisma.conversation.findFirst({ where: { tenantId: dto.tenantId, contactId: contact.id, channelId: dto.channelId, status: { in: ['OPEN', 'PENDING'] } } });
    if (!conversation) {
      conversation = await this.prisma.conversation.create({ data: { tenantId: dto.tenantId, contactId: contact.id, channelId: dto.channelId, status: 'OPEN' } });
    }

    const existing = await this.prisma.message.findFirst({ where: { tenantId: dto.tenantId, externalId: dto.externalMessageId } });
    if (existing) return existing;

    const type = (dto.messageType?.toUpperCase() ?? 'TEXT') as MessageType;

    const message = await this.prisma.message.create({
      data: {
        tenantId: dto.tenantId,
        conversationId: conversation.id,
        externalId: dto.externalMessageId,
        direction: MessageDirection.INBOUND,
        type,
        body: dto.body,
        rawPayloadJson: dto.rawPayload,
        status: MessageStatus.DELIVERED,
        sentAt: new Date(dto.timestamp),
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        unreadCount: { increment: 1 },
        lastMessageAt: new Date(dto.timestamp),
        lastMessagePreview: dto.body?.slice(0, 200),
      },
    });

    this.websocket.emitInboundMessage({ conversationId: conversation.id, message });
    this.websocket.emitConversationUpdated({ conversationId: conversation.id, unreadCountIncrement: 1 });

    return message;
  }

  async updateMessageStatus(dto: MessageStatusDto) {
    const map: Record<string, MessageStatus> = {
      queued: MessageStatus.PENDING,
      sent: MessageStatus.SENT,
      delivered: MessageStatus.DELIVERED,
      read: MessageStatus.READ,
      failed: MessageStatus.FAILED,
    };

    const updated = await this.prisma.message.updateMany({
      where: { id: dto.messageId, tenantId: dto.tenantId },
      data: { status: map[dto.status] ?? MessageStatus.PENDING, externalId: dto.externalMessageId, metadata: dto.reason ? { reason: dto.reason } : undefined },
    });

    this.websocket.emitOutboundStatus(dto);
    this.websocket.emitConversationUpdated({ conversationId: dto.conversationId, status: dto.status, messageId: dto.messageId });
    return updated;
  }
}
