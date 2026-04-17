import Fastify from 'fastify';
import { registerHealthRoute } from './health/health.route';
import { env } from './config/env';
import { logger } from './utils/logger';
import { registerInternalController } from './controllers/internal.controller';
import { WhatsappService } from './services/whatsapp.service';

async function bootstrap() {
  const app = Fastify({ logger });
  const whatsappService = new WhatsappService();

  await registerHealthRoute(app);
  await registerInternalController(app, whatsappService);

  await app.listen({ port: env.WA_CONNECTOR_PORT, host: '0.0.0.0' });
  logger.info({ port: env.WA_CONNECTOR_PORT }, 'wa-connector running');
}

void bootstrap();
