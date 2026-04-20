import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channels') @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class ChannelsController { constructor(private readonly service: ChannelsService) {}
  @Post() @Roles(Role.ADMIN, Role.SUPERVISOR) create(@CurrentUser() user: AuthUser, @Body() dto: CreateChannelDto) { return this.service.create(user.tenantId, user.userId, dto); }
  @Get() list(@CurrentUser() user: AuthUser) { return this.service.list(user.tenantId); }
  @Patch(':id') @Roles(Role.ADMIN, Role.SUPERVISOR) update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateChannelDto) { return this.service.update(user.tenantId, id, user.userId, dto); }
}
