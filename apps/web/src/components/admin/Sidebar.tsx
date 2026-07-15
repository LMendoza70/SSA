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
import { Article, Publish, PermMedia, Logout } from '@mui/icons-material';
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
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />
      {user && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }} noWrap>
            {user.displayName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }} noWrap>
            {user.email}
          </Typography>
          <Button
            startIcon={<Logout />}
            size="small"
            onClick={handleLogout}
            sx={{ color: 'rgba(255,255,255,0.8)', mt: 1, '&:hover': { color: '#FFFFFF' } }}
          >
            Cerrar sesión
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
