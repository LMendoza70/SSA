import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Skeleton, Chip, Stack } from '@mui/material';
import { usePublicCampaign } from '../../../hooks/usePublicCampaignDisease';

export default function PublicCampaignDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: campaign, isLoading } = usePublicCampaign(slug || '');

  if (isLoading) return <Container maxWidth="md" sx={{ py: 4 }}><Skeleton variant="rounded" height={300} /></Container>;
  if (!campaign) return <Container maxWidth="md" sx={{ py: 4 }}><Typography>Campaña no encontrada</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link to="/campaigns" style={{ color: 'inherit', marginBottom: 16, display: 'inline-block' }}>&larr; Volver a campañas</Link>
      <Typography variant="h3" fontWeight={700} gutterBottom>{campaign.title}</Typography>
      <Stack direction="row" spacing={1} mb={2}>
        {campaign.startsAt && <Chip label={`Inicio: ${new Date(campaign.startsAt).toLocaleDateString()}`} variant="outlined" size="small" />}
        {campaign.endsAt && <Chip label={`Fin: ${new Date(campaign.endsAt).toLocaleDateString()}`} variant="outlined" size="small" />}
      </Stack>
      {campaign.objective && (
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600}>Objetivo</Typography>
          <Typography variant="body1">{campaign.objective}</Typography>
        </Box>
      )}
      {campaign.description && <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{campaign.description}</Typography>}
    </Container>
  );
}
