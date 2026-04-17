import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { CreateNoteDto } from './dto/create-note.dto';
import { InternalNotesService } from './internal-notes.service';

@Controller('conversations/:conversationId/notes') @UseGuards(JwtAuthGuard, TenantGuard)
export class InternalNotesController {
  constructor(private readonly service: InternalNotesService) {}
  @Post() create(@CurrentUser() user: AuthUser, @Param('conversationId') conversationId: string, @Body() dto: CreateNoteDto) { return this.service.create(user.tenantId, conversationId, user.userId, dto.body); }
  @Get() list(@CurrentUser() user: AuthUser, @Param('conversationId') conversationId: string) { return this.service.list(user.tenantId, conversationId); }
  @Delete(':id') remove(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.service.remove(user.tenantId, id); }
}
