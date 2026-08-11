import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function usePublicCampaigns() {
  return useQuery({
    queryKey: ['public-campaigns'],
    queryFn: () => api.get('/public/campaigns').then((r) => r.data),
  });
}

export function usePublicCampaign(slug: string) {
  return useQuery({
    queryKey: ['public-campaign', slug],
    queryFn: () => api.get(`/public/campaigns/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });
}

export function usePublicDiseases() {
  return useQuery({
    queryKey: ['public-diseases'],
    queryFn: () => api.get('/public/diseases').then((r) => r.data),
  });
}

export function usePublicDisease(slug: string) {
  return useQuery({
    queryKey: ['public-disease', slug],
    queryFn: () => api.get(`/public/diseases/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });
}
