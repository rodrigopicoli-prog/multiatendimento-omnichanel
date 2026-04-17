import { ConversationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class UpdateConversationDto { @IsOptional() @IsString() queueId?: string; @IsOptional() @IsString() assignedUserId?: string; @IsOptional() @IsString() kanbanStageId?: string; @IsOptional() @IsEnum(ConversationStatus) status?: ConversationStatus; }
