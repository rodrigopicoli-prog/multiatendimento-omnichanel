'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { conversationsApi } from '@/lib/api/services';

export function useConversations(filter: string) {
  return useQuery({
    queryKey: ['conversations', filter],
    queryFn: () => conversationsApi.list(filter),
    refetchInterval: 10_000,
  });
}

export function useMessages(conversationId?: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => conversationsApi.messages(conversationId!),
    enabled: Boolean(conversationId),
    refetchInterval: 6_000,
  });
}

export function useSendMessage(conversationId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => conversationsApi.sendMessage(conversationId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
