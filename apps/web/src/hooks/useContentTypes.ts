import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useContentTypes() {
  return useQuery({
    queryKey: ['content-types'],
    queryFn: () =>
      api.get('/admin/content-types').then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}
