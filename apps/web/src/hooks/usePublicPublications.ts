import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface PublicListParams {
  page?: number;
  limit?: number;
  contentTypeCode?: string;
  categoryId?: string;
  tagId?: string;
}

export function usePublicPublications(params: PublicListParams) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''),
  );
  return useQuery({
    queryKey: ['public-publications', cleanParams],
    queryFn: () =>
      api.get('/public/publications', { params: cleanParams }).then((res) => res.data),
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

export function usePublicCategories() {
  return useQuery({
    queryKey: ['public-categories'],
    queryFn: () =>
      api.get('/public/categories').then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePublicTags() {
  return useQuery({
    queryKey: ['public-tags'],
    queryFn: () =>
      api.get('/public/tags').then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
}
