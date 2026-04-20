import { z } from 'zod';

const schema = z.object({
  REDIS_URL: z.string().min(1),
  BACKEND_INTERNAL_URL: z.string().url().default('http://backend:4000/api/internal'),
  WA_CONNECTOR_INTERNAL_URL: z.string().url().default('http://wa-connector:4010/internal'),
  INTERNAL_SERVICE_TOKEN: z.string().min(8),
});

export const env = schema.parse(process.env);
