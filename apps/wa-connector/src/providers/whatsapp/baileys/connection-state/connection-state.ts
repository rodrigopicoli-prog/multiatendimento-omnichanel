export type WaConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'qr_required'
  | 'connected'
  | 'reconnecting'
  | 'error';

export type SessionState = {
  tenantId: string;
  channelId: string;
  status: WaConnectionStatus;
  qrCodeDataUrl?: string;
  lastError?: string;
  lastUpdateAt: string;
};

export function createInitialState(tenantId: string, channelId: string): SessionState {
  return {
    tenantId,
    channelId,
    status: 'disconnected',
    lastUpdateAt: new Date().toISOString(),
  };
}
