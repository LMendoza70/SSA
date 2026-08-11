import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  InputAdornment,
  Button,
  TablePagination,
  Skeleton,
} from '@mui/material';

import { usePublicSearch } from '../../hooks/usePublicPublications';

export function PublicSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(q);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  const { data, isLoading } = usePublicSearch(q, page + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
      setPage(0);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" fontWeight={600} gutterBottom>
        Buscar
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          size="medium"
          placeholder="Buscar publicaciones..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Button type="submit" variant="contained" size="small">
                    Buscar
                  </Button>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {q && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {isLoading ? 'Buscando...' : `${data?.meta?.total || 0} resultado(s) para "${q}"`}
        </Typography>
      )}

      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={100} sx={{ mb: 2 }} />
          ))
        : (data?.data || []).map((item: any) => (
            <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
              <CardActionArea
                component={Link}
                to={`/publications/${item.publicSlug}`}
              >
                <CardContent>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    {item.content?.contentType?.name || 'Publicación'}
                    {item.publishedAt && ` · ${new Date(item.publishedAt).toLocaleDateString()}`}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {item.publicTitle || item.content?.title}
                  </Typography>
                  {item.content?.summary && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {item.content.summary}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}

      {(!q || (data?.data || []).length === 0) && !isLoading && (
        <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
          {q ? 'No se encontraron resultados' : 'Ingresa un término de búsqueda'}
        </Typography>
      )}

      {data?.meta && data.meta.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <TablePagination
            component="div"
            count={data.meta.total || 0}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={data.meta.limit || 20}
            rowsPerPageOptions={[]}
            labelRowsPerPage=""
          />
        </Box>
      )}
    </Container>
  );
}
