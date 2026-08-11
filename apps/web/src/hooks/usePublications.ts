import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

interface PublicationListParams {
  page?: number;
  limit?: number;
  status?: string;
}

interface CreatePublicationInput {
  contentId: string;
  publicSlug?: string;
  publicTitle?: string;
  institutionalResponsibility: string;
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
    mutationFn: ({ contentId, ...data }: CreatePublicationInput) =>
      api.post(`/admin/contents/${contentId}/publication`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}

interface PublishToSocialsInput {
  contentId: string;
  publicSlug?: string;
  publicTitle?: string;
  institutionalResponsibility: string;
  channelIds: string[];
  urlImagenTemporal?: string;
}

export function usePublishToSocials() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, ...data }: PublishToSocialsInput) =>
      api.post(`/admin/contents/${contentId}/publish-to-socials`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.invalidateQueries({ queryKey: ['content-analysis'] });
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

export function useRepublishPublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/admin/publications/${id}/republish`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
}
