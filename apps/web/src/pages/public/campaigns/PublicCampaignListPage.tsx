import { Link } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardActionArea, Grid, Skeleton } from '@mui/material';
import { usePublicCampaigns } from '../../../hooks/usePublicCampaignDisease';

export default function PublicCampaignListPage() {
  const { data: campaigns, isLoading } = usePublicCampaigns();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Campañas</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Campañas institucionales de salud vigentes
      </Typography>
      <Grid container spacing={3}>
        {isLoading ? Array.from({ length: 3 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Skeleton variant="rounded" height={150} />
          </Grid>
        )) : (campaigns || []).length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Typography color="text.secondary">No hay campañas activas en este momento</Typography>
          </Grid>
        ) : (campaigns || []).map((c: any) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={c.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardActionArea component={Link} to={`/campaigns/${c.slug}`} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>{c.title}</Typography>
                  {c.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.description}
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
