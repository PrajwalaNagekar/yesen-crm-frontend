import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as solutionsApi from '../api/solutions.js';

export function useSolutions() {
  return useQuery({
    queryKey: ['solutions'],
    queryFn: () => solutionsApi.fetchSolutions(),
  });
}

export function useSolution(id) {
  return useQuery({
    queryKey: ['solutions', id],
    queryFn: () => solutionsApi.fetchSolution(id),
    enabled: !!id,
  });
}

export function useCreateSolution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fields, imageFile }) => solutionsApi.createSolution(fields, imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solutions'] }),
  });
}

export function useUpdateSolution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields, imageFile }) => solutionsApi.updateSolution(id, fields, imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solutions'] }),
  });
}

export function useDeleteSolution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => solutionsApi.deleteSolution(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['solutions'] }),
  });
}
