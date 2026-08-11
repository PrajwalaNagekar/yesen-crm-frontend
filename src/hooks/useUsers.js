import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as usersApi from '../api/users.js';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.fetchUsers,
    select: (data) => data.users,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }) => usersApi.updateUser(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}
