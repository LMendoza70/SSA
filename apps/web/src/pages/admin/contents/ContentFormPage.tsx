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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { useContent, useCreateContent, useUpdateContent } from '../../../hooks/useContents';
import { useContentTypes } from '../../../hooks/useContentTypes';
import { useCreatePublication } from '../../../hooks/usePublications';
import { useContentMedia, useAssociateMedia, useMediaResources } from '../../../hooks/useMediaResources';
import { useContentCategories, useContentTags, useAssociateContentCategories, useAssociateContentTags } from '../../../hooks/useContentClassification';
import { useCategories } from '../../../hooks/useCategories';
import { useTags } from '../../../hooks/useTags';
import { useCampaigns } from '../../../hooks/useCampaigns';
import { useDiseases } from '../../../hooks/useDiseases';
import { useContentCampaigns, useContentDiseases, useAssociateContentCampaigns, useAssociateContentDiseases } from '../../../hooks/useContentCampaignDisease';
import { useChannels, useAssociatePublicationChannels } from '../../../hooks/useCommunicationChannels';
import { useContentTraceability } from '../../../hooks/useTraceability';
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
  const [pubDialogOpen, setPubDialogOpen] = useState(false);
  const [publicSlug, setPublicSlug] = useState('');
  const [publicTitle, setPublicTitle] = useState('');
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([]);

  const createPublication = useCreatePublication();

  const { data: contentMedia } = useContentMedia(id || '');
  const [mediaSelectorOpen, setMediaSelectorOpen] = useState(false);

  const { data: allCategories } = useCategories();
  const { data: allTags } = useTags();
  const { data: selectedCategories } = useContentCategories(id || '');
  const { data: selectedTags } = useContentTags(id || '');
  const associateCategories = useAssociateContentCategories();
  const associateTags = useAssociateContentTags();
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCategories) setSelectedCatIds(selectedCategories.map((c: any) => c.id));
  }, [selectedCategories]);

  useEffect(() => {
    if (selectedTags) setSelectedTagIds(selectedTags.map((t: any) => t.id));
  }, [selectedTags]);

  const { data: allCampaigns } = useCampaigns();
  const { data: allDiseases } = useDiseases();
  const { data: selectedCampaigns } = useContentCampaigns(id || '');
  const { data: selectedDiseases } = useContentDiseases(id || '');
  const { data: allChannels } = useChannels();
  const associateChannels = useAssociatePublicationChannels();
  const associateCampaigns = useAssociateContentCampaigns();
  const associateDiseases = useAssociateContentDiseases();
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [selectedDiseaseIds, setSelectedDiseaseIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCampaigns) setSelectedCampaignIds(selectedCampaigns.map((c: any) => c.id));
  }, [selectedCampaigns]);

  useEffect(() => {
    if (selectedDiseases) setSelectedDiseaseIds(selectedDiseases.map((d: any) => d.id));
  }, [selectedDiseases]);

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

            {isEdit && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mt={2}>Clasificación</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <TextField
                    select
                    label="Categorías"
                    size="small"
                    SelectProps={{ multiple: true, value: selectedCatIds, onChange: (e: any) => setSelectedCatIds(e.target.value as string[]) }}
                    sx={{ minWidth: 250 }}
                  >
                    {(allCategories || []).map((cat: any) => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Etiquetas"
                    size="small"
                    SelectProps={{ multiple: true, value: selectedTagIds, onChange: (e: any) => setSelectedTagIds(e.target.value as string[]) }}
                    sx={{ minWidth: 250 }}
                  >
                    {(allTags || []).map((tag: any) => (
                      <MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>
                    ))}
                  </TextField>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      if (id) {
                        await associateCategories.mutateAsync({ contentId: id, categoryIds: selectedCatIds });
                        await associateTags.mutateAsync({ contentId: id, tagIds: selectedTagIds });
                      }
                    }}
                  >
                    Guardar clasificación
                  </Button>
                </Stack>
              </Box>
            )}

            {isEdit && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mt={2}>Campañas y Enfermedades</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <TextField
                    select
                    label="Campañas"
                    size="small"
                    SelectProps={{ multiple: true, value: selectedCampaignIds, onChange: (e: any) => setSelectedCampaignIds(e.target.value as string[]) }}
                    sx={{ minWidth: 250 }}
                  >
                    {(allCampaigns || []).map((c: any) => (
                      <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Enfermedades"
                    size="small"
                    SelectProps={{ multiple: true, value: selectedDiseaseIds, onChange: (e: any) => setSelectedDiseaseIds(e.target.value as string[]) }}
                    sx={{ minWidth: 250 }}
                  >
                    {(allDiseases || []).map((d: any) => (
                      <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                    ))}
                  </TextField>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      if (id) {
                        await associateCampaigns.mutateAsync({ contentId: id, campaignIds: selectedCampaignIds });
                        await associateDiseases.mutateAsync({ contentId: id, diseaseIds: selectedDiseaseIds });
                      }
                    }}
                  >
                    Guardar
                  </Button>
                </Stack>
              </Box>
            )}

            {isEdit && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mt={2}>Multimedia</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                  {(contentMedia || []).map((item: any) => (
                    <Card key={item.id} variant="outlined" sx={{ width: 120 }}>
                      {item.url && (item.type === 'IMAGE' || item.type === 'INFOGRAPHIC') ? (
                        <CardMedia component="img" height={80} image={item.url} alt={item.altText || item.title} sx={{ objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
                          <Typography variant="caption">{item.type}</Typography>
                        </Box>
                      )}
                      <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                        <Typography variant="caption" noWrap>{item.title}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
                <Button size="small" sx={{ mt: 1 }} onClick={() => setMediaSelectorOpen(true)}>
                  {contentMedia?.length ? 'Administrar multimedia' : 'Asociar multimedia'}
                </Button>
              </Box>
            )}

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
                    onClick={() => {
                      setPubError('');
                      setPubSuccess('');
                      setPublicSlug(content?.slug || '');
                      setPublicTitle(content?.title || '');
                      setPubDialogOpen(true);
                    }}
                    sx={{ mt: 1 }}
                  >
                    Publicar
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Cambia el estado a <strong>Listo para publicar</strong> para habilitar la publicación.
                  </Typography>
                )}
              </Box>
            )}

            <Dialog open={pubDialogOpen} onClose={() => setPubDialogOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle>Publicar contenido</DialogTitle>
              <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  {pubError && <Alert severity="error">{pubError}</Alert>}
                  {pubSuccess && <Alert severity="success">{pubSuccess}</Alert>}
                  <TextField label="Slug público" fullWidth value={publicSlug} onChange={(e) => setPublicSlug(e.target.value)} helperText="Dejar vacío para auto-generar" />
                  <TextField label="Título público" fullWidth value={publicTitle} onChange={(e) => setPublicTitle(e.target.value)} helperText="Dejar vacío para usar el título del contenido" />
                  <TextField
                    select
                    label="Canales de distribución"
                    size="small"
                    SelectProps={{
                      multiple: true,
                      value: selectedChannelIds,
                      onChange: (e: any) => setSelectedChannelIds(e.target.value as string[]),
                    }}
                    helperText="Selecciona los canales donde se distribuirá"
                  >
                    {(allChannels || []).filter((ch: any) => ch.isActive).map((ch: any) => (
                      <MenuItem key={ch.id} value={ch.id}>{ch.name}</MenuItem>
                    ))}
                  </TextField>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPubDialogOpen(false)}>Cancelar</Button>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={createPublication.isPending}
                  onClick={async () => {
                    setPubError('');
                    setPubSuccess('');
                    try {
                      const pub = await createPublication.mutateAsync({
                        contentId: id,
                        publicSlug: publicSlug || undefined,
                        publicTitle: publicTitle || undefined,
                      });
                      if (selectedChannelIds.length > 0 && pub?.id) {
                        await associateChannels.mutateAsync({ publicationId: pub.id, channelIds: selectedChannelIds });
                      }
                      setPubSuccess('Contenido publicado exitosamente');
                    } catch (err: any) {
                      setPubError(err?.response?.data?.message || 'Error al publicar');
                    }
                  }}
                >
                  {createPublication.isPending ? <CircularProgress size={20} /> : 'Publicar'}
                </Button>
              </DialogActions>
            </Dialog>

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

      <ContentTraceabilityView contentId={id!} />

      <Dialog open={mediaSelectorOpen} onClose={() => setMediaSelectorOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Seleccionar recursos multimedia</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              {mediaSelectorOpen && <MediaSelectorInternal contentId={id!} onClose={() => setMediaSelectorOpen(false)} />}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMediaSelectorOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ContentTraceabilityView({ contentId }: { contentId: string }) {
  const { data: records, isLoading } = useContentTraceability(contentId);

  if (!records || records.length === 0) return null;

  const ACTION_LABELS: Record<string, string> = {
    CREATED: 'Creado',
    UPDATED: 'Actualizado',
    PREPARED: 'Preparado',
    VALIDATED: 'Validado',
    PUBLISHED: 'Publicado',
    WITHDRAWN: 'Retirado',
    ARCHIVED: 'Archivado',
    DISTRIBUTED: 'Distribuido',
    DISTRIBUTION_PREPARED: 'Preparado para distribución',
    RESTORED: 'Restaurado',
    CLASSIFIED: 'Clasificado',
    RESOURCE_ATTACHED: 'Recurso adjunto',
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={1}>Trazabilidad</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Acción</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Detalle</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4}>Cargando...</TableCell></TableRow>
            ) : (
              records.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Chip label={ACTION_LABELS[r.action] || r.action} size="small" color="default" variant="outlined" />
                  </TableCell>
                  <TableCell>{r.user?.displayName || r.user?.email || r.userId}</TableCell>
                  <TableCell>{r.summary || '—'}</TableCell>
                  <TableCell>{new Date(r.occurredAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function MediaSelectorInternal({ contentId, onClose }: { contentId: string; onClose: () => void }) {
  const { data } = useMediaResources({ limit: 100 });
  const [selected, setSelected] = useState<string[]>([]);
  const associateMedia = useAssociateMedia();

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAssociate = async () => {
    if (selected.length === 0) return;
    await associateMedia.mutateAsync({ contentId, mediaResourceIds: selected });
    onClose();
  };

  return (
    <>
      <Grid container spacing={2}>
        {(data?.data || []).map((item: any) => {
          const isSelected = selected.includes(item.id);
          const isImage = item.type === 'IMAGE' || item.type === 'INFOGRAPHIC';
          return (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}>
              <Card
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'primary.main' : undefined,
                  borderWidth: isSelected ? 2 : 1,
                }}
                onClick={() => handleToggle(item.id)}
              >
                {isImage && item.url ? (
                  <CardMedia component="img" height={100} image={item.url} alt={item.altText || item.title} sx={{ objectFit: 'cover' }} />
                ) : (
                  <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary">{item.type}</Typography>
                  </Box>
                )}
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="caption" noWrap>{item.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
        {(data?.data || []).length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              No hay recursos multimedia disponibles. Sube recursos desde el gestor multimedia.
            </Typography>
          </Grid>
        )}
      </Grid>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleAssociate} disabled={selected.length === 0 || associateMedia.isPending}>
          {associateMedia.isPending ? 'Asociando...' : `Asociar (${selected.length})`}
        </Button>
      </Stack>
    </>
  );
}
