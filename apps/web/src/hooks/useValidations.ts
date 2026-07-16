import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

interface ValidationListParams {
  page?: number;
  limit?: number;
  type?: string;
  result?: string;
  search?: string;
}

export function useValidations(params: ValidationListParams) {
  return useQuery({
    queryKey: ['validations', params],
    queryFn: () => api.get('/admin/validations', { params }).then((res) => res.data),
  });
}

export function useAllValidations() {
  return useQuery({
    queryKey: ['validations', 'all'],
    queryFn: () => api.get('/admin/validations', { params: { limit: 200 } }).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useValidation(id: string) {
  return useQuery({
    queryKey: ['validation', id],
    queryFn: () => api.get(`/admin/validations/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}

export function useCreateValidation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/admin/validations', data).then((res) => res.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['validations'] }); },
  });
}

export function useUpdateValidation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/admin/validations/${id}`, data).then((res) => res.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['validations'] }); },
  });
}
