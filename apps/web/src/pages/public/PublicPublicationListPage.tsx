import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  TablePagination,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { usePublicPublications, usePublicCategories, usePublicTags } from '../../hooks/usePublicPublications';

export function PublicPublicationListPage() {
  const [page, setPage] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [tagId, setTagId] = useState('');
  const rowsPerPage = 12;

  const { data: categories } = usePublicCategories();
  const { data: tags } = usePublicTags();

  const { data, isLoading } = usePublicPublications({
    page: page + 1,
    limit: rowsPerPage,
    categoryId: categoryId || undefined,
    tagId: tagId || undefined,
  });

  const activeFilters = [
    ...(categoryId ? [categories?.find((c: any) => c.id === categoryId)?.name] : []),
    ...(tagId ? [tags?.find((t: any) => t.id === tagId)?.name] : []),
  ].filter(Boolean);

  const handleClearFilters = () => {
    setCategoryId('');
    setTagId('');
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={600} gutterBottom>
        Publicaciones
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Información oficial publicada por la Jurisdicción Sanitaria
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="category-label">Categoría</InputLabel>
          <Select
            labelId="category-label"
            label="Categoría"
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(0); }}
          >
            <MenuItem value="">Todas</MenuItem>
            {(categories || []).map((cat: any) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="tag-label">Etiqueta</InputLabel>
          <Select
            labelId="tag-label"
            label="Etiqueta"
            value={tagId}
            onChange={(e) => { setTagId(e.target.value); setPage(0); }}
          >
            <MenuItem value="">Todas</MenuItem>
            {(tags || []).map((t: any) => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {activeFilters.length > 0 && (
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          {activeFilters.map((label) => (
            <Chip key={label} label={label} size="small" color="primary" variant="outlined" />
          ))}
          <Chip label="Limpiar filtros" size="small" onDelete={handleClearFilters} />
        </Box>
      )}

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton variant="rounded" height={160} />
              </Grid>
            ))
          : (data?.data || []).length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                  No hay publicaciones disponibles
                </Typography>
              </Grid>
            )}
        {(data?.data || []).map((item: any) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardActionArea
                component={Link}
                to={`/publications/${item.publicSlug}`}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    {item.content?.contentType?.name || 'Publicación'}
                    {item.publishedAt && ` · ${new Date(item.publishedAt).toLocaleDateString()}`}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {item.publicTitle || item.content?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.content?.summary}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {data?.meta && (
        <Box display="flex" justifyContent="center" mt={4}>
          <TablePagination
            component="div"
            count={data.meta.total || 0}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
            labelRowsPerPage=""
          />
        </Box>
      )}
    </Container>
  );
}
