import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useDiseases() {
  return useQuery({
    queryKey: ['diseases'],
    queryFn: () => api.get('/admin/diseases').then((r) => r.data),
  });
}

export function useDisease(id: string) {
  return useQuery({
    queryKey: ['disease', id],
    queryFn: () => api.get(`/admin/diseases/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/admin/diseases', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diseases'] }),
  });
}

export function useUpdateDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/admin/diseases/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diseases'] }),
  });
}

export function useDeleteDisease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/diseases/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diseases'] }),
  });
}
