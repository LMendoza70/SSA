import { Link } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardActionArea, Grid, Skeleton } from '@mui/material';
import { usePublicDiseases } from '../../../hooks/usePublicCampaignDisease';

export default function PublicDiseaseListPage() {
  const { data: diseases, isLoading } = usePublicDiseases();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Enfermedades</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Información sobre enfermedades de interés en salud pública
      </Typography>
      <Grid container spacing={3}>
        {isLoading ? Array.from({ length: 3 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Skeleton variant="rounded" height={120} />
          </Grid>
        )) : (diseases || []).length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Typography color="text.secondary">No hay enfermedades registradas</Typography>
          </Grid>
        ) : (diseases || []).map((d: any) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardActionArea component={Link} to={`/diseases/${d.slug}`} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>{d.name}</Typography>
                  {d.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {d.description}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
