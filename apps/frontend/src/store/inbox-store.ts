'use client';

import { create } from 'zustand';

type InboxState = {
  activeConversationId: string | null;
  filter: 'all' | 'unread' | 'mine' | 'pending' | 'closed';
  search: string;
  setActiveConversation: (id: string | null) => void;
  setFilter: (filter: InboxState['filter']) => void;
  setSearch: (search: string) => void;
};

export const useInboxStore = create<InboxState>((set) => ({
  activeConversationId: null,
  filter: 'all',
  search: '',
  setActiveConversation: (activeConversationId) => set({ activeConversationId }),
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
}));
