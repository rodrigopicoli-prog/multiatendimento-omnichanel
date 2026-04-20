import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { CreateQueueDto } from './dto/create-queue.dto';
import { SetQueuePermissionDto } from './dto/set-queue-permission.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { QueuesService } from './queues.service';

@Controller('queues') @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class QueuesController { constructor(private readonly service: QueuesService) {}
  @Post() @Roles(Role.ADMIN, Role.SUPERVISOR) create(@CurrentUser() user: AuthUser, @Body() dto: CreateQueueDto) { return this.service.create(user.tenantId, user.userId, dto); }
  @Get() list(@CurrentUser() user: AuthUser) { return this.service.list(user.tenantId); }
  @Patch(':id') @Roles(Role.ADMIN, Role.SUPERVISOR) update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateQueueDto) { return this.service.update(user.tenantId, id, dto); }
  @Post(':id/permissions') @Roles(Role.ADMIN, Role.SUPERVISOR) setPerm(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: SetQueuePermissionDto) { return this.service.setPermission(user.tenantId, id, dto); }
}
