import type { WASocket } from '@whiskeysockets/baileys';
import { PayloadNormalizer } from '../payload-normalizer/payload-normalizer';

export class MessageListener {
  constructor(private readonly normalizer: PayloadNormalizer) {}

  bind(socket: WASocket, metadata: { tenantId: string; channelId: string }, onMessage: (message: ReturnType<PayloadNormalizer['normalize']>) => Promise<void>) {
    socket.ev.on('messages.upsert', async (event: any) => {
      if (event.type !== 'notify') return;
      for (const rawMessage of event.messages) {
        const normalized = this.normalizer.normalize({
          tenantId: metadata.tenantId,
          channelId: metadata.channelId,
          payload: rawMessage,
        });

        if (normalized) {
          await onMessage(normalized);
        }
      }
    });
  }
}
