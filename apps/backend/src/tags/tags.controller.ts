import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags') @UseGuards(JwtAuthGuard, TenantGuard)
export class TagsController { constructor(private readonly service: TagsService) {}
  @Post() create(@CurrentUser() user: AuthUser, @Body() dto: CreateTagDto) { return this.service.create(user.tenantId, dto); }
  @Get() list(@CurrentUser() user: AuthUser) { return this.service.list(user.tenantId); }
  @Patch(':id') update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: Partial<CreateTagDto>) { return this.service.update(user.tenantId, id, dto); }
  @Post('contacts/:contactId/:tagId') addContact(@CurrentUser() user: AuthUser, @Param('contactId') contactId: string, @Param('tagId') tagId: string) { return this.service.assignToContact(user.tenantId, contactId, tagId); }
  @Delete('contacts/:contactId/:tagId') rmContact(@CurrentUser() user: AuthUser, @Param('contactId') contactId: string, @Param('tagId') tagId: string) { return this.service.removeFromContact(user.tenantId, contactId, tagId); }
  @Post('conversations/:conversationId/:tagId') addConversation(@CurrentUser() user: AuthUser, @Param('conversationId') conversationId: string, @Param('tagId') tagId: string) { return this.service.assignToConversation(user.tenantId, conversationId, tagId); }
  @Delete('conversations/:conversationId/:tagId') rmConversation(@CurrentUser() user: AuthUser, @Param('conversationId') conversationId: string, @Param('tagId') tagId: string) { return this.service.removeFromConversation(user.tenantId, conversationId, tagId); }
}
