import { MessageListener } from '../providers/whatsapp/baileys/message-listener/message-listener';
import { MessageSender } from '../providers/whatsapp/baileys/message-sender/message-sender';
import { PayloadNormalizer } from '../providers/whatsapp/baileys/payload-normalizer/payload-normalizer';
import { QrService } from '../providers/whatsapp/baileys/qr-service/qr-service';
import { RetryPolicy } from '../providers/whatsapp/baileys/retry-policy/retry-policy';
import { SessionManager } from '../providers/whatsapp/baileys/session-manager/session-manager';
import { SessionStore } from '../providers/whatsapp/baileys/session-store/session-store';
import type { SendMessageInput } from '../dto/send-message.dto';
import { BackendClientService } from './backend-client.service';

export class WhatsappService {
  private readonly sessionManager: SessionManager;

  constructor() {
    const store = new SessionStore();
    store.ensureBasePath();

    const normalizer = new PayloadNormalizer();
    const listener = new MessageListener(normalizer);

    this.sessionManager = new SessionManager(
      store,
      new QrService(),
      listener,
      new MessageSender(),
      new RetryPolicy(),
      new BackendClientService(),
    );
  }

  startSession(tenantId: string, channelId: string) {
    return this.sessionManager.startSession(tenantId, channelId);
  }

  getStatus(tenantId: string, channelId: string) {
    return this.sessionManager.getState(tenantId, channelId);
  }

  getQrCode(tenantId: string, channelId: string) {
    return this.sessionManager.getQrCode(tenantId, channelId);
  }

  sendMessage(payload: SendMessageInput) {
    return this.sessionManager.sendMessage(payload);
  }
}
