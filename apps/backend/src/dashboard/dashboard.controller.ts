import { Controller, Get, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { PrismaService } from '../common/prisma/prisma.service';

@Controller('dashboard') @UseGuards(JwtAuthGuard, TenantGuard)
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('summary')
  async summary(@CurrentUser() user: AuthUser) {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const today = await this.prisma.conversation.count({ where: { tenantId: user.tenantId, createdAt: { gte: start } } });
    const closed = await this.prisma.conversation.count({ where: { tenantId: user.tenantId, status: 'CLOSED', updatedAt: { gte: start } } });
    const byQueue = await this.prisma.conversation.groupBy({ by: ['queueId'], where: { tenantId: user.tenantId }, _count: { _all: true } });
    const byChannel = await this.prisma.conversation.groupBy({ by: ['channelId'], where: { tenantId: user.tenantId }, _count: { _all: true } });
    const byAgent = await this.prisma.conversation.groupBy({ by: ['assignedUserId'], where: { tenantId: user.tenantId }, _count: { _all: true } });
    const responseTimes = await this.prisma.$queryRaw<Array<{ avg_first_response_seconds: number | null; avg_handling_seconds: number | null }>>(Prisma.sql`
      SELECT AVG(EXTRACT(EPOCH FROM (m."created_at" - c."created_at"))) FILTER (WHERE m.direction = 'OUTBOUND') AS avg_first_response_seconds,
             AVG(EXTRACT(EPOCH FROM (COALESCE(c."closed_at", NOW()) - c."created_at"))) AS avg_handling_seconds
      FROM conversations c
      LEFT JOIN LATERAL (
        SELECT created_at, direction FROM messages m
        WHERE m.conversation_id = c.id AND m.tenant_id = c.tenant_id
        ORDER BY m.created_at ASC LIMIT 1
      ) m ON TRUE
      WHERE c.tenant_id = ${user.tenantId}
    `);
    return { conversationsToday: today, newConversations: today, closedConversations: closed, conversationsByQueue: byQueue, conversationsByChannel: byChannel, conversationsByAgent: byAgent, averageFirstResponseTimeSeconds: responseTimes[0]?.avg_first_response_seconds ?? 0, averageHandlingTimeSeconds: responseTimes[0]?.avg_handling_seconds ?? 0 };
  }
}
