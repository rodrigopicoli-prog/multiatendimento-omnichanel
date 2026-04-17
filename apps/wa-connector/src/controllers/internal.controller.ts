import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { sendMessageSchema } from '../dto/send-message.dto';
import { startSessionSchema } from '../dto/session.dto';
import { env } from '../config/env';
import { WhatsappService } from '../services/whatsapp.service';

function assertInternalToken(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers['x-internal-token'];
  if (token !== env.INTERNAL_SERVICE_TOKEN) {
    reply.code(401).send({ message: 'unauthorized internal token' });
    return false;
  }
  return true;
}

export async function registerInternalController(app: FastifyInstance, service: WhatsappService) {
  app.post('/internal/sessions/start', async (request, reply) => {
    if (!assertInternalToken(request, reply)) return;
    const input = startSessionSchema.parse(request.body);
    const state = await service.startSession(input.tenantId, input.channelId);
    return { ok: true, state };
  });

  app.get('/internal/sessions/:tenantId/:channelId/status', async (request, reply) => {
    if (!assertInternalToken(request, reply)) return;
    const { tenantId, channelId } = request.params as { tenantId: string; channelId: string };
    return service.getStatus(tenantId, channelId);
  });

  app.get('/internal/sessions/:tenantId/:channelId/qr', async (request, reply) => {
    if (!assertInternalToken(request, reply)) return;
    const { tenantId, channelId } = request.params as { tenantId: string; channelId: string };
    return { qrCodeDataUrl: service.getQrCode(tenantId, channelId) };
  });

  app.post('/internal/messages/send', async (request, reply) => {
    if (!assertInternalToken(request, reply)) return;
    const input = sendMessageSchema.parse(request.body);
    const result = await service.sendMessage(input);
    return { ok: true, result };
  });
}
