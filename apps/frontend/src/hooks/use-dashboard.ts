'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/services';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.summary,
    refetchInterval: 30_000,
  });
}
