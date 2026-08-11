import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '../../../hooks/useTags';

export function TagListPage() {
  const { data: tags, isLoading } = useTags();
  const create = useCreateTag();
  const update = useUpdateTag();
  const remove = useDeleteTag();

  const [dialog, setDialog] = useState<{ mode: 'create' | 'edit'; id?: string; name: string; description: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!dialog) return;
    setError('');
    if (!dialog.name.trim()) { setError('El nombre es obligatorio'); return; }
    try {
      if (dialog.mode === 'create') {
        await create.mutateAsync({ name: dialog.name.trim(), description: dialog.description || undefined });
      } else {
        await update.mutateAsync({ id: dialog.id, name: dialog.name.trim(), description: dialog.description || undefined });
      }
      setDialog(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await remove.mutateAsync(deleteId);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>Etiquetas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({ mode: 'create', name: '', description: '' })}>
          Nueva etiqueta
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} align="center">Cargando...</TableCell></TableRow>
            ) : (!tags || tags.length === 0) ? (
              <TableRow><TableCell colSpan={4} align="center">Sin etiquetas</TableCell></TableRow>
            ) : tags.map((tag: any) => (
              <TableRow key={tag.id} hover>
                <TableCell>{tag.name}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell>{tag.description || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setDialog({ mode: 'edit', id: tag.id, name: tag.name, description: tag.description || '' })}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => setDeleteId(tag.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog?.mode === 'create' ? 'Nueva etiqueta' : 'Editar etiqueta'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nombre" fullWidth required value={dialog?.name || ''} onChange={(e) => setDialog((d) => d ? { ...d, name: e.target.value } : null)} />
            <TextField label="Descripción" fullWidth multiline rows={2} value={dialog?.description || ''} onChange={(e) => setDialog((d) => d ? { ...d, description: e.target.value } : null)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={create.isPending || update.isPending}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Eliminar etiqueta</DialogTitle>
        <DialogContent><Typography>¿Estás seguro?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
