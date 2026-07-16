import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

interface SourceListParams {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}

export function useSources(params: SourceListParams) {
  return useQuery({
    queryKey: ['sources', params],
    queryFn: () => api.get('/admin/sources', { params }).then((res) => res.data),
  });
}

export function useAllSources() {
  return useQuery({
    queryKey: ['sources', 'all'],
    queryFn: () => api.get('/admin/sources', { params: { limit: 200 } }).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSource(id: string) {
  return useQuery({
    queryKey: ['source', id],
    queryFn: () => api.get(`/admin/sources/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/admin/sources', data).then((res) => res.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sources'] }); },
  });
}

export function useUpdateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/admin/sources/${id}`, data).then((res) => res.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sources'] }); },
  });
}

export function useDeleteSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/sources/${id}`).then((res) => res.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sources'] }); },
  });
}
