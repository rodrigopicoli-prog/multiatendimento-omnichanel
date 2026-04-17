export interface MessagingProvider {
  connect(sessionId: string): Promise<void>;
  disconnect(sessionId: string): Promise<void>;
  status(sessionId: string): Promise<'connected' | 'disconnected' | 'connecting'>;
}
