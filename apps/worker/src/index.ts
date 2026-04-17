import { sendMessageWorker } from './workers/send-message.worker';
import { enqueueSendMessageJob } from './jobs/send-message.producer';

async function bootstrap() {
  console.log('[worker] booting send-message worker');

  if (process.env.WORKER_BOOTSTRAP_TEST_JOB === 'true') {
    await enqueueSendMessageJob({
      tenantId: 'default-tenant',
      channelId: 'default-channel',
      conversationId: 'default-conversation',
      messageId: `boot-${Date.now()}`,
      to: '5511999999999',
      body: 'Worker online',
      type: 'TEXT',
    });
  }
}

sendMessageWorker.on('completed', (job) => {
  console.log('[worker] completed', job.id);
});

sendMessageWorker.on('failed', (job, error) => {
  console.error('[worker] failed', { id: job?.id, error: error.message });
});

void bootstrap();
