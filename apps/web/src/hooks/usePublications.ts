import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

interface PublicationListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export function usePublications(params: PublicationListParams) {
  return useQuery({
    queryKey: ['publications', params],
    queryFn: () =>
      api.get('/admin/publications', { params }).then((res) => res.data),
  });
}

export function usePublication(id: string) {
  return useQuery({
    queryKey: ['publication', id],
    queryFn: () => api.get(`/admin/publications/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreatePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, ...data }: any) =>
      api.post(`/admin/contents/${contentId}/publication`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}

export function useWithdrawPublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/admin/publications/${id}/withdrawal`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
}

export function useArchivePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/admin/publications/${id}/archive`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
}
