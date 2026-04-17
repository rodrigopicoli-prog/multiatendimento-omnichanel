export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'AGENT';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type DashboardSummary = {
  conversationsToday: number;
  newConversations: number;
  averageFirstResponseTimeSeconds: number;
  averageHandlingTimeSeconds: number;
  closedConversations: number;
  conversationsByQueue: Array<{ queueId: string | null; _count: { _all: number } }>;
  conversationsByChannel: Array<{ channelId: string | null; _count: { _all: number } }>;
  conversationsByAgent: Array<{ assignedUserId: string | null; _count: { _all: number } }>;
};

export type Conversation = {
  id: string;
  status: string;
  unreadCount: number;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  queue?: { id: string; name: string };
  channel?: { id: string; name: string; type: string };
  assignedUser?: { id: string; name: string };
  contact: { id: string; name?: string; phone?: string; email?: string; profilePicUrl?: string };
  tags?: Array<{ tag: { id: string; name: string; color?: string } }>;
};

export type Message = {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND' | 'INTERNAL';
  type: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT' | 'FILE';
  body?: string;
  mediaUrl?: string;
  status: string;
  createdAt: string;
};
