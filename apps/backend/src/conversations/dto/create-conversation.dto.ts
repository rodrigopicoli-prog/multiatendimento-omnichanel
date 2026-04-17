import { ConversationPriority } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class CreateConversationDto { @IsString() contactId!: string; @IsString() channelId!: string; @IsOptional() @IsString() queueId?: string; @IsOptional() @IsEnum(ConversationPriority) priority?: ConversationPriority; }
