import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class QueuesService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}
  create(tenantId: string, actorId: string, dto: any) { return this.prisma.queue.create({ data: { tenantId, name: dto.name, color: dto.color, sortOrder: dto.sortOrder ?? 0, isActive: dto.isActive ?? true } }).then(async (r)=>{ await this.audit.log({tenantId,userId:actorId,action:'QUEUE_CREATED',resource:'queues',payload:r}); return r;}); }
  list(tenantId: string) { return this.prisma.queue.findMany({ where: { tenantId }, orderBy: { sortOrder: 'asc' } }); }
  update(tenantId: string, id: string, dto: any) { return this.prisma.queue.updateMany({ where: { id, tenantId }, data: dto }); }
  setPermission(tenantId: string, queueId: string, dto: any) { return this.prisma.userQueuePermission.upsert({ where: { tenantId_userId_queueId: { tenantId, userId: dto.userId, queueId } }, create: { tenantId, queueId, userId: dto.userId, canRead: dto.canRead, canWrite: dto.canWrite }, update: { canRead: dto.canRead, canWrite: dto.canWrite } }); }
}
