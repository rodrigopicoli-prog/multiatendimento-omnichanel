import { Queue } from 'bullmq';
import { redisConnection } from '../queues/connection';
import { QUEUE_NAMES } from '../queues/names';
import type { SendMessageJobPayload } from '../types/message-job';

const queue = new Queue<SendMessageJobPayload>(QUEUE_NAMES.SEND_MESSAGE, { connection: redisConnection });

export async function enqueueSendMessageJob(payload: SendMessageJobPayload) {
  return queue.add('send-message', payload, {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 500,
    removeOnFail: 1000,
  });
}
