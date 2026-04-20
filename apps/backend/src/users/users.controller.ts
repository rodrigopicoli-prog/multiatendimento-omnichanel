import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post() @Roles(Role.ADMIN, Role.SUPERVISOR) create(@CurrentUser() user: AuthUser, @Body() dto: CreateUserDto) { return this.usersService.create(user.tenantId, user.userId, dto); }
  @Get() @Roles(Role.ADMIN, Role.SUPERVISOR) list(@CurrentUser() user: AuthUser, @Query() query: PaginationQueryDto) { return this.usersService.list(user.tenantId, query); }
  @Get(':id') @Roles(Role.ADMIN, Role.SUPERVISOR) findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.usersService.findOne(user.tenantId, id); }
  @Patch(':id') @Roles(Role.ADMIN, Role.SUPERVISOR) update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateUserDto) { return this.usersService.update(user.tenantId, id, user.userId, dto); }
}
