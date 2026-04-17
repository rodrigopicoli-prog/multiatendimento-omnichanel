import { Job, Worker } from 'bullmq';
import { redisConnection } from '../queues/connection';
import { QUEUE_NAMES } from '../queues/names';
import type { SendMessageJobPayload } from '../types/message-job';
import { backendInternalClient, waConnectorClient } from '../services/internal-clients';

async function processor(job: Job<SendMessageJobPayload>) {
  const payload = job.data;

  await backendInternalClient.updateMessageStatus({
    tenantId: payload.tenantId,
    channelId: payload.channelId,
    conversationId: payload.conversationId,
    messageId: payload.messageId,
    status: 'queued',
  });

  try {
    const response = await waConnectorClient.sendMessage(payload);

    await backendInternalClient.updateMessageStatus({
      tenantId: payload.tenantId,
      channelId: payload.channelId,
      conversationId: payload.conversationId,
      messageId: payload.messageId,
      status: 'sent',
      externalMessageId: response.result.externalMessageId,
    });

    return response;
  } catch (error) {
    await backendInternalClient.updateMessageStatus({
      tenantId: payload.tenantId,
      channelId: payload.channelId,
      conversationId: payload.conversationId,
      messageId: payload.messageId,
      status: 'failed',
      reason: error instanceof Error ? error.message : 'unknown error',
    });

    throw error;
  }
}

export const sendMessageWorker = new Worker(QUEUE_NAMES.SEND_MESSAGE, processor, {
  connection: redisConnection,
  concurrency: 5,
});
