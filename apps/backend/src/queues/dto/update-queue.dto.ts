import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
export class UpdateQueueDto { @IsOptional() @IsString() name?: string; @IsOptional() @IsString() color?: string; @IsOptional() @IsInt() sortOrder?: number; @IsOptional() @IsBoolean() isActive?: boolean; }
