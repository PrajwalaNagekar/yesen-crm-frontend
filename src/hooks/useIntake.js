import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as intakeApi from '../api/intake.js';

const SUBMITTERS = {
  product: intakeApi.submitProductIntake,
  service: intakeApi.submitServiceIntake,
  contact: intakeApi.submitContactIntake,
};

export function useCreateIntake() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, payload }) => {
      const submit = SUBMITTERS[type];
      if (!submit) throw new Error('Invalid intake type');
      return submit(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
      queryClient.invalidateQueries({ queryKey: ['unread-counts'] });
    },
  });
}
