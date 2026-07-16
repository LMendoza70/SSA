import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, IconButton, Select, MenuItem, FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { useValidations, useCreateValidation, useUpdateValidation } from '../../../hooks/useValidations';
import { useAllSources } from '../../../hooks/useSources';

const VALIDATION_TYPES = [
  { value: 'AUTHENTICITY', label: 'Autenticidad' },
  { value: 'VALIDITY', label: 'Vigencia' },
  { value: 'RELEVANCE', label: 'Pertinencia' },
  { value: 'INSTITUTIONAL_COMPLETE', label: 'Validación completa' },
];

const VALIDATION_RESULTS = [
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'REJECTED', label: 'Rechazado' },
  { value: 'NEEDS_CLARIFICATION', label: 'Necesita aclaración' },
];

export function ValidationListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useValidations({ page, limit: 20 });
  const create = useCreateValidation();
  const update = useUpdateValidation();
  const { data: sourcesData } = useAllSources();

  const [dialog, setDialog] = useState<{
    mode: 'create' | 'edit'; id?: string;
    type: string; result: string; sourceId: string; summary: string;
  } | null>(null);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!dialog) return;
    setError('');
    try {
      const payload = {
        type: dialog.type,
        result: dialog.result,
        sourceId: dialog.sourceId || undefined,
        summary: dialog.summary || undefined,
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

  const typeLabel = (t: string) => VALIDATION_TYPES.find(v => v.value === t)?.label || t;
  const resultLabel = (r: string) => VALIDATION_RESULTS.find(v => v.value === r)?.label || r;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>Validaciones</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({
          mode: 'create', type: 'AUTHENTICITY', result: 'APPROVED', sourceId: '', summary: '',
        })}>
          Nueva validación
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Resultado</TableCell>
              <TableCell>Fuente</TableCell>
              <TableCell>Resumen</TableCell>
              <TableCell>Validado por</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} align="center">Cargando...</TableCell></TableRow>
            ) : !data?.data?.length ? (
              <TableRow><TableCell colSpan={6} align="center">Sin validaciones</TableCell></TableRow>
            ) : data.data.map((val: any) => (
              <TableRow key={val.id} hover>
                <TableCell>{typeLabel(val.type)}</TableCell>
                <TableCell>{resultLabel(val.result)}</TableCell>
                <TableCell>{val.source?.name || '-'}</TableCell>
                <TableCell>{val.summary || '-'}</TableCell>
                <TableCell>{val.validatedBy?.displayName || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => setDialog({
                    mode: 'edit', id: val.id, type: val.type, result: val.result,
                    sourceId: val.source?.id || '', summary: val.summary || '',
                  })}><EditIcon /></IconButton>
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
        <DialogTitle>{dialog?.mode === 'create' ? 'Nueva validación' : 'Editar validación'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select label="Tipo" value={dialog?.type || 'AUTHENTICITY'} onChange={(e) => setDialog(d => d ? { ...d, type: e.target.value } : null)}>
                {VALIDATION_TYPES.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Resultado</InputLabel>
              <Select label="Resultado" value={dialog?.result || 'APPROVED'} onChange={(e) => setDialog(d => d ? { ...d, result: e.target.value } : null)}>
                {VALIDATION_RESULTS.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Fuente (opcional)</InputLabel>
              <Select label="Fuente (opcional)" value={dialog?.sourceId || ''} onChange={(e) => setDialog(d => d ? { ...d, sourceId: e.target.value } : null)}>
                <MenuItem value="">Sin fuente</MenuItem>
                {sourcesData?.data?.map((src: any) => (
                  <MenuItem key={src.id} value={src.id}>{src.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Resumen" fullWidth multiline rows={2} value={dialog?.summary || ''} onChange={(e) => setDialog(d => d ? { ...d, summary: e.target.value } : null)} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={create.isPending || update.isPending}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
