import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  IconButton, Switch, FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTimelineEvents, useCreateTimelineEvent, useUpdateTimelineEvent, useDeleteTimelineEvent } from '../../../hooks/useTimelineEvents';

export default function TimelineEventListPage() {
  const { data: events, isLoading } = useTimelineEvents();
  const createEvent = useCreateTimelineEvent();
  const updateEvent = useUpdateTimelineEvent();
  const deleteEvent = useDeleteTimelineEvent();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [occurredAt, setOccurredAt] = useState('');
  const [periodLabel, setPeriodLabel] = useState('');
  const [historicalRelevance, setHistoricalRelevance] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleOpen = (event?: any) => {
    if (event) {
      setEditId(event.id);
      setTitle(event.title);
      setDescription(event.description || '');
      setOccurredAt(event.occurredAt ? event.occurredAt.slice(0, 10) : '');
      setPeriodLabel(event.periodLabel || '');
      setHistoricalRelevance(event.historicalRelevance || '');
      setIsVisible(event.isVisible);
    } else {
      setEditId(null);
      setTitle('');
      setDescription('');
      setOccurredAt('');
      setPeriodLabel('');
      setHistoricalRelevance('');
      setIsVisible(true);
    }
    setOpen(true);
  };

  const handleSave = async () => {
    const data: any = {
      title,
      description: description || undefined,
      periodLabel: periodLabel || undefined,
      historicalRelevance: historicalRelevance || undefined,
    };
    if (occurredAt) data.occurredAt = occurredAt;
    if (editId) {
      await updateEvent.mutateAsync({ id: editId, ...data, isVisible });
    } else {
      await createEvent.mutateAsync(data);
    }
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este evento?')) {
      await deleteEvent.mutateAsync(id);
    }
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString() : '—';

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Línea del Tiempo</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Nuevo evento
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Periodo</TableCell>
              <TableCell>Visible</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5}>Cargando...</TableCell></TableRow>
            ) : (events || []).length === 0 ? (
              <TableRow><TableCell colSpan={5}>Sin eventos registrados</TableCell></TableRow>
            ) : (
              (events || []).map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell>{e.title}</TableCell>
                  <TableCell>{formatDate(e.occurredAt)}</TableCell>
                  <TableCell>{e.periodLabel || '—'}</TableCell>
                  <TableCell>{e.isVisible ? 'Sí' : 'No'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(e)} size="small"><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(e.id)} size="small" color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar evento' : 'Nuevo evento'}</DialogTitle>
        <DialogContent>
          <TextField label="Título" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Descripción" fullWidth margin="normal" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          <TextField label="Fecha del evento" type="date" fullWidth margin="normal" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Etiqueta de periodo (ej. 2020-2024)" fullWidth margin="normal" value={periodLabel} onChange={(e) => setPeriodLabel(e.target.value)} placeholder="Opcional: agrupar bajo un periodo" />
          <TextField label="Relevancia histórica" fullWidth margin="normal" multiline rows={2} value={historicalRelevance} onChange={(e) => setHistoricalRelevance(e.target.value)} />
          {editId && <FormControlLabel control={<Switch checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />} label="Visible en portal público" />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
