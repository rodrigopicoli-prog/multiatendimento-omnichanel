import { z } from 'zod';

export const sendMessageSchema = z.object({
  tenantId: z.string().min(1),
  channelId: z.string().min(1),
  conversationId: z.string().min(1),
  messageId: z.string().min(1),
  to: z.string().min(3),
  body: z.string().optional(),
  type: z.enum(['TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'DOCUMENT', 'FILE']).default('TEXT'),
  mediaUrl: z.string().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
