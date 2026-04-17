import { env } from '../config/env';
import type { SendMessageJobPayload } from '../types/message-job';

function headers() {
  return {
    'Content-Type': 'application/json',
    'x-internal-token': env.INTERNAL_SERVICE_TOKEN,
  };
}

export const backendInternalClient = {
  async updateMessageStatus(payload: {
    tenantId: string;
    channelId: string;
    conversationId: string;
    messageId: string;
    status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
    reason?: string;
    externalMessageId?: string;
  }) {
    await fetch(`${env.BACKEND_INTERNAL_URL}/messages/status`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });
  },
};

export const waConnectorClient = {
  async sendMessage(payload: SendMessageJobPayload) {
    const response = await fetch(`${env.WA_CONNECTOR_INTERNAL_URL}/messages/send`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json() as Promise<{ ok: true; result: { externalMessageId?: string } }>;
  },
};
