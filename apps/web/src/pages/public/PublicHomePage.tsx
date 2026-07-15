import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Button,
  Skeleton,
} from '@mui/material';
import { useFeaturedPublications } from '../../hooks/usePublicPublications';

export function PublicHomePage() {
  const { data: featured, isLoading } = useFeaturedPublications();

  return (
    <>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: '#FFFFFF',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
            Jurisdicción Sanitaria de Huejutla
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
            Información oficial de salud pública
          </Typography>
          <Button
            component={Link}
            to="/publications"
            variant="contained"
            color="secondary"
            size="large"
          >
            Ver publicaciones
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Publicaciones destacadas
        </Typography>

        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <Skeleton variant="rounded" height={180} />
                </Grid>
              ))
            : featured?.map((item: any) => (
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

        {(featured?.length ?? 0) > 0 && (
          <Box textAlign="center" mt={4}>
            <Button component={Link} to="/publications" variant="outlined">
              Ver todas las publicaciones
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}
