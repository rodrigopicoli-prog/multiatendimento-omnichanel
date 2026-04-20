import { Injectable } from '@nestjs/common';
import { ConversationStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}
  create(tenantId: string, dto: any) { return this.prisma.conversation.create({ data: { tenantId, contactId: dto.contactId, channelId: dto.channelId, queueId: dto.queueId, priority: dto.priority } }); }
  list(tenantId: string, userId: string, filters: any) {
    const where: any = { tenantId };
    if (filters.filter === 'mine') where.assignedUserId = userId;
    if (filters.filter === 'unread') where.unreadCount = { gt: 0 };
    if (filters.filter === 'pending') where.status = ConversationStatus.PENDING;
    if (filters.filter === 'closed') where.status = ConversationStatus.CLOSED;
    if (filters.queueId) where.queueId = filters.queueId;
    if (filters.channelId) where.channelId = filters.channelId;
    if (filters.tagId) where.tags = { some: { tagId: filters.tagId } };
    return this.prisma.conversation.findMany({ where, include: { contact: true, assignedUser: { select: { id: true, name: true } }, queue: true, channel: true, tags: { include: { tag: true } } }, orderBy: { lastMessageAt: 'desc' } });
  }
  detail(tenantId: string, id: string) { return this.prisma.conversation.findFirst({ where: { tenantId, id }, include: { contact: true, messages: { take: 30, orderBy: { createdAt: 'desc' } }, internalNotes: { include: { user: { select: { id: true, name: true } } } } } }); }
  async assign(tenantId: string, id: string, userId: string, actorId: string) { const r = await this.prisma.conversation.updateMany({ where: { id, tenantId }, data: { assignedUserId: userId, status: ConversationStatus.OPEN } }); await this.audit.log({tenantId,userId:actorId,action:'CONVERSATION_ASSIGNED',resource:'conversations',payload:{id,assignedUserId:userId}}); return r; }
  async transfer(tenantId: string, id: string, queueId: string, actorId: string) { const r = await this.prisma.conversation.updateMany({ where: { id, tenantId }, data: { queueId } }); await this.audit.log({tenantId,userId:actorId,action:'CONVERSATION_TRANSFERRED',resource:'conversations',payload:{id,queueId}}); return r; }
  async close(tenantId: string, id: string, actorId: string) { const r = await this.prisma.conversation.updateMany({ where: { id, tenantId }, data: { status: ConversationStatus.CLOSED, closedAt: new Date() } }); await this.audit.log({tenantId,userId:actorId,action:'CONVERSATION_CLOSED',resource:'conversations',payload:{id}}); return r; }
  reopen(tenantId: string, id: string) { return this.prisma.conversation.updateMany({ where: { id, tenantId }, data: { status: ConversationStatus.OPEN, closedAt: null } }); }
  async setKanban(tenantId: string, id: string, stageId: string, actorId: string) { const r = await this.prisma.conversation.updateMany({ where: { id, tenantId }, data: { kanbanStageId: stageId } }); await this.prisma.kanbanHistory.create({ data: { tenantId, conversationId: id, stageId, movedByUserId: actorId } }); await this.audit.log({tenantId,userId:actorId,action:'KANBAN_CHANGED',resource:'conversations',payload:{id,stageId}}); return r; }
}
