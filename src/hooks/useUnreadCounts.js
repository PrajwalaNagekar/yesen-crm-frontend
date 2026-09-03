import { useQuery } from '@tanstack/react-query';
import { fetchUnreadCounts } from '../api/meta.js';

export function useUnreadCounts() {
  return useQuery({
    queryKey: ['unread-counts'],
    queryFn: fetchUnreadCounts,
    refetchInterval: 60_000,
  });
}
