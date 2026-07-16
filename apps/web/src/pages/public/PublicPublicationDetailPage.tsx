import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Skeleton,
  Button,
  Paper,
  Box,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { usePublicPublication } from '../../hooks/usePublicPublications';
import { useEffect } from 'react';

const ALLOWED_IMG_TYPES = ['IMAGE', 'INFOGRAPHIC'];

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
  const mediaResources = publication.mediaResources || [];
  const displayMedia = mediaResources.filter((mr: any) => ALLOWED_IMG_TYPES.includes(mr.type));

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

      {displayMedia.length > 0 && (
        <ImageList cols={displayMedia.length > 1 ? 2 : 1} gap={16} sx={{ mb: 3 }}>
          {displayMedia.map((mr: any) => (
            <ImageListItem key={mr.id}>
              <Box
                component="img"
                src={mr.url}
                alt={mr.altText || mr.title}
                title={mr.caption || mr.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 500,
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />
              {mr.caption && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                  {mr.caption}
                </Typography>
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {body && (
        <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
          <Box
            sx={{
              lineHeight: 1.8,
              '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1 },
              '& p': { mb: 2 },
              '& ul, & ol': { mb: 2, pl: 3 },
              '& li': { mb: 0.5 },
              '& a': { color: 'primary.main' },
              '& h1, & h2, & h3, & h4': { mt: 3, mb: 1.5 },
              '& blockquote': { borderLeft: 4, borderColor: 'primary.main', pl: 2, ml: 0, color: 'text.secondary' },
            }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Paper>
      )}
    </Container>
  );
}
