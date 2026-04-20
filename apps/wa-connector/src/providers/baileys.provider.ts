import type { MessagingProvider } from './provider.interface';

export class BaileysProvider implements MessagingProvider {
  async connect(sessionId: string): Promise<void> {
    console.log(`[wa-connector] connect placeholder for session ${sessionId}`);
  }

  async disconnect(sessionId: string): Promise<void> {
    console.log(`[wa-connector] disconnect placeholder for session ${sessionId}`);
  }

  async status(): Promise<'connected' | 'disconnected' | 'connecting'> {
    return 'disconnected';
  }
}
