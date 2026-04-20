import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class QuickRepliesService {
  constructor(private readonly prisma: PrismaService) {}
  create(tenantId: string, userId: string, dto: any) { return this.prisma.quickReply.create({ data: { tenantId, userId, title: dto.title, body: dto.body, category: dto.category, isActive: dto.isActive ?? true } }); }
  list(tenantId: string) { return this.prisma.quickReply.findMany({ where: { tenantId }, orderBy: { updatedAt: 'desc' } }); }
  update(tenantId: string, id: string, dto: any) { return this.prisma.quickReply.updateMany({ where: { id, tenantId }, data: dto }); }
}
