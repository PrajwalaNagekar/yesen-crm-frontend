import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as inquiriesApi from '../api/inquiries.js';

export function useBoard(filters) {
  return useQuery({
    queryKey: ['board', filters],
    queryFn: () => inquiriesApi.fetchBoard(filters),
    select: (data) => data.columns,
  });
}

export function useInquiry(id) {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: () => inquiriesApi.fetchInquiry(id),
    enabled: Boolean(id),
  });
}

// Every mutation below invalidates both the board (so Kanban columns
// refresh) and the specific inquiry detail (so the open drawer refreshes)
// - simplest correct approach given how small this dataset is; if the
// board ever gets large, this is the first place to optimize with
// optimistic updates instead of full refetches.
function useInvalidatingMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
      queryClient.invalidateQueries({ queryKey: ['unread-counts'] });
      const id = typeof variables === 'object' ? variables.id : variables;
      if (id) queryClient.invalidateQueries({ queryKey: ['inquiry', id] });
    },
  });
}

export function useMoveStage() {
  return useInvalidatingMutation(({ id, stage, lostReason }) =>
    inquiriesApi.moveInquiryStage(id, stage, lostReason)
  );
}

export function useUpdateInquiry() {
  return useInvalidatingMutation(({ id, updates }) => inquiriesApi.updateInquiry(id, updates));
}

export function useDeleteInquiry() {
  return useInvalidatingMutation(({ id }) => inquiriesApi.deleteInquiry(id));
}

export function useAddTag() {
  return useInvalidatingMutation(({ id, tag }) => inquiriesApi.addTag(id, tag));
}

export function useRemoveTag() {
  return useInvalidatingMutation(({ id, tag }) => inquiriesApi.removeTag(id, tag));
}

export function useSetQuotationStatus() {
  return useInvalidatingMutation(({ id, sent }) => inquiriesApi.setQuotationStatus(id, sent));
}

export function useAddLog() {
  return useInvalidatingMutation(({ id, type, message }) => inquiriesApi.addLog(id, type, message));
}

export function useUploadDocument() {
  return useInvalidatingMutation(({ id, file, type }) => inquiriesApi.uploadDocument(id, file, type));
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ docId }) => inquiriesApi.deleteDocument(docId),
    onSuccess: (_data, { inquiryId }) => {
      queryClient.invalidateQueries({ queryKey: ['inquiry', inquiryId] });
      queryClient.invalidateQueries({ queryKey: ['board'] });
      queryClient.invalidateQueries({ queryKey: ['unread-counts'] });
    },
  });
}

export function useMarkInquiryViewed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => inquiriesApi.markInquiryViewed(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
      queryClient.invalidateQueries({ queryKey: ['unread-counts'] });
      if (id) queryClient.invalidateQueries({ queryKey: ['inquiry', id] });
    },
  });
}
