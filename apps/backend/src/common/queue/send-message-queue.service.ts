import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class SendMessageQueueService implements OnModuleDestroy {
  private readonly redis = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
  });

  private readonly queue = new Queue('send-message', { connection: this.redis });

  async enqueue(payload: {
    tenantId: string;
    channelId: string;
    conversationId: string;
    messageId: string;
    to: string;
    body?: string;
    type?: string;
    mediaUrl?: string;
  }) {
    return this.queue.add('send-message', payload, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 500,
      removeOnFail: 1000,
    });
  }

  async onModuleDestroy() {
    await this.queue.close();
    await this.redis.quit();
  }
}
