import { Chip } from '@mui/material';

const STATUS_COLORS: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
  DRAFT: 'default',
  PREPARED: 'info',
  NEEDS_REVIEW: 'warning',
  READY_FOR_PUBLICATION: 'success',
  ARCHIVED: 'error',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PREPARED: 'Preparado',
  NEEDS_REVIEW: 'Requiere revisión',
  READY_FOR_PUBLICATION: 'Listo para publicar',
  ARCHIVED: 'Archivado',
};

interface StatusChipProps {
  status: string;
}

export function StatusChip({ status }: StatusChipProps) {
  return (
    <Chip
      label={STATUS_LABELS[status] || status}
      color={STATUS_COLORS[status] || 'default'}
      size="small"
    />
  );
}
