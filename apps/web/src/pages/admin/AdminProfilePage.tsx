import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Divider,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAuth } from '../../lib/auth';

export function AdminProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Perfil Operativo
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Información del usuario autenticado
      </Typography>

      <Card variant="outlined">
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
          <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main' }} aria-label="Avatar del usuario">
            <Person sx={{ fontSize: 36 }} />
          </Avatar>

          <Box textAlign="center">
            <Typography variant="h6" fontWeight={600}>
              {user.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <Divider sx={{ width: '100%' }} />

          <Box width="100%">
            <Box display="flex" justifyContent="space-between" py={1}>
              <Typography variant="body2" color="text.secondary">ID de usuario</Typography>
              <Typography variant="body2" fontWeight={500}>{user.id}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={1}>
              <Typography variant="body2" color="text.secondary">Nombre</Typography>
              <Typography variant="body2" fontWeight={500}>{user.displayName}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" py={1}>
              <Typography variant="body2" color="text.secondary">Correo electrónico</Typography>
              <Typography variant="body2" fontWeight={500}>{user.email}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
