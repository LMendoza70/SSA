import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface PublicListParams {
  page?: number;
  limit?: number;
  contentTypeCode?: string;
}

export function usePublicPublications(params: PublicListParams) {
  return useQuery({
    queryKey: ['public-publications', params],
    queryFn: () =>
      api.get('/public/publications', { params }).then((res) => res.data),
  });
}

export function useFeaturedPublications() {
  return useQuery({
    queryKey: ['featured-publications'],
    queryFn: () =>
      api.get('/public/featured-publications').then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicPublication(slug: string) {
  return useQuery({
    queryKey: ['public-publication', slug],
    queryFn: () =>
      api.get(`/public/publications/${slug}`).then((res) => res.data),
    enabled: !!slug,
  });
}

export function usePublicSearch(q: string, page?: number) {
  return useQuery({
    queryKey: ['public-search', q, page],
    queryFn: () =>
      api.get('/public/search', { params: { q, page: page ?? 1 } }).then((res) => res.data),
    enabled: !!q,
  });
}
