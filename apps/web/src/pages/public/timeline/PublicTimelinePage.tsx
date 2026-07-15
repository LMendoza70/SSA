import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Skeleton, Chip, Card, CardContent,
} from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';
import { usePublicTimelineEvents } from '../../../hooks/useTimelineEvents';

export default function PublicTimelinePage() {
  const { data: events, isLoading } = usePublicTimelineEvents();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Línea del Tiempo
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Memoria institucional de la Jurisdicción Sanitaria de Huejutla
      </Typography>

      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={100} sx={{ mb: 2 }} />
        ))
      ) : (events || []).length === 0 ? (
        <Typography color="text.secondary">
          No hay eventos históricos registrados
        </Typography>
      ) : (
        <Box sx={{ position: 'relative', pl: 4 }}>
          <Box
            sx={{
              position: 'absolute',
              left: 16,
              top: 0,
              bottom: 0,
              width: 3,
              bgcolor: 'primary.main',
              opacity: 0.3,
              borderRadius: 2,
            }}
          />
          {(events || []).map((event: any) => (
            <Box
              key={event.id}
              component={Link}
              to={`/timeline/${event.slug}`}
              sx={{ textDecoration: 'none', display: 'block', mb: 3, position: 'relative' }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: -28,
                  top: 20,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                }}
              >
                <EventIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />
              </Box>
              <Card
                variant="outlined"
                sx={{
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': { boxShadow: 3, transform: 'translateX(4px)' },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={1}>
                    {event.occurredAt && (
                      <Typography variant="caption" color="primary" fontWeight={600}>
                        {new Date(event.occurredAt).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    )}
                    {event.periodLabel && (
                      <Chip label={event.periodLabel} size="small" color="secondary" variant="outlined" />
                    )}
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {event.title}
                  </Typography>
                  {event.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {event.description}
                    </Typography>
                  )}
                  {event.historicalRelevance && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
                      {event.historicalRelevance}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
