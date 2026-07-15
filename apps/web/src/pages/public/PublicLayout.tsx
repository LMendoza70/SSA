import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Divider,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useState } from 'react';

export function PublicLayout() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: '#FFFFFF' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            Jurisdicción Sanitaria Huejutla
          </Typography>

          <Stack direction="row" spacing={1} sx={{ ml: 3, display: { xs: 'none', md: 'flex' } }}>
            <Button component={Link} to="/publications" color="inherit">
              Publicaciones
            </Button>
            <Button component={Link} to="/campaigns" color="inherit">
              Campañas
            </Button>
            <Button component={Link} to="/diseases" color="inherit">
              Enfermedades
            </Button>
            <Button component={Link} to="/timeline" color="inherit">
              Historia
            </Button>
          </Stack>

          <Box flex={1} />

          <Box component="form" onSubmit={handleSearch} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <TextField
              size="small"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: 220 }}
            />
          </Box>

          <Button component={Link} to="/admin/login" color="inherit" size="small">
            Admin
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" flex={1}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ bgcolor: 'primary.main', color: '#FFFFFF', py: 4, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={3}
          >
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Jurisdicción Sanitaria de Huejutla
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Información oficial de salud pública
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Enlaces
              </Typography>
              <Stack spacing={0.5}>
                <Button component={Link} to="/publications" size="small" sx={{ color: '#FFFFFF', opacity: 0.8, justifyContent: 'flex-start', '&:hover': { opacity: 1 } }}>
                  Publicaciones
                </Button>
                <Button component={Link} to="/campaigns" size="small" sx={{ color: '#FFFFFF', opacity: 0.8, justifyContent: 'flex-start', '&:hover': { opacity: 1 } }}>
                  Campañas
                </Button>
                <Button component={Link} to="/diseases" size="small" sx={{ color: '#FFFFFF', opacity: 0.8, justifyContent: 'flex-start', '&:hover': { opacity: 1 } }}>
                  Enfermedades
                </Button>
                <Button component={Link} to="/timeline" size="small" sx={{ color: '#FFFFFF', opacity: 0.8, justifyContent: 'flex-start', '&:hover': { opacity: 1 } }}>
                  Línea del Tiempo
                </Button>
              </Stack>
            </Box>
          </Stack>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', my: 2 }} />
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            &copy; {new Date().getFullYear()} Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
