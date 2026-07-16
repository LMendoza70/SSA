import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';
import { Dashboard, Person, Article, Publish, PermMedia, Category, Label, Campaign, HealthAndSafety, ListAlt, Timeline as TimelineIcon, Share, Logout, Source, FactCheck } from '@mui/icons-material';
import { useAuth } from '../../lib/auth';

const DRAWER_WIDTH = 260;

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>
          SSA CMS
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
      <List sx={{ flex: 1, px: 1 }}>
        <ListItemButton
          selected={isActive('/admin') && !isActive('/admin/perfil')}
          onClick={() => navigate('/admin')}
          sx={{ borderRadius: 1, mb: 0.5 }}
          aria-label="Panel de administración"
        >
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 0.5 }} />

        <ListItemButton
          selected={location.pathname.startsWith('/admin/contents')}
          onClick={() => navigate('/admin/contents')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Article />
          </ListItemIcon>
          <ListItemText primary="Contenidos" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/publications')}
          onClick={() => navigate('/admin/publications')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Publish />
          </ListItemIcon>
          <ListItemText primary="Publicaciones" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/media')}
          onClick={() => navigate('/admin/media')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <PermMedia />
          </ListItemIcon>
          <ListItemText primary="Multimedia" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/categories')}
          onClick={() => navigate('/admin/categories')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText primary="Categorías" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/tags')}
          onClick={() => navigate('/admin/tags')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Label />
          </ListItemIcon>
          <ListItemText primary="Etiquetas" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/content-types')}
          onClick={() => navigate('/admin/content-types')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <ListAlt />
          </ListItemIcon>
          <ListItemText primary="Tipos de contenido" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/sources')}
          onClick={() => navigate('/admin/sources')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon><Source /></ListItemIcon>
          <ListItemText primary="Fuentes" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/validations')}
          onClick={() => navigate('/admin/validations')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon><FactCheck /></ListItemIcon>
          <ListItemText primary="Validaciones" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/campaigns')}
          onClick={() => navigate('/admin/campaigns')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Campaign />
          </ListItemIcon>
          <ListItemText primary="Campañas" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/diseases')}
          onClick={() => navigate('/admin/diseases')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <HealthAndSafety />
          </ListItemIcon>
          <ListItemText primary="Enfermedades" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/timeline')}
          onClick={() => navigate('/admin/timeline')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary="Línea del Tiempo" />
        </ListItemButton>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/communication-channels')}
          onClick={() => navigate('/admin/communication-channels')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText primary="Canales" />
        </ListItemButton>
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
      {user && (
        <Box sx={{ p: 2 }}>
          <ListItemButton
            selected={location.pathname === '/admin/perfil'}
            onClick={() => navigate('/admin/perfil')}
            sx={{ borderRadius: 1, mb: 1, px: 1 }}
            aria-label="Perfil operativo"
          >
            <ListItemIcon sx={{ minWidth: 36 }}><Person /></ListItemIcon>
            <ListItemText
              primary={user.displayName}
              secondary={user.email}
              primaryTypographyProps={{ variant: 'body2', noWrap: true, sx: { color: 'rgba(255,255,255,0.9)' } }}
              secondaryTypographyProps={{ variant: 'caption', noWrap: true, sx: { color: 'rgba(255,255,255,0.5)' } }}
            />
          </ListItemButton>
          <Button
            startIcon={<Logout />}
            size="small"
            onClick={handleLogout}
            fullWidth
            sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#FFFFFF' } }}
            aria-label="Cerrar sesión"
          >
            Cerrar sesión
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
