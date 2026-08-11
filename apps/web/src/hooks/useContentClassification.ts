import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useContentCategories(contentId: string) {
  return useQuery({
    queryKey: ['content-categories', contentId],
    queryFn: () => api.get(`/admin/contents/${contentId}/categories`).then((r) => r.data),
    enabled: !!contentId,
  });
}

export function useContentTags(contentId: string) {
  return useQuery({
    queryKey: ['content-tags', contentId],
    queryFn: () => api.get(`/admin/contents/${contentId}/tags`).then((r) => r.data),
    enabled: !!contentId,
  });
}

export function useAssociateContentCategories() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, categoryIds }: { contentId: string; categoryIds: string[] }) =>
      api.post(`/admin/contents/${contentId}/categories`, { categoryIds }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content-categories'] }),
  });
}

export function useAssociateContentTags() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, tagIds }: { contentId: string; tagIds: string[] }) =>
      api.post(`/admin/contents/${contentId}/tags`, { tagIds }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['content-tags'] }),
  });
}
