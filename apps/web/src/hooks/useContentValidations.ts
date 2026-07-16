import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useAssociateContentValidations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, validationIds }: { contentId: string; validationIds: string[] }) =>
      api.post(`/admin/contents/${contentId}/validations`, { validationIds }).then((res) => res.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['content', variables.contentId] });
    },
  });
}

export function useDisassociateContentValidation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, validationId }: { contentId: string; validationId: string }) =>
      api.delete(`/admin/contents/${contentId}/validations/${validationId}`).then((res) => res.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['content', variables.contentId] });
    },
  });
}
