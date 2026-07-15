import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Skeleton,
  Button,
  Paper,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { usePublicPublication } from '../../hooks/usePublicPublications';
import { useEffect } from 'react';

export function PublicPublicationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: publication, isLoading } = usePublicPublication(slug!);

  useEffect(() => {
    if (publication) {
      const title = publication.content?.seoTitle || publication.publicTitle || publication.content?.title;
      const description = publication.content?.seoDescription || publication.content?.summary;
      document.title = `${title} | Jurisdicción Sanitaria Huejutla`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description || '');
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description || '');
    }
  }, [publication]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="rounded" width="100%" height={400} sx={{ mt: 2 }} />
      </Container>
    );
  }

  if (!publication) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4">Publicación no encontrada</Typography>
        <Button component={Link} to="/publications" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Volver a publicaciones
        </Button>
      </Container>
    );
  }

  const title = publication.publicTitle || publication.content?.title;
  const body = publication.content?.body;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/publications"
        startIcon={<ArrowBackIcon />}
        size="small"
        sx={{ mb: 2 }}
      >
        Volver a publicaciones
      </Button>

      <Typography variant="caption" color="text.secondary" gutterBottom>
        {publication.content?.contentType?.name}
        {publication.publishedAt && ` · ${new Date(publication.publishedAt).toLocaleDateString()}`}
      </Typography>

      <Typography variant="h3" component="h1" fontWeight={700} gutterBottom>
        {title}
      </Typography>

      {publication.content?.summary && (
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, fontWeight: 400 }}>
          {publication.content.summary}
        </Typography>
      )}

      {body && (
        <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
          >
            {body}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
