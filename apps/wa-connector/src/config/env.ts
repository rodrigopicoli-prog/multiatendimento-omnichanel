import { z } from 'zod';

const schema = z.object({
  WA_CONNECTOR_PORT: z.coerce.number().default(4010),
  WA_SESSIONS_PATH: z.string().default('/var/lib/wa-sessions'),
  INTERNAL_SERVICE_TOKEN: z.string().min(8),
  BACKEND_INTERNAL_URL: z.string().url().default('http://backend:4000/api/internal'),
  LOG_LEVEL: z.string().default('info'),
});

export const env = schema.parse(process.env);
