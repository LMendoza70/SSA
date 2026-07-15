import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Skeleton } from '@mui/material';
import { usePublicDisease } from '../../../hooks/usePublicCampaignDisease';

export default function PublicDiseaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: disease, isLoading } = usePublicDisease(slug || '');

  if (isLoading) return <Container maxWidth="md" sx={{ py: 4 }}><Skeleton variant="rounded" height={200} /></Container>;
  if (!disease) return <Container maxWidth="md" sx={{ py: 4 }}><Typography>Enfermedad no encontrada</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link to="/diseases" style={{ color: 'inherit', marginBottom: 16, display: 'inline-block' }}>&larr; Volver a enfermedades</Link>
      <Typography variant="h3" fontWeight={700} gutterBottom>{disease.name}</Typography>
      {disease.description && <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{disease.description}</Typography>}
    </Container>
  );
}
