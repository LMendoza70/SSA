import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface PublicationReviewInput {
  contentId: string;
  decision: 'APPROVED' | 'CHANGES_REQUESTED';
  informationAccurate: boolean;
  informationCurrent: boolean;
  editorialQuality: boolean;
  mediaAuthorized: boolean;
  institutionalResponsibilityConfirmed: boolean;
  notes?: string;
}

export function usePublicationReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contentId, ...data }: PublicationReviewInput) =>
      api.post(`/admin/contents/${contentId}/publication-review`, data).then((res) => res.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content', variables.contentId] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });
}
