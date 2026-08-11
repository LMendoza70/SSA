import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useTimelineEvents() {
  return useQuery({
    queryKey: ['timeline-events'],
    queryFn: () => api.get('/admin/timeline-events').then((r) => r.data),
  });
}

export function useTimelineEvent(id: string) {
  return useQuery({
    queryKey: ['timeline-event', id],
    queryFn: () => api.get(`/admin/timeline-events/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateTimelineEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/admin/timeline-events', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timeline-events'] }),
  });
}

export function useUpdateTimelineEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/admin/timeline-events/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timeline-events'] }),
  });
}

export function useDeleteTimelineEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/admin/timeline-events/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['timeline-events'] }),
  });
}

export function usePublicTimelineEvents() {
  return useQuery({
    queryKey: ['public-timeline-events'],
    queryFn: () => api.get('/public/timeline-events').then((r) => r.data),
  });
}

export function usePublicTimelineEvent(slug: string) {
  return useQuery({
    queryKey: ['public-timeline-event', slug],
    queryFn: () => api.get(`/public/timeline-events/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });
}
