import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Switch, FormControlLabel, MenuItem, Alert, Snackbar,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useChannels, useCreateChannel, useUpdateChannel, useDeleteChannel } from '../../../hooks/useCommunicationChannels';

const CHANNEL_TYPE_OPTIONS = [
  { value: 'PUBLIC_PORTAL', label: 'Portal público' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'X', label: 'X (Twitter)' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'OTHER', label: 'Otro' },
];

export default function CommunicationChannelListPage() {
  const { data: channels, isLoading } = useChannels();
  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [type, setType] = useState('OTHER');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');

  const handleOpen = (channel?: any) => {
    if (channel) {
      setEditId(channel.id);
      setType(channel.type);
      setName(channel.name);
      setDescription(channel.description || '');
      setIsActive(channel.isActive);
    } else {
      setEditId(null);
      setType('OTHER');
      setName('');
      setDescription('');
      setIsActive(true);
    }
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setError('');
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    try {
      const data = { type, name: name.trim(), description: description?.trim() || undefined };
      if (editId) {
        await updateChannel.mutateAsync({ id: editId, ...data, isActive });
        setSnackbar('Canal actualizado exitosamente');
      } else {
        await createChannel.mutateAsync(data);
        setSnackbar('Canal creado exitosamente');
      }
      setOpen(false);
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] || err?.response?.data?.message || 'Error al guardar el canal');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este canal?')) {
      try {
        await deleteChannel.mutateAsync(id);
        setSnackbar('Canal eliminado');
      } catch {
        setSnackbar('Error al eliminar el canal');
      }
    }
  };

  const channelTypeLabel = (val: string) => CHANNEL_TYPE_OPTIONS.find((o) => o.value === val)?.label || val;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Canales de Comunicación</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nuevo canal
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4}>Cargando...</TableCell></TableRow>
            ) : (channels || []).length === 0 ? (
              <TableRow><TableCell colSpan={4}>Sin canales registrados</TableCell></TableRow>
            ) : (
              (channels || []).map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{channelTypeLabel(c.type)}</TableCell>
                  <TableCell>{c.isActive ? 'Sí' : 'No'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(c)} size="small"><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(c.id)} size="small" color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {snackbar && (
        <Snackbar open={!!snackbar} autoHideDuration={4000} onClose={() => setSnackbar('')}>
          <Alert severity={snackbar.includes('Error') ? 'error' : 'success'} onClose={() => setSnackbar('')}>{snackbar}</Alert>
        </Snackbar>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar canal' : 'Nuevo canal'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField select label="Tipo" fullWidth margin="normal" value={type} onChange={(e) => setType(e.target.value)}>
            {CHANNEL_TYPE_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>
          <TextField label="Nombre" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Descripción" fullWidth margin="normal" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          {editId && <FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Activo" />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
