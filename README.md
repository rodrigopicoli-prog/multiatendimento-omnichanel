# Omnichannel Multiatendimento SaaS

Monorepo de plataforma omnichannel multi-tenant.

## Etapa 4 — Mensageria desacoplada (WA Connector + Worker + Realtime)

Nesta etapa foi implementada a camada de mensageria desacoplada entre serviços:

- `wa-connector` com estrutura Baileys para múltiplas sessões por `tenant/channel`.
- persistência de sessão em volume (`WA_SESSIONS_PATH`).
- endpoints internos para iniciar sessão, consultar status/QR e enviar mensagem.
- listener inbound com normalização e envio ao backend interno.
- worker BullMQ com fila `send-message` e retries exponenciais.
- backend com endpoints internos para ingestão inbound e status.
- backend emitindo eventos websocket (`message.inbound`, `message.status`, `conversation.updated`).

## Fluxo de envio

1. Backend cria mensagem outbound pendente.
2. Backend enfileira job `send-message` no Redis/BullMQ.
3. Worker processa job e chama `wa-connector` interno.
4. `wa-connector` envia via Baileys.
5. `wa-connector`/worker notificam backend via endpoint interno de status.
6. Backend atualiza banco e emite evento em tempo real.

## Fluxo inbound

1. Baileys recebe mensagem.
2. `wa-connector` normaliza payload.
3. `wa-connector` chama `POST /api/internal/messages/inbound` no backend.
4. Backend cria/atualiza conversa, salva mensagem e incrementa não lidas.
5. Backend emite evento websocket para frontend.

## Variáveis importantes

```bash
INTERNAL_SERVICE_TOKEN=change-me
BACKEND_INTERNAL_URL=http://backend:4000/api/internal
WA_CONNECTOR_INTERNAL_URL=http://wa-connector:4010/internal
WA_SESSIONS_PATH=/var/lib/wa-sessions
REDIS_URL=redis://redis:6379
```

## Endpoints internos

### Backend

- `POST /api/internal/messages/inbound`
- `POST /api/internal/messages/status`

### WA Connector

- `POST /internal/sessions/start`
- `GET /internal/sessions/:tenantId/:channelId/status`
- `GET /internal/sessions/:tenantId/:channelId/qr`
- `POST /internal/messages/send`

Todos protegidos por `x-internal-token`.
