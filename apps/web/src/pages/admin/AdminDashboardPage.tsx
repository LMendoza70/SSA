import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Box,
} from '@mui/material';
import {
  Article,
  Publish,
  PermMedia,
  Category,
  Label,
  ListAlt,
  Source,
  FactCheck,
  Campaign,
  HealthAndSafety,
  Timeline as TimelineIcon,
  Share,
} from '@mui/icons-material';
import { useAuth } from '../../lib/auth';

interface DashboardCard {
  label: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const SECTIONS: DashboardCard[] = [
  { label: 'Contenidos', path: '/admin/contents', icon: <Article />, description: 'Gestionar contenido editorial' },
  { label: 'Publicaciones', path: '/admin/publications', icon: <Publish />, description: 'Administrar publicaciones' },
  { label: 'Multimedia', path: '/admin/media', icon: <PermMedia />, description: 'Biblioteca de recursos' },
  { label: 'Categorías', path: '/admin/categories', icon: <Category />, description: 'Clasificación por categorías' },
  { label: 'Etiquetas', path: '/admin/tags', icon: <Label />, description: 'Clasificación por etiquetas' },
  { label: 'Tipos de contenido', path: '/admin/content-types', icon: <ListAlt />, description: 'Tipos editoriales' },
  { label: 'Fuentes', path: '/admin/sources', icon: <Source />, description: 'Fuentes de información' },
  { label: 'Validaciones', path: '/admin/validations', icon: <FactCheck />, description: 'Validaciones institucionales' },
  { label: 'Campañas', path: '/admin/campaigns', icon: <Campaign />, description: 'Iniciativas de salud' },
  { label: 'Enfermedades', path: '/admin/diseases', icon: <HealthAndSafety />, description: 'Temas de salud pública' },
  { label: 'Línea del Tiempo', path: '/admin/timeline', icon: <TimelineIcon />, description: 'Memoria institucional' },
  { label: 'Canales', path: '/admin/communication-channels', icon: <Share />, description: 'Canales de comunicación' },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Panel de Administración
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenido{user?.displayName ? `, ${user.displayName}` : ''}. Selecciona una sección para gestionar.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {SECTIONS.map((section) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={section.path}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardActionArea
                onClick={() => navigate(section.path)}
                sx={{ height: '100%', p: 1.5 }}
                aria-label={`Ir a ${section.label}`}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ color: 'primary.main', display: 'flex' }}>
                    {section.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {section.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {section.description}
                    </Typography>
                  </Box>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
