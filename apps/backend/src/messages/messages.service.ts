import { Injectable } from '@nestjs/common';
import { MessageDirection, MessageStatus, MessageType } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { SendMessageQueueService } from '../common/queue/send-message-queue.service';
import { AppWebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly sendMessageQueue: SendMessageQueueService,
    private readonly websocket: AppWebsocketGateway,
  ) {}

  list(tenantId: string, conversationId: string) {
    return this.prisma.message.findMany({ where: { tenantId, conversationId }, orderBy: { createdAt: 'asc' } });
  }

  async createOutbound(tenantId: string, conversationId: string, actorId: string, dto: any) {
    const msg = await this.prisma.message.create({
      data: {
        tenantId,
        conversationId,
        direction: dto.direction ?? MessageDirection.OUTBOUND,
        type: dto.type ?? MessageType.TEXT,
        body: dto.body,
        mediaUrl: dto.mediaUrl,
        mimeType: dto.mimeType,
        rawPayloadJson: dto.rawPayloadJson,
        status: MessageStatus.PENDING,
      },
    });

    const conversation = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date(), lastMessagePreview: dto.body?.slice(0, 120) },
      include: { contact: true, channel: true },
    });

    await this.sendMessageQueue.enqueue({
      tenantId,
      channelId: conversation.channelId,
      conversationId,
      messageId: msg.id,
      to: dto.to ?? conversation.contact?.phone ?? '',
      body: dto.body,
      type: dto.type,
      mediaUrl: dto.mediaUrl,
    });

    await this.audit.log({
      tenantId,
      userId: actorId,
      action: 'MESSAGE_QUEUED',
      resource: 'messages',
      payload: { conversationId, messageId: msg.id },
    });

    this.websocket.emitConversationUpdated({
      conversationId,
      event: 'message_queued',
      messageId: msg.id,
    });

    return msg;
  }

  async registerInbound(tenantId: string, conversationId: string, dto: any) {
    const msg = await this.prisma.message.create({
      data: {
        tenantId,
        conversationId,
        direction: MessageDirection.INBOUND,
        type: dto.type ?? MessageType.TEXT,
        body: dto.body,
        mediaUrl: dto.mediaUrl,
        mimeType: dto.mimeType,
        rawPayloadJson: dto.rawPayloadJson,
        status: MessageStatus.DELIVERED,
      },
    });

    await this.prisma.conversation.updateMany({
      where: { id: conversationId, tenantId },
      data: { unreadCount: { increment: 1 }, lastMessageAt: new Date(), lastMessagePreview: dto.body?.slice(0, 120) },
    });

    this.websocket.emitInboundMessage({ conversationId, message: msg });
    return msg;
  }

  updateStatus(tenantId: string, id: string, status: MessageStatus) {
    this.websocket.emitOutboundStatus({ tenantId, messageId: id, status });
    return this.prisma.message.updateMany({ where: { id, tenantId }, data: { status } });
  }
}
