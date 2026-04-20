'use client';

import { useQuery } from '@tanstack/react-query';
import { crudApi } from '@/lib/api/services';

export const useUsers = () => useQuery({ queryKey: ['users'], queryFn: crudApi.users });
export const useContacts = (search?: string) => useQuery({ queryKey: ['contacts', search], queryFn: () => crudApi.contacts(search) });
export const useQueues = () => useQuery({ queryKey: ['queues'], queryFn: crudApi.queues });
export const useChannels = () => useQuery({ queryKey: ['channels'], queryFn: crudApi.channels });
export const useTags = () => useQuery({ queryKey: ['tags'], queryFn: crudApi.tags });
export const useQuickReplies = () => useQuery({ queryKey: ['quick-replies'], queryFn: crudApi.quickReplies });
