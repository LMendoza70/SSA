import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useContentTraceability(contentId: string) {
  return useQuery({
    queryKey: ['traceability', 'content', contentId],
    queryFn: () => api.get('/admin/traceability-records', { params: { contentId } }).then((r) => r.data),
    enabled: !!contentId,
  });
}

export function usePublicationTraceability(publicationId: string) {
  return useQuery({
    queryKey: ['traceability', 'publication', publicationId],
    queryFn: () => api.get('/admin/traceability-records', { params: { publicationId } }).then((r) => r.data),
    enabled: !!publicationId,
  });
}
