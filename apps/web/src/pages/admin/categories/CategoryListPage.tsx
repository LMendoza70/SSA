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
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../../hooks/useCategories';

export function CategoryListPage() {
  const { data: categories, isLoading } = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

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
        <Typography variant="h4" fontWeight={600}>Categorías</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({ mode: 'create', name: '', description: '' })}>
          Nueva categoría
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
            ) : (!categories || categories.length === 0) ? (
              <TableRow><TableCell colSpan={4} align="center">Sin categorías</TableCell></TableRow>
            ) : categories.map((cat: any) => (
              <TableRow key={cat.id} hover>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell>{cat.description || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setDialog({ mode: 'edit', id: cat.id, name: cat.name, description: cat.description || '' })}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => setDeleteId(cat.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialog?.mode === 'create' ? 'Nueva categoría' : 'Editar categoría'}</DialogTitle>
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
        <DialogTitle>Eliminar categoría</DialogTitle>
        <DialogContent><Typography>¿Estás seguro?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
