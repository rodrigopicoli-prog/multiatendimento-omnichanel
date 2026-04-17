import { env } from '../config/env';
import { logger } from '../utils/logger';

type InternalMessageStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

export class BackendClientService {
  private headers() {
    return {
      'Content-Type': 'application/json',
      'x-internal-token': env.INTERNAL_SERVICE_TOKEN,
    };
  }

  async notifyInbound(payload: unknown) {
    await fetch(`${env.BACKEND_INTERNAL_URL}/messages/inbound`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
  }

  async notifyStatus(payload: {
    tenantId: string;
    channelId: string;
    conversationId: string;
    messageId: string;
    status: InternalMessageStatus;
    externalMessageId?: string;
    reason?: string;
  }) {
    await fetch(`${env.BACKEND_INTERNAL_URL}/messages/status`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    }).catch((error) => {
      logger.error({ error, payload }, 'failed to notify backend status');
    });
  }
}
