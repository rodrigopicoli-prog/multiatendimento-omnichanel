import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('conversations/:conversationId/messages') @UseGuards(JwtAuthGuard, TenantGuard)
export class MessagesController {
  constructor(private readonly service: MessagesService) {}
  @Get() list(@CurrentUser() user: AuthUser, @Param('conversationId') conversationId: string) { return this.service.list(user.tenantId, conversationId); }
  @Post() create(@CurrentUser() user: AuthUser, @Param('conversationId') conversationId: string, @Body() dto: CreateMessageDto) { return this.service.createOutbound(user.tenantId, conversationId, user.userId, dto); }
  @Post('inbound') inbound(@CurrentUser() user: AuthUser, @Param('conversationId') conversationId: string, @Body() dto: CreateMessageDto) { return this.service.registerInbound(user.tenantId, conversationId, dto); }
  @Patch(':id/status/:status') status(@CurrentUser() user: AuthUser, @Param('id') id: string, @Param('status') status: MessageStatus) { return this.service.updateStatus(user.tenantId, id, status); }
}
