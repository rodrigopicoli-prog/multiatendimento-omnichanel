export type SendMessageJobPayload = {
  tenantId: string;
  channelId: string;
  conversationId: string;
  messageId: string;
  to: string;
  body?: string;
  type?: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT' | 'FILE';
  mediaUrl?: string;
};
