import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign } from '../../../hooks/useCampaigns';
export default function CampaignListPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');

  const handleOpen = (campaign?: any) => {
    if (campaign) {
      setEditId(campaign.id);
      setTitle(campaign.title);
      setDescription(campaign.description || '');
      setObjective(campaign.objective || '');
    } else {
      setEditId(null);
      setTitle('');
      setDescription('');
      setObjective('');
    }
    setOpen(true);
  };

  const handleSave = async () => {
    const data = { title, description: description || undefined, objective: objective || undefined };
    if (editId) {
      await updateCampaign.mutateAsync({ id: editId, ...data });
    } else {
      await createCampaign.mutateAsync(data);
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta campaña?')) {
      await deleteCampaign.mutateAsync(id);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Campañas</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nueva campaña
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Objetivo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4}>Cargando...</TableCell></TableRow>
            ) : (campaigns || []).length === 0 ? (
              <TableRow><TableCell colSpan={4}>Sin campañas registradas</TableCell></TableRow>
            ) : (
              (campaigns || []).map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.objective || '—'}</TableCell>
                  <TableCell>{c.isActive ? 'Activa' : 'Inactiva'}</TableCell>
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar campaña' : 'Nueva campaña'}</DialogTitle>
        <DialogContent>
          <TextField label="Título" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Descripción" fullWidth margin="normal" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          <TextField label="Objetivo" fullWidth margin="normal" multiline rows={2} value={objective} onChange={(e) => setObjective(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
