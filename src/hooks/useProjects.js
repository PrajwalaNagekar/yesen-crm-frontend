import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as projectsApi from '../api/projects.js';

export function useProjects({ page = 1, limit = 9, status, q, sort } = {}) {
  return useQuery({
    queryKey: ['projects', { page, limit, status, q, sort }],
    queryFn: () => projectsApi.fetchProjects({ page, limit, status, q, sort }),
    placeholderData: keepPreviousData,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fields, imageFile, sitePhotographyFiles, sitePhotography }) =>
      projectsApi.createProject(fields, imageFile, sitePhotographyFiles, sitePhotography),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields, imageFile, sitePhotographyFiles, sitePhotography }) =>
      projectsApi.updateProject(id, fields, imageFile, sitePhotographyFiles, sitePhotography),
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
