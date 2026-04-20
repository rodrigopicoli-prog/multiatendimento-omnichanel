import makeWASocket, { DisconnectReason, useMultiFileAuthState, type WASocket } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { SessionStore } from '../session-store/session-store';
import { QrService } from '../qr-service/qr-service';
import { MessageListener } from '../message-listener/message-listener';
import { MessageSender } from '../message-sender/message-sender';
import { RetryPolicy } from '../retry-policy/retry-policy';
import { createInitialState, SessionState } from '../connection-state/connection-state';
import type { SendMessageInput } from '../../../../dto/send-message.dto';
import { logger } from '../../../../utils/logger';
import { BackendClientService } from '../../../../services/backend-client.service';

type SessionKey = `${string}:${string}`;

type ManagedSession = {
  socket: WASocket;
  state: SessionState;
  retries: number;
};

export class SessionManager {
  private readonly sessions = new Map<SessionKey, ManagedSession>();

  constructor(
    private readonly sessionStore: SessionStore,
    private readonly qrService: QrService,
    private readonly messageListener: MessageListener,
    private readonly messageSender: MessageSender,
    private readonly retryPolicy: RetryPolicy,
    private readonly backendClient: BackendClientService,
  ) {}

  private key(tenantId: string, channelId: string): SessionKey {
    return `${tenantId}:${channelId}`;
  }

  getState(tenantId: string, channelId: string) {
    return this.sessions.get(this.key(tenantId, channelId))?.state ?? createInitialState(tenantId, channelId);
  }

  getQrCode(tenantId: string, channelId: string) {
    return this.getState(tenantId, channelId).qrCodeDataUrl;
  }

  async startSession(tenantId: string, channelId: string) {
    const key = this.key(tenantId, channelId);
    if (this.sessions.has(key)) {
      return this.sessions.get(key)?.state;
    }

    const sessionDir = this.sessionStore.resolveSessionDir(tenantId, channelId);
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      markOnlineOnConnect: false,
      defaultQueryTimeoutMs: 30_000,
    });

    const managed: ManagedSession = {
      socket,
      state: { ...createInitialState(tenantId, channelId), status: 'connecting' },
      retries: 0,
    };

    this.sessions.set(key, managed);

    socket.ev.on('creds.update', saveCreds);

    this.messageListener.bind(socket, { tenantId, channelId }, async (message) => {
      await this.backendClient.notifyInbound(message);
    });

    socket.ev.on('connection.update', async (update) => {
      if (update.qr) {
        managed.state.qrCodeDataUrl = await this.qrService.toDataUrl(update.qr);
        managed.state.status = 'qr_required';
      }

      if (update.connection === 'open') {
        managed.state.status = 'connected';
        managed.state.qrCodeDataUrl = undefined;
        managed.retries = 0;
        logger.info({ tenantId, channelId }, 'whatsapp session connected');
      }

      if (update.connection === 'close') {
        const statusCode = (update.lastDisconnect?.error as Boom | undefined)?.output?.statusCode;
        const loggedOut = statusCode === DisconnectReason.loggedOut;

        if (loggedOut) {
          managed.state.status = 'disconnected';
          managed.state.lastError = 'logged_out';
          this.sessions.delete(key);
          logger.warn({ tenantId, channelId }, 'session logged out');
          return;
        }

        managed.retries += 1;
        if (this.retryPolicy.shouldReconnect(managed.retries)) {
          managed.state.status = 'reconnecting';
          const delay = this.retryPolicy.backoffMs(managed.retries);
          logger.warn({ tenantId, channelId, retries: managed.retries, delay }, 'reconnecting session');
          setTimeout(() => {
            this.sessions.delete(key);
            void this.startSession(tenantId, channelId);
          }, delay);
        } else {
          managed.state.status = 'error';
          managed.state.lastError = 'max_retries';
          logger.error({ tenantId, channelId }, 'session reached max retries');
        }
      }

      managed.state.lastUpdateAt = new Date().toISOString();
    });

    return managed.state;
  }

  async sendMessage(payload: SendMessageInput) {
    const key = this.key(payload.tenantId, payload.channelId);
    let session = this.sessions.get(key);

    if (!session) {
      await this.startSession(payload.tenantId, payload.channelId);
      session = this.sessions.get(key);
    }

    if (!session) {
      throw new Error('Session unavailable');
    }

    if (session.state.status !== 'connected') {
      throw new Error(`Session not connected: ${session.state.status}`);
    }

    const response = await this.messageSender.send(session.socket, payload);

    await this.backendClient.notifyStatus({
      tenantId: payload.tenantId,
      channelId: payload.channelId,
      conversationId: payload.conversationId,
      messageId: payload.messageId,
      status: 'sent',
      externalMessageId: response?.key?.id,
    });

    return {
      status: 'sent',
      externalMessageId: response?.key?.id,
      channelId: payload.channelId,
      tenantId: payload.tenantId,
    };
  }
}
