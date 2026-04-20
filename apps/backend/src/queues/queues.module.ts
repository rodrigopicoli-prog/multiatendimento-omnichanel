import { Module } from '@nestjs/common';
import { QueuesController } from './queues.controller';
import { QueuesService } from './queues.service';
import { AuditModule } from '../audit/audit.module';

@Module({ imports: [AuditModule], controllers: [QueuesController], providers: [QueuesService] })
export class QueuesModule {}
