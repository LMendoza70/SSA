import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useDiseases, useCreateDisease, useUpdateDisease, useDeleteDisease } from '../../../hooks/useDiseases';
export default function DiseaseListPage() {
  const { data: diseases, isLoading } = useDiseases();
  const createDisease = useCreateDisease();
  const updateDisease = useUpdateDisease();
  const deleteDisease = useDeleteDisease();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleOpen = (disease?: any) => {
    if (disease) {
      setEditId(disease.id);
      setName(disease.name);
      setDescription(disease.description || '');
    } else {
      setEditId(null);
      setName('');
      setDescription('');
    }
    setOpen(true);
  };

  const handleSave = async () => {
    const data = { name, description: description || undefined };
    if (editId) {
      await updateDisease.mutateAsync({ id: editId, ...data });
    } else {
      await createDisease.mutateAsync(data);
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta enfermedad?')) {
      await deleteDisease.mutateAsync(id);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Enfermedades</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nueva enfermedad
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4}>Cargando...</TableCell></TableRow>
            ) : (diseases || []).length === 0 ? (
              <TableRow><TableCell colSpan={4}>Sin enfermedades registradas</TableCell></TableRow>
            ) : (
              (diseases || []).map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.description || '—'}</TableCell>
                  <TableCell>{d.isActive ? 'Activa' : 'Inactiva'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(d)} size="small"><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(d.id)} size="small" color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar enfermedad' : 'Nueva enfermedad'}</DialogTitle>
        <DialogContent>
          <TextField label="Nombre" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Descripción" fullWidth margin="normal" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
