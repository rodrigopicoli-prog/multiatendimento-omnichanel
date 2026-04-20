import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { PrismaService } from '../common/prisma/prisma.service';

@Controller('audit')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERVISOR)
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@CurrentUser() user: AuthUser, @Query() query: PaginationQueryDto) {
    const skip = (query.page - 1) * query.limit;
    return this.prisma.auditLog.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.limit,
    });
  }
}
