import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useChannels() {
  return useQuery({
    queryKey: ['communication-channels'],
    queryFn: () => api.get('/admin/communication-channels').then((r) => r.data),
  });
}

export function useChannel(id: string) {
  return useQuery({
    queryKey: ['communication-channel', id],
    queryFn: () => api.get(`/admin/communication-channels/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/admin/communication-channels', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['communication-channels'] }),
  });
}

export function useUpdateChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/admin/communication-channels/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['communication-channels'] }),
  });
}

export function useDeleteChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/communication-channels/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['communication-channels'] }),
  });
}

export function usePublicationChannels(publicationId: string) {
  return useQuery({
    queryKey: ['publication-channels', publicationId],
    queryFn: () => api.get(`/admin/publications/${publicationId}/channels`).then((r) => r.data),
    enabled: !!publicationId,
  });
}

export function useAssociatePublicationChannels() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ publicationId, channelIds }: { publicationId: string; channelIds: string[] }) =>
      api.post(`/admin/publications/${publicationId}/channels`, { channelIds }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['publication-channels'] }),
  });
}

export function useUpdateDistribution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; status?: string; preparedText?: string }) =>
      api.patch(`/admin/publication-channels/${id}/distribution`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['publication-channels'] }),
  });
}

export function usePublishToChannel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/admin/publication-channels/${id}/publish`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['publication-channels'] }),
  });
}
