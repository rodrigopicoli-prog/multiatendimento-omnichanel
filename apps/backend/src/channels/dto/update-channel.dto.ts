import { ChannelStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
export class UpdateChannelDto { @IsOptional() @IsString() name?: string; @IsOptional() @IsEnum(ChannelStatus) status?: ChannelStatus; credentialsJson?: any; @IsOptional() @IsString() sessionKey?: string; @IsOptional() @IsString() webhookSecret?: string; @IsOptional() @IsBoolean() isActive?: boolean; }
