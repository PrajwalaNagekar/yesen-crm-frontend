import { useQuery } from '@tanstack/react-query';
import { fetchTeam } from '../api/meta.js';

/** Active team members for assignment filters and pickers (all roles). */
export function useTeam() {
  return useQuery({
    queryKey: ['team'],
    queryFn: fetchTeam,
    select: (data) => data.team ?? [],
    staleTime: 60_000,
    retry: 1,
    // Don't block the pipeline if team roster is temporarily unavailable
    placeholderData: { team: [] },
  });
}
