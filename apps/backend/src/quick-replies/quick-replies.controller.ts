import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { CreateQuickReplyDto } from './dto/create-quick-reply.dto';
import { QuickRepliesService } from './quick-replies.service';

@Controller('quick-replies') @UseGuards(JwtAuthGuard, TenantGuard)
export class QuickRepliesController { constructor(private readonly service: QuickRepliesService) {}
  @Post() create(@CurrentUser() user: AuthUser, @Body() dto: CreateQuickReplyDto) { return this.service.create(user.tenantId, user.userId, dto); }
  @Get() list(@CurrentUser() user: AuthUser) { return this.service.list(user.tenantId); }
  @Patch(':id') update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: Partial<CreateQuickReplyDto>) { return this.service.update(user.tenantId, id, dto); }
}
