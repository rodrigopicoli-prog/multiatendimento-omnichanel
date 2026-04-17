import { IsBoolean, IsString } from 'class-validator';
export class SetQueuePermissionDto { @IsString() userId!: string; @IsBoolean() canRead!: boolean; @IsBoolean() canWrite!: boolean; }
