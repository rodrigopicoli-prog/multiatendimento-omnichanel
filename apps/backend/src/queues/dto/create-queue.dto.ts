import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
export class CreateQueueDto { @IsString() name!: string; @IsOptional() @IsString() color?: string; @IsOptional() @IsInt() sortOrder?: number; @IsOptional() @IsBoolean() isActive?: boolean; }
