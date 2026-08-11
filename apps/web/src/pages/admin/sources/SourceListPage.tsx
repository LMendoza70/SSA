import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, IconButton, Select, MenuItem, FormControl,
  InputLabel, Switch, FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSources, useCreateSource, useUpdateSource, useDeleteSource } from '../../../hooks/useSources';

const SOURCE_TYPES = [
  { value: 'OFFICIAL_EXTERNAL', label: 'Externa oficial' },
  { value: 'INSTITUTIONAL_INTERNAL', label: 'Interna institucional' },
  { value: 'DOCUMENTARY', label: 'Documental' },
  { value: 'HISTORICAL', label: 'Histórica' },
  { value: 'JURISDICTION_GENERATED', label: 'Generada por la Jurisdicción' },
];

export function SourceListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSources({ page, limit: 20 });
  const create = useCreateSource();
  const update = useUpdateSource();
  const remove = useDeleteSource();

  const [dialog, setDialog] = useState<{
    mode: 'create' | 'edit'; id?: string;
    type: string; name: string; description: string;
    organization: string; url: string; isOfficial: boolean;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!dialog) return;
    setError('');
    if (!dialog.name.trim()) { setError('El nombre es obligatorio'); return; }
    try {
      const payload = {
        type: dialog.type,
        name: dialog.name.trim(),
        description: dialog.description || undefined,
        organization: dialog.organization || undefined,
        url: dialog.url || undefined,
        isOfficial: dialog.isOfficial,
      };
      if (dialog.mode === 'create') {
        await create.mutateAsync(payload);
      } else {
        await update.mutateAsync({ id: dialog.id, ...payload });
      }
      setDialog(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await remove.mutateAsync(deleteId); } finally { setDeleteId(null); }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>Fuentes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({
          mode: 'create', type: 'INSTITUTIONAL_INTERNAL', name: '', description: '',
          organization: '', url: '', isOfficial: false,
        })}>
          Nueva fuente
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Organización</TableCell>
              <TableCell>Oficial</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} align="center">Cargando...</TableCell></TableRow>
            ) : !data?.data?.length ? (
              <TableRow><TableCell colSpan={5} align="center">Sin fuentes</TableCell></TableRow>
            ) : data.data.map((src: any) => (
              <TableRow key={src.id} hover>
                <TableCell>{src.name}</TableCell>
                <TableCell>{SOURCE_TYPES.find(t => t.value === src.type)?.label || src.type}</TableCell>
                <TableCell>{src.organization || '-'}</TableCell>
                <TableCell>{src.isOfficial ? 'Sí' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setDialog({
                    mode: 'edit', id: src.id, type: src.type, name: src.name,
                    description: src.description || '', organization: src.organization || '',
                    url: src.url || '', isOfficial: src.isOfficial,
                  })}><EditIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => setDeleteId(src.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data?.meta && (
        <Stack direction="row" justifyContent="center" spacing={2} mt={2}>
          <Button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
          <Typography sx={{ alignSelf: 'center' }}>Página {page} de {data.meta.totalPages}</Typography>
          <Button disabled={page >= data.meta.totalPages} onClick={() => setPage(p => p + 1)}>Siguiente</Button>
        </Stack>
      )}

      <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog?.mode === 'create' ? 'Nueva fuente' : 'Editar fuente'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select label="Tipo" value={dialog?.type || 'INSTITUTIONAL_INTERNAL'} onChange={(e) => setDialog(d => d ? { ...d, type: e.target.value } : null)}>
                {SOURCE_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Nombre" fullWidth required value={dialog?.name || ''} onChange={(e) => setDialog(d => d ? { ...d, name: e.target.value } : null)} />
            <TextField label="Descripción" fullWidth multiline rows={2} value={dialog?.description || ''} onChange={(e) => setDialog(d => d ? { ...d, description: e.target.value } : null)} />
            <TextField label="Organización" fullWidth value={dialog?.organization || ''} onChange={(e) => setDialog(d => d ? { ...d, organization: e.target.value } : null)} />
            <TextField label="URL" fullWidth value={dialog?.url || ''} onChange={(e) => setDialog(d => d ? { ...d, url: e.target.value } : null)} />
            <FormControlLabel control={<Switch checked={dialog?.isOfficial || false} onChange={(e) => setDialog(d => d ? { ...d, isOfficial: e.target.checked } : null)} />} label="Fuente oficial" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={create.isPending || update.isPending}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Eliminar fuente</DialogTitle>
        <DialogContent><Typography>¿Estás seguro de eliminar esta fuente?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
