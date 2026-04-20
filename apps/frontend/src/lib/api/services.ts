import { http } from './http';
import type { Conversation, DashboardSummary, LoginResponse, Message } from '@/types/api';

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    http<LoginResponse>('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify(payload),
    }),
  me: () => http<LoginResponse['user']>('/auth/me'),
  logout: () => http('/auth/logout', { method: 'POST' }),
};

export const dashboardApi = {
  summary: () => http<DashboardSummary>('/dashboard/summary'),
};

export const conversationsApi = {
  list: (filter = 'all') => http<Conversation[]>(`/conversations?filter=${filter}`),
  detail: (id: string) => http<Conversation>(`/conversations/${id}`),
  messages: (conversationId: string) =>
    http<Message[]>(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, body: string) =>
    http(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ body, type: 'TEXT' }),
    }),
};

export const crudApi = {
  users: () => http<any[]>('/users'),
  contacts: (search?: string) => http<any[]>(`/contacts${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  queues: () => http<any[]>('/queues'),
  channels: () => http<any[]>('/channels'),
  tags: () => http<any[]>('/tags'),
  quickReplies: () => http<any[]>('/quick-replies'),
};
