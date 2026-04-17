import { ChannelStatus, ChannelType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class CreateChannelDto { @IsEnum(ChannelType) type!: ChannelType; @IsString() name!: string; @IsOptional() @IsEnum(ChannelStatus) status?: ChannelStatus; credentialsJson?: any; @IsOptional() @IsString() sessionKey?: string; @IsOptional() @IsString() webhookSecret?: string; }
