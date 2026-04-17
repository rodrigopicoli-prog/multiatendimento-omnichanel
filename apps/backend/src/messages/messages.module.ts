import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { AuditModule } from '../audit/audit.module';
import { SendMessageQueueService } from '../common/queue/send-message-queue.service';

@Module({
  imports: [AuditModule],
  controllers: [MessagesController],
  providers: [MessagesService, SendMessageQueueService],
})
export class MessagesModule {}
