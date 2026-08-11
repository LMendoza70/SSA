import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useMediaResources(params?: { page?: number; limit?: number; type?: string }) {
  return useQuery({
    queryKey: ['media-resources', params],
    queryFn: () =>
      api.get('/admin/media-resources', { params }).then((res) => res.data),
  });
}

export function useMediaResource(id: string) {
  return useQuery({
    queryKey: ['media-resource', id],
    queryFn: () => api.get(`/admin/media-resources/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post('/admin/media-resources/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-resources'] });
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) =>
      api.patch(`/admin/media-resources/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-resources'] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/admin/media-resources/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-resources'] });
    },
  });
}

export function useContentMedia(contentId: string) {
  return useQuery({
    queryKey: ['content-media', contentId],
    queryFn: () =>
      api.get(`/admin/media-resources/by-content/${contentId}`).then((res) => res.data),
    enabled: !!contentId,
  });
}

export function useAssociateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, mediaResourceIds }: { contentId: string; mediaResourceIds: string[] }) =>
      api.put(`/admin/media-resources/associate/${contentId}`, { mediaResourceIds }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-media'] });
    },
  });
}
