import { useQuery } from '@tanstack/react-query';
import { fetchPipeline } from '../api/meta.js';

export function usePipeline() {
  return useQuery({
    queryKey: ['pipeline'],
    queryFn: fetchPipeline,
    staleTime: Infinity, // hard-coded on the backend, never changes during a session
  });
}
