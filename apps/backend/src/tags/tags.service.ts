import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}
  create(tenantId: string, dto: any) { return this.prisma.tag.create({ data: { tenantId, name: dto.name, color: dto.color } }); }
  list(tenantId: string) { return this.prisma.tag.findMany({ where: { tenantId } }); }
  update(tenantId: string, id: string, dto: any) { return this.prisma.tag.updateMany({ where: { id, tenantId }, data: dto }); }
  async assignToContact(tenantId: string, contactId: string, tagId: string) { return this.prisma.contactTag.upsert({ where: { tenantId_contactId_tagId: { tenantId, contactId, tagId } }, create: { tenantId, contactId, tagId }, update: {} }); }
  async removeFromContact(tenantId: string, contactId: string, tagId: string) { return this.prisma.contactTag.deleteMany({ where: { tenantId, contactId, tagId } }); }
  async assignToConversation(tenantId: string, conversationId: string, tagId: string) { return this.prisma.conversationTag.upsert({ where: { tenantId_conversationId_tagId: { tenantId, conversationId, tagId } }, create: { tenantId, conversationId, tagId }, update: {} }); }
  async removeFromConversation(tenantId: string, conversationId: string, tagId: string) { return this.prisma.conversationTag.deleteMany({ where: { tenantId, conversationId, tagId } }); }
}
