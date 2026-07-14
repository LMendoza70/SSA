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
import { Article as ArticleIcon, Logout as LogoutIcon } from '@mui/icons-material';
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
        <Typography variant="h6" fontWeight={700} color="primary">
          SSA CMS
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, px: 1 }}>
        <ListItemButton
          selected={location.pathname.startsWith('/admin/contents')}
          onClick={() => navigate('/admin/contents')}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Contenidos" />
        </ListItemButton>
      </List>
      <Divider />
      {user && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user.displayName}
          </Typography>
          <Typography variant="caption" color="text.disabled" noWrap>
            {user.email}
          </Typography>
          <Button
            startIcon={<LogoutIcon />}
            size="small"
            onClick={handleLogout}
            sx={{ mt: 1 }}
          >
            Cerrar sesión
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
