import { MessageDirection, MessageType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsOptional() @IsEnum(MessageDirection) direction?: MessageDirection;
  @IsOptional() @IsEnum(MessageType) type?: MessageType;
  @IsOptional() @IsString() body?: string;
  @IsOptional() @IsString() mediaUrl?: string;
  @IsOptional() @IsString() mimeType?: string;
  @IsOptional() @IsString() to?: string;
  rawPayloadJson?: any;
}
