import { useParams, Link } from 'react-router-dom';
import {
  Container, Typography, Box, Skeleton, Chip, Card, CardContent, CardActionArea,
  Button, Stack,
} from '@mui/material';
import { ArrowBack, Event as EventIcon, Article } from '@mui/icons-material';
import { usePublicTimelineEvent } from '../../../hooks/useTimelineEvents';

export default function PublicTimelineEventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading } = usePublicTimelineEvent(slug!);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="rounded" height={200} />
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Evento no encontrado</Typography>
        <Button component={Link} to="/timeline" startIcon={<ArrowBack />}>
          Volver a línea del tiempo
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button component={Link} to="/timeline" startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        Volver a línea del tiempo
      </Button>

      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={2}>
        {event.occurredAt && (
          <Chip
            icon={<EventIcon />}
            label={new Date(event.occurredAt).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            color="primary"
            variant="outlined"
          />
        )}
        {event.periodLabel && (
          <Chip label={event.periodLabel} color="secondary" variant="outlined" />
        )}
      </Box>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        {event.title}
      </Typography>

      {event.description && (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
          {event.description}
        </Typography>
      )}

      {event.historicalRelevance && (
        <Card variant="outlined" sx={{ bgcolor: 'action.hover', mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Relevancia histórica
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.historicalRelevance}
            </Typography>
          </CardContent>
        </Card>
      )}

      {event.mediaResources?.length > 0 && (
        <Box mb={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Multimedia
          </Typography>
          <Stack spacing={1}>
            {event.mediaResources.map((mr: any) => (
              <Card key={mr.id} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2">{mr.title}</Typography>
                  {mr.caption && (
                    <Typography variant="caption" color="text.secondary">
                      {mr.caption}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {event.relatedContents?.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Contenido relacionado
          </Typography>
          <Stack spacing={1}>
            {event.relatedContents.map((c: any) => (
              <Card key={c.id} variant="outlined">
                <CardActionArea component={Link} to={`/publications/${c.slug}`}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Article fontSize="small" color="primary" />
                      <Typography variant="subtitle2">{c.title}</Typography>
                    </Box>
                    {c.summary && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {c.summary}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Box>
      )}
    </Container>
  );
}
