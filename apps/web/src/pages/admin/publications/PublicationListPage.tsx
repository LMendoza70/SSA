import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  MenuItem,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { usePublications, useWithdrawPublication, useArchivePublication } from '../../../hooks/usePublications';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'PUBLISHED', label: 'Publicado' },
  { value: 'WITHDRAWN', label: 'Retirado' },
  { value: 'ARCHIVED', label: 'Archivado' },
  { value: 'UPDATED', label: 'Actualizado' },
  { value: 'HISTORICALLY_CONTEXTUALIZED', label: 'Contextualizado' },
];

const STATUS_COLORS: Record<string, 'success' | 'error' | 'default' | 'info' | 'warning'> = {
  PUBLISHED: 'success',
  WITHDRAWN: 'error',
  ARCHIVED: 'default',
  UPDATED: 'info',
  HISTORICALLY_CONTEXTUALIZED: 'warning',
};

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: 'Publicado',
  WITHDRAWN: 'Retirado',
  ARCHIVED: 'Archivado',
  UPDATED: 'Actualizado',
  HISTORICALLY_CONTEXTUALIZED: 'Contextualizado',
};

export function PublicationListPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [status, setStatus] = useState('');

  const { data, isLoading } = usePublications({
    page: page + 1,
    limit: rowsPerPage,
    status: status || undefined,
  });

  const withdraw = useWithdrawPublication();
  const archive = useArchivePublication();

  const [confirmDialog, setConfirmDialog] = useState<{ id: string; action: 'withdraw' | 'archive' } | null>(null);

  const handleConfirm = async () => {
    if (!confirmDialog) return;
    try {
      if (confirmDialog.action === 'withdraw') {
        await withdraw.mutateAsync(confirmDialog.id);
      } else {
        await archive.mutateAsync(confirmDialog.id);
      }
    } finally {
      setConfirmDialog(null);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Publicaciones
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Estado"
            size="small"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            sx={{ minWidth: 180 }}
          >
            {STATUS_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título público</TableCell>
              <TableCell>Slug público</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Publicado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Cargando...</TableCell>
              </TableRow>
            ) : (data?.data || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Sin publicaciones</TableCell>
              </TableRow>
            ) : (
              (data?.data || []).map((item: any) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.publicTitle || '-'}</TableCell>
                  <TableCell>{item.publicSlug}</TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[item.status] || item.status}
                      color={STATUS_COLORS[item.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {item.status === 'PUBLISHED' && (
                        <Button
                          size="small"
                          color="warning"
                          onClick={() => setConfirmDialog({ id: item.id, action: 'withdraw' })}
                        >
                          Retirar
                        </Button>
                      )}
                      {item.status !== 'ARCHIVED' && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => setConfirmDialog({ id: item.id, action: 'archive' })}
                        >
                          Archivar
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data?.meta?.total || 0}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>

      <Dialog open={!!confirmDialog} onClose={() => setConfirmDialog(null)}>
        <DialogTitle>
          {confirmDialog?.action === 'withdraw' ? 'Retirar publicación' : 'Archivar publicación'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog?.action === 'withdraw'
              ? '¿Estás seguro de retirar esta publicación? Dejará de ser visible públicamente.'
              : '¿Estás seguro de archivar esta publicación? Esta acción es irreversible.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(null)}>Cancelar</Button>
          <Button
            onClick={handleConfirm}
            color={confirmDialog?.action === 'withdraw' ? 'warning' : 'error'}
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
