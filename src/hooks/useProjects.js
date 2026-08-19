import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as projectsApi from '../api/projects.js';

export function useProjects({ page = 1, limit = 9, status } = {}) {
  return useQuery({
    queryKey: ['projects', { page, limit, status }],
    queryFn: () => projectsApi.fetchProjects({ page, limit, status }),
    placeholderData: keepPreviousData,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fields, imageFile }) => projectsApi.createProject(fields, imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields, imageFile }) => projectsApi.updateProject(id, fields, imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => projectsApi.deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
}
