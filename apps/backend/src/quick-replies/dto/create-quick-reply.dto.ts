import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class CreateQuickReplyDto { @IsString() title!: string; @IsString() body!: string; @IsOptional() @IsString() category?: string; @IsOptional() @IsBoolean() isActive?: boolean; }
