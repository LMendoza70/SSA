import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

interface ContentListParams {
  page?: number;
  limit?: number;
  status?: string;
  contentTypeId?: string;
  search?: string;
}

export function useContents(params: ContentListParams) {
  return useQuery({
    queryKey: ['contents', params],
    queryFn: () =>
      api
        .get('/admin/contents', { params })
        .then((res) => res.data),
  });
}

export function useContent(id: string) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => api.get(`/admin/contents/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/admin/contents', data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) =>
      api.patch(`/admin/contents/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}

export function useDeleteContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/contents/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}
