import { z } from 'zod';

export const startSessionSchema = z.object({
  tenantId: z.string().min(1),
  channelId: z.string().min(1),
});

export type StartSessionInput = z.infer<typeof startSessionSchema>;
