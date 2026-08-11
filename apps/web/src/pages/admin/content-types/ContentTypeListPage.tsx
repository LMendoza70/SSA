import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Switch, FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useContentTypes, useCreateContentType, useUpdateContentType, useDeleteContentType } from '../../../hooks/useContentTypes';

export default function ContentTypeListPage() {
  const { data: types, isLoading } = useContentTypes(true);
  const createType = useCreateContentType();
  const updateType = useUpdateContentType();
  const deleteType = useDeleteContentType();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleOpen = (t?: any) => {
    if (t) {
      setEditId(t.id);
      setCode(t.code);
      setName(t.name);
      setDescription(t.description || '');
      setIsActive(t.isActive);
    } else {
      setEditId(null);
      setCode('');
      setName('');
      setDescription('');
      setIsActive(true);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    const data = { code, name, description: description || undefined, isActive };
    if (editId) {
      await updateType.mutateAsync({ id: editId, ...data });
    } else {
      await createType.mutateAsync(data);
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este tipo de contenido?')) {
      await deleteType.mutateAsync(id);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Tipos de Contenido</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nuevo tipo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5}>Cargando...</TableCell></TableRow>
            ) : (types || []).length === 0 ? (
              <TableRow><TableCell colSpan={5}>Sin tipos de contenido registrados</TableCell></TableRow>
            ) : (
              (types || []).map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell><code>{t.code}</code></TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.description || '—'}</TableCell>
                  <TableCell>{t.isActive ? 'Sí' : 'No'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(t)} size="small"><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(t.id)} size="small" color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar tipo de contenido' : 'Nuevo tipo de contenido'}</DialogTitle>
        <DialogContent>
          <TextField label="Código" fullWidth margin="normal" value={code} onChange={(e) => setCode(e.target.value)} helperText="Identificador único interno (ej: news, campaign)" />
          <TextField label="Nombre" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Descripción" fullWidth margin="normal" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          <FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Activo" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
