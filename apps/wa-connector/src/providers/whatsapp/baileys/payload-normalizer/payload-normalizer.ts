export type NormalizedInboundMessage = {
  tenantId: string;
  channelId: string;
  externalMessageId: string;
  remoteJid: string;
  senderName?: string;
  messageType: string;
  body?: string;
  mediaInfo?: Record<string, unknown>;
  timestamp: string;
  rawPayload: unknown;
};

export class PayloadNormalizer {
  normalize(params: { tenantId: string; channelId: string; payload: any }): NormalizedInboundMessage | null {
    const message = params.payload;
    const key = message?.key;

    if (!key?.id || !key?.remoteJid) {
      return null;
    }

    const content = message.message ?? {};
    const body =
      content?.conversation ||
      content?.extendedTextMessage?.text ||
      content?.imageMessage?.caption ||
      content?.videoMessage?.caption;

    const messageType = Object.keys(content)[0] ?? 'unknown';

    return {
      tenantId: params.tenantId,
      channelId: params.channelId,
      externalMessageId: key.id,
      remoteJid: key.remoteJid,
      senderName: message.pushName,
      messageType,
      body,
      mediaInfo: {
        mimetype: content?.imageMessage?.mimetype || content?.videoMessage?.mimetype || content?.documentMessage?.mimetype,
        url: content?.imageMessage?.url || content?.videoMessage?.url || content?.documentMessage?.url,
      },
      timestamp: new Date((message.messageTimestamp ?? Date.now()) * 1000).toISOString(),
      rawPayload: params.payload,
    };
  }
}
