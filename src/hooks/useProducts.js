import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as productsApi from '../api/products.js';

export function useProducts({ q, sort } = {}) {
  return useQuery({
    queryKey: ['products', { q, sort }],
    queryFn: () => productsApi.fetchProducts({ q, sort }),
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.fetchProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fields, imageFile }) => productsApi.createProduct(fields, imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields, imageFile }) => productsApi.updateProduct(id, fields, imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => productsApi.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
