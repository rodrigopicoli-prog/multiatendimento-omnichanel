export type TenantScoped = {
  tenantId: string;
};

export enum ChannelType {
  WHATSAPP = 'WHATSAPP',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  WEBCHAT = 'WEBCHAT',
  EMAIL = 'EMAIL',
}

export enum ConversationStatus {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}
