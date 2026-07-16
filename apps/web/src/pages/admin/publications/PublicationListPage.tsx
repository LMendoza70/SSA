import { useState, useEffect } from 'react';
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
import { usePublicationChannels, useAssociatePublicationChannels, useChannels, usePublishToChannel } from '../../../hooks/useCommunicationChannels';
import { usePublicationTraceability } from '../../../hooks/useTraceability';

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
  const [channelDialog, setChannelDialog] = useState<{ publicationId: string; open: boolean }>({ publicationId: '', open: false });
  const { data: pubChannels } = usePublicationChannels(channelDialog.publicationId);
  const { data: allChannels } = useChannels();
  const associateChannels = useAssociatePublicationChannels();
  const [selectedChIds, setSelectedChIds] = useState<string[]>([]);
  const publishToChannel = usePublishToChannel();
  const [traceDialog, setTraceDialog] = useState<{ publicationId: string; open: boolean }>({ publicationId: '', open: false });
  const { data: traceRecords } = usePublicationTraceability(traceDialog.publicationId);

  const handleOpenChannels = async (publicationId: string) => {
    setChannelDialog({ publicationId, open: true });
  };

  const handleSaveChannels = async () => {
    await associateChannels.mutateAsync({ publicationId: channelDialog.publicationId, channelIds: selectedChIds });
    setChannelDialog({ publicationId: '', open: false });
  };

  useEffect(() => {
    if (pubChannels) {
      setSelectedChIds(pubChannels.map((pc: any) => pc.channelId));
    }
  }, [pubChannels]);

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
                      <Button size="small" onClick={() => handleOpenChannels(item.id)}>Canales</Button>
                      <Button size="small" onClick={() => setTraceDialog({ publicationId: item.id, open: true })}>Trazabilidad</Button>
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

      <Dialog open={channelDialog.open} onClose={() => setChannelDialog({ publicationId: '', open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Canales de distribución</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Canales"
            fullWidth
            size="small"
            SelectProps={{
              multiple: true,
              value: selectedChIds,
              onChange: (e: any) => setSelectedChIds(e.target.value as string[]),
            }}
            sx={{ mt: 1 }}
          >
            {(allChannels || []).filter((ch: any) => ch.isActive).map((ch: any) => (
              <MenuItem key={ch.id} value={ch.id}>{ch.name}</MenuItem>
            ))}
          </TextField>
          {pubChannels && pubChannels.length > 0 && (
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>Estado de distribución</Typography>
              {pubChannels.map((pc: any) => (
                <Box key={pc.id} display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                  <Box flex={1}>
                    <Typography variant="body2">{pc.channel?.name || pc.channelId}</Typography>
                    <Chip
                      label={pc.status === 'MANUALLY_SHARED' ? 'Publicado' : pc.status === 'PREPARED' ? 'Preparado' : pc.status === 'CANCELLED' ? 'Cancelado' : 'Sin publicar'}
                      size="small"
                      color={pc.status === 'MANUALLY_SHARED' ? 'success' : pc.status === 'PREPARED' ? 'info' : 'default'}
                    />
                    {pc.sharedAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {new Date(pc.sharedAt).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    disabled={publishToChannel.isPending}
                    onClick={async () => {
                      try {
                        await publishToChannel.mutateAsync(pc.id);
                      } catch {
                        // Error al publicar
                      }
                    }}
                  >
                    {publishToChannel.isPending ? 'Publicando...' : 'Publicar ahora'}
                  </Button>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChannelDialog({ publicationId: '', open: false })}>Cerrar</Button>
          <Button variant="contained" onClick={handleSaveChannels}>Guardar canales</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={traceDialog.open} onClose={() => setTraceDialog({ publicationId: '', open: false })} maxWidth="md" fullWidth>
        <DialogTitle>Trazabilidad de publicación</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Acción</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!traceRecords || traceRecords.length === 0 ? (
                  <TableRow><TableCell colSpan={4}>Sin registros de trazabilidad</TableCell></TableRow>
                ) : (
                  traceRecords.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell><Chip label={r.action} size="small" variant="outlined" /></TableCell>
                      <TableCell>{r.user?.displayName || r.user?.email || r.userId}</TableCell>
                      <TableCell>{r.summary || '—'}</TableCell>
                      <TableCell>{new Date(r.occurredAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTraceDialog({ publicationId: '', open: false })}>Cerrar</Button>
        </DialogActions>
      </Dialog>

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
