import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as testimonialsApi from '../api/testimonials.js';

export function useTestimonials({ page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: ['testimonials', { page, limit }],
    queryFn: () => testimonialsApi.fetchTestimonials({ page, limit }),
    placeholderData: keepPreviousData,
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: testimonialsApi.createTestimonial,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => testimonialsApi.updateTestimonial(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => testimonialsApi.deleteTestimonial(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}
