import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService, private readonly audit: AuditService) {}
  create(tenantId: string, actorId: string, dto: any) { return this.prisma.channel.create({ data: { tenantId, ...dto } }).then(async (c)=>{ await this.audit.log({tenantId,userId:actorId,action:'CHANNEL_CREATED',resource:'channels',payload:c}); return c;}); }
  list(tenantId: string) { return this.prisma.channel.findMany({ where: { tenantId } }); }
  update(tenantId: string, id: string, actorId: string, dto: any) { return this.prisma.channel.updateMany({ where: { id, tenantId }, data: dto }).then(async (r)=>{ await this.audit.log({tenantId,userId:actorId,action:'CHANNEL_UPDATED',resource:'channels',payload:{id,changes:dto}}); return r;}); }
}
