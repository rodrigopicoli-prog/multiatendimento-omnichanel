import { IsISO8601, IsObject, IsOptional, IsString } from 'class-validator';

export class InboundMessageDto {
  @IsString() tenantId!: string;
  @IsString() channelId!: string;
  @IsString() externalMessageId!: string;
  @IsString() remoteJid!: string;
  @IsOptional() @IsString() senderName?: string;
  @IsString() messageType!: string;
  @IsOptional() @IsString() body?: string;
  @IsOptional() @IsObject() mediaInfo?: Record<string, unknown>;
  @IsISO8601() timestamp!: string;
  @IsObject() rawPayload!: Record<string, unknown>;
}
