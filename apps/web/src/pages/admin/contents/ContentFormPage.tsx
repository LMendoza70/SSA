import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useContent, useCreateContent, useUpdateContent } from '../../../hooks/useContents';
import { useContentTypes } from '../../../hooks/useContentTypes';
import { useCreatePublication } from '../../../hooks/usePublications';
import { TiptapEditor } from '../../../components/admin/TiptapEditor';
import { StatusChip } from '../../../components/admin/StatusChip';
import { ContentStatus } from '@ssa/shared';

export function ContentFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const createContent = useCreateContent();
  const updateContent = useUpdateContent();
  const { data: content, isLoading: loadingContent } = useContent(id || '');
  const { data: contentTypes } = useContentTypes();

  const [title, setTitle] = useState('');
  const [contentTypeId, setContentTypeId] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState<string>(ContentStatus.DRAFT);
  const [error, setError] = useState('');
  const [pubError, setPubError] = useState('');
  const [pubSuccess, setPubSuccess] = useState('');

  const createPublication = useCreatePublication();

  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setContentTypeId(content.contentTypeId);
      setSummary(content.summary || '');
      setBody(content.body || '');
      setSeoTitle(content.seoTitle || '');
      setSeoDescription(content.seoDescription || '');
      setStatus(content.status);
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!contentTypeId) {
      setError('Debe seleccionar un tipo de contenido');
      return;
    }

    try {
      const payload = { title: title.trim(), contentTypeId, summary, body, seoTitle, seoDescription };
      if (isEdit) {
        await updateContent.mutateAsync({ id, ...payload, status });
      } else {
        await createContent.mutateAsync(payload);
      }
      navigate('/admin/contents');
    } catch {
      setError('Error al guardar el contenido');
    }
  };

  if (isEdit && loadingContent) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        {isEdit ? 'Editar contenido' : 'Nuevo contenido'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Título"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Tipo de contenido"
                fullWidth
                required
                value={contentTypeId}
                onChange={(e) => setContentTypeId(e.target.value)}
                sx={{ minWidth: 250 }}
              >
                {(contentTypes || []).map((ct: any) => (
                  <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>
                ))}
              </TextField>

              {isEdit && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">Estado:</Typography>
                  <TextField
                    select
                    size="small"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    sx={{ minWidth: 180 }}
                  >
                    {Object.values(ContentStatus).map((s) => (
                      <MenuItem key={s} value={s}>
                        <StatusChip status={s} />
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}
            </Stack>

            <TextField
              label="Resumen"
              fullWidth
              multiline
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />

            <Box>
              <Typography variant="subtitle2" mb={1}>Cuerpo del contenido</Typography>
              <TiptapEditor value={body} onChange={setBody} />
            </Box>

            <Typography variant="subtitle1" fontWeight={600} mt={2}>SEO</Typography>

            <TextField
              label="Título SEO"
              fullWidth
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />

            <TextField
              label="Descripción SEO"
              fullWidth
              multiline
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />

            {isEdit && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mt={2}>Publicación</Typography>
                {pubError && <Alert severity="error" sx={{ mb: 1 }}>{pubError}</Alert>}
                {pubSuccess && <Alert severity="success" sx={{ mb: 1 }}>{pubSuccess}</Alert>}
                {content?.publication ? (
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Chip
                      label={`Publicado — ${content.publication.status}`}
                      color="success"
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Slug público: <strong>{content.publication.publicSlug}</strong>
                    </Typography>
                  </Stack>
                ) : status === ContentStatus.READY_FOR_PUBLICATION ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={async () => {
                      setPubError('');
                      setPubSuccess('');
                      try {
                        await createPublication.mutateAsync({ contentId: id });
                        setPubSuccess('Contenido publicado exitosamente');
                      } catch (err: any) {
                        setPubError(err?.response?.data?.message || 'Error al publicar');
                      }
                    }}
                    disabled={createPublication.isPending}
                    sx={{ mt: 1 }}
                  >
                    {createPublication.isPending ? <CircularProgress size={20} /> : 'Publicar'}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Cambia el estado a <strong>Listo para publicar</strong> para habilitar la publicación.
                  </Typography>
                )}
              </Box>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate('/admin/contents')}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createContent.isPending || updateContent.isPending}
              >
                {createContent.isPending || updateContent.isPending
                  ? <CircularProgress size={20} />
                  : (isEdit ? 'Guardar cambios' : 'Crear contenido')}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
