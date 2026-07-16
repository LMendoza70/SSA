import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useAssociateContentSources() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, sourceIds }: { contentId: string; sourceIds: string[] }) =>
      api.post(`/admin/contents/${contentId}/sources`, { sourceIds }).then((res) => res.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['content', variables.contentId] });
    },
  });
}

export function useDisassociateContentSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, sourceId }: { contentId: string; sourceId: string }) =>
      api.delete(`/admin/contents/${contentId}/sources/${sourceId}`).then((res) => res.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['content', variables.contentId] });
    },
  });
}
