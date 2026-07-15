import { useState, useRef } from 'react';
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import { CloudUpload as UploadIcon, Delete as DeleteIcon, Image as ImageIcon, PictureAsPdf, InsertDriveFile, Link as LinkIcon } from '@mui/icons-material';
import {
  useMediaResources,
  useUploadMedia,
  useDeleteMedia,
} from '../../../hooks/useMediaResources';

const TYPE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'IMAGE', label: 'Imagen' },
  { value: 'INFOGRAPHIC', label: 'Infografía' },
  { value: 'PDF', label: 'PDF' },
  { value: 'DOCUMENT', label: 'Documento' },
  { value: 'VIDEO_LINK', label: 'Video' },
  { value: 'EXTERNAL_LINK', label: 'Enlace externo' },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  IMAGE: <ImageIcon />,
  INFOGRAPHIC: <ImageIcon />,
  PDF: <PictureAsPdf />,
  DOCUMENT: <InsertDriveFile />,
  VIDEO_LINK: <LinkIcon />,
  EXTERNAL_LINK: <LinkIcon />,
};

export function MediaManagerPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [type, setType] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useMediaResources({
    page: page + 1,
    limit: rowsPerPage,
    type: type || undefined,
  });

  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError('');
    const form = new FormData(e.currentTarget);
    const file = form.get('file') as File;
    if (!file || file.size === 0) {
      setUploadError('Selecciona un archivo');
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', form.get('type') as string);
    fd.append('title', form.get('title') as string);
    const desc = form.get('description') as string;
    if (desc) fd.append('description', desc);
    const alt = form.get('altText') as string;
    if (alt) fd.append('altText', alt);

    try {
      await uploadMedia.mutateAsync(fd);
      setUploadOpen(false);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || 'Error al subir archivo');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteMedia.mutateAsync(deleteConfirm);
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Multimedia
        </Typography>
        <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setUploadOpen(true)}>
          Subir archivo
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          select
          label="Tipo"
          size="small"
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(0); }}
          sx={{ minWidth: 180 }}
        >
          {TYPE_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>MIME</TableCell>
              <TableCell>Alt text</TableCell>
              <TableCell>Subido</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} align="center">Cargando...</TableCell></TableRow>
            ) : (data?.data || []).length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">Sin recursos multimedia</TableCell></TableRow>
            ) : (
              (data?.data || []).map((item: any) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {TYPE_ICONS[item.type] || <InsertDriveFile />}
                      <Chip label={item.type} size="small" variant="outlined" />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{item.title}</Typography>
                    {item.url && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.url}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{item.mimeType || '-'}</TableCell>
                  <TableCell>{item.altText || '-'}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" size="small" onClick={() => setDeleteConfirm(item.id)}>
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

      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleUpload}>
          <DialogTitle>Subir archivo multimedia</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {uploadError && <Alert severity="error">{uploadError}</Alert>}
              <Button variant="outlined" component="label">
                Seleccionar archivo
                <input type="file" name="file" hidden ref={fileRef} />
              </Button>
              <TextField
                select
                label="Tipo"
                name="type"
                defaultValue="IMAGE"
                required
                fullWidth
              >
                {TYPE_OPTIONS.filter((o) => o.value).map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </TextField>
              <TextField label="Título" name="title" required fullWidth />
              <TextField label="Descripción" name="description" multiline rows={2} fullWidth />
              <TextField label="Texto alternativo (alt)" name="altText" fullWidth />
            </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUploadOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={uploadMedia.isPending}>
                {uploadMedia.isPending ? 'Subiendo...' : 'Subir'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
          <DialogTitle>Eliminar recurso</DialogTitle>
          <DialogContent>
            <Typography>¿Estás seguro de eliminar este recurso?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Eliminar</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
