import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts') @UseGuards(JwtAuthGuard, TenantGuard)
export class ContactsController { constructor(private readonly service: ContactsService) {}
  @Post() create(@CurrentUser() user: AuthUser, @Body() dto: CreateContactDto) { return this.service.create(user.tenantId, dto); }
  @Get() list(@CurrentUser() user: AuthUser, @Query() query: PaginationQueryDto, @Query('search') search?: string) { return this.service.list(user.tenantId, query, search); }
  @Get(':id') detail(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.service.detail(user.tenantId, id); }
  @Patch(':id') update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: Partial<CreateContactDto>) { return this.service.update(user.tenantId, id, dto); }
}
