import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useContentTypes(all?: boolean) {
  return useQuery({
    queryKey: ['content-types', { all }],
    queryFn: () =>
      api.get('/admin/content-types', { params: all ? { all: 'true' } : {} }).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateContentType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/admin/content-types', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content-types'] }),
  });
}

export function useUpdateContentType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/admin/content-types/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content-types'] }),
  });
}

export function useDeleteContentType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/content-types/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content-types'] }),
  });
}
