import { IsOptional, IsString } from 'class-validator';

export class MessageStatusDto {
  @IsString() tenantId!: string;
  @IsString() channelId!: string;
  @IsString() conversationId!: string;
  @IsString() messageId!: string;
  @IsString() status!: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  @IsOptional() @IsString() externalMessageId?: string;
  @IsOptional() @IsString() reason?: string;
}
