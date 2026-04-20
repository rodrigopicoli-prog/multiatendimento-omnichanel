import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations') @UseGuards(JwtAuthGuard, TenantGuard)
export class ConversationsController { constructor(private readonly service: ConversationsService) {}
  @Post() create(@CurrentUser() user: AuthUser, @Body() dto: CreateConversationDto) { return this.service.create(user.tenantId, dto); }
  @Get() list(@CurrentUser() user: AuthUser, @Query() filters: any) { return this.service.list(user.tenantId, user.userId, filters); }
  @Get(':id') detail(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.service.detail(user.tenantId, id); }
  @Patch(':id/assign/:assignedUserId') assign(@CurrentUser() user: AuthUser, @Param('id') id: string, @Param('assignedUserId') assignedUserId: string) { return this.service.assign(user.tenantId, id, assignedUserId, user.userId); }
  @Patch(':id/transfer/:queueId') transfer(@CurrentUser() user: AuthUser, @Param('id') id: string, @Param('queueId') queueId: string) { return this.service.transfer(user.tenantId, id, queueId, user.userId); }
  @Patch(':id/close') close(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.service.close(user.tenantId, id, user.userId); }
  @Patch(':id/reopen') reopen(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.service.reopen(user.tenantId, id); }
  @Patch(':id/kanban/:stageId') kanban(@CurrentUser() user: AuthUser, @Param('id') id: string, @Param('stageId') stageId: string) { return this.service.setKanban(user.tenantId, id, stageId, user.userId); }
}
