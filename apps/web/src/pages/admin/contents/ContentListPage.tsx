import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TablePagination,
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useContents, useDeleteContent } from '../../../hooks/useContents';
import { useContentTypes } from '../../../hooks/useContentTypes';
import { StatusChip } from '../../../components/admin/StatusChip';
import { ContentStatus } from '@ssa/shared';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  ...Object.values(ContentStatus).map((s) => ({ value: s, label: s })),
];

export function ContentListPage() {
  const navigate = useNavigate();
  const deleteContent = useDeleteContent();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [status, setStatus] = useState('');
  const [contentTypeId, setContentTypeId] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useContents({
    page: page + 1,
    limit: rowsPerPage,
    status: status || undefined,
    contentTypeId: contentTypeId || undefined,
    search: search || undefined,
  });

  const { data: contentTypes } = useContentTypes();

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Contenidos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/contents/new')}
        >
          Nuevo contenido
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Buscar"
            size="small"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Estado"
            size="small"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            sx={{ minWidth: 160 }}
          >
            {STATUS_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Tipo"
            size="small"
            value={contentTypeId}
            onChange={(e) => { setContentTypeId(e.target.value); setPage(0); }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {(contentTypes || []).map((ct: any) => (
              <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Cargando...</TableCell>
              </TableRow>
            ) : (data?.data || []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Sin contenidos</TableCell>
              </TableRow>
            ) : (
              (data?.data || []).map((item: any) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <Chip label={item.contentType?.name || '-'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell><StatusChip status={item.status} /></TableCell>
                  <TableCell sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.slug}
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => navigate(`/admin/contents/${item.id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => { if (confirm('¿Eliminar este contenido?')) deleteContent.mutate(item.id); }} color="error">
                      <DeleteIcon />
                    </IconButton>
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
    </Box>
  );
}
