import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class InternalNotesService {
  constructor(private readonly prisma: PrismaService) {}
  create(tenantId: string, conversationId: string, userId: string, body: string) { return this.prisma.internalNote.create({ data: { tenantId, conversationId, userId, body } }); }
  list(tenantId: string, conversationId: string) { return this.prisma.internalNote.findMany({ where: { tenantId, conversationId }, include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } }); }
  remove(tenantId: string, id: string) { return this.prisma.internalNote.deleteMany({ where: { tenantId, id } }); }
}
