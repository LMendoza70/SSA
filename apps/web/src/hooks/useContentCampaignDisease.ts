import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useContentCampaigns(contentId: string) {
  return useQuery({
    queryKey: ['content-campaigns', contentId],
    queryFn: () => api.get(`/admin/contents/${contentId}/campaigns`).then((r) => r.data),
    enabled: !!contentId,
  });
}

export function useContentDiseases(contentId: string) {
  return useQuery({
    queryKey: ['content-diseases', contentId],
    queryFn: () => api.get(`/admin/contents/${contentId}/diseases`).then((r) => r.data),
    enabled: !!contentId,
  });
}

export function useAssociateContentCampaigns() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, campaignIds }: { contentId: string; campaignIds: string[] }) =>
      api.post(`/admin/contents/${contentId}/campaigns`, { campaignIds }).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['content-campaigns', variables.contentId] });
    },
  });
}

export function useAssociateContentDiseases() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, diseaseIds }: { contentId: string; diseaseIds: string[] }) =>
      api.post(`/admin/contents/${contentId}/diseases`, { diseaseIds }).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['content-diseases', variables.contentId] });
    },
  });
}
