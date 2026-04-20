import { IsEmail, IsOptional, IsString } from 'class-validator';
export class CreateContactDto { @IsOptional() @IsString() name?: string; @IsOptional() @IsString() phone?: string; @IsOptional() @IsEmail() email?: string; @IsOptional() @IsString() externalId?: string; @IsOptional() @IsString() profilePicUrl?: string; @IsOptional() @IsString() notes?: string; }
