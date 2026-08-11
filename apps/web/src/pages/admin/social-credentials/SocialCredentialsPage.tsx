import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { useFacebookSDK } from '../../../hooks/useFacebookSDK';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LoginIcon from '@mui/icons-material/Login';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

const PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <FacebookIcon sx={{ color: '#1877F2' }} />,
    needsOAuth: true,
    oauthLabel: 'Iniciar sesión con Facebook',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: null,
    needsOAuth: false,
    oauthLabel: '',
    dependsOn: 'facebook',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <YouTubeIcon sx={{ color: '#FF0000' }} />,
    needsOAuth: true,
    oauthLabel: 'Iniciar sesión con Google',
  },
];

function SocialCredentialsPage() {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [facebookAppId, setFacebookAppId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { initSDK, login: fbLogin } = useFacebookSDK();

  const redirectUri = () => `${window.location.origin}/admin/social-credentials`;

  const { data: platforms, refetch: refetchPlatforms } = useQuery<string[]>({
    queryKey: ['social-credentials'],
    queryFn: async () => {
      const { data } = await api.get('/admin/social-credentials');
      return data;
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      setErrorMsg(`YouTube: error en la autorización (${error})`);
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    if (!code) return;

    const handleCallback = async () => {
      setOauthLoading('youtube');
      try {
        await api.post('/admin/social-credentials/youtube/callback', {
          code,
          redirectUri: redirectUri(),
        });
        queryClient.invalidateQueries({ queryKey: ['social-credentials'] });
        refetchPlatforms();
        setSuccessMsg('Conectado a YouTube exitosamente');
      } catch (err) {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          ?? (err as Error).message;
        setErrorMsg(`YouTube: ${message}`);
      } finally {
        setOauthLoading(null);
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    handleCallback();
  }, [queryClient, refetchPlatforms]);

  const deleteCredentials = useMutation({
    mutationFn: async (platform: string) => {
      await api.delete(`/admin/social-credentials/${platform}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-credentials'] });
      refetchPlatforms();
      setSuccessMsg('Credenciales eliminadas');
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? (err as Error).message;
      setErrorMsg(message);
    },
  });

  const uploadCredentialsFile = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/admin/social-credentials/upload-credentials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data as { platform: string; message: string };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['social-credentials'] });
      refetchPlatforms();
      setSuccessMsg(data.message);
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? (err as Error).message;
      setErrorMsg(message);
    },
  });

  const handleFacebookLogin = async () => {
    const appId = (facebookAppId || '').trim();
    if (!appId) {
      setErrorMsg('Ingresá el App ID de Facebook (de developers.facebook.com)');
      return;
    }

    setOauthLoading('facebook');
    try {
      // 1. Guardar App ID en backend (reutiliza auth-url, valida app_id)
      await api.post('/admin/social-credentials/facebook/auth-url', {
        redirectUri: redirectUri(),
        appId,
      });

      // 2. Usar SDK de Facebook para el login (evita popups bloqueados)
      await initSDK(appId);
      const accessToken = await fbLogin();

      // 3. Enviar token al backend para guardar page_token, page_id e Instagram
      await api.post('/admin/social-credentials/facebook/callback', {
        access_token: accessToken,
      });

      queryClient.invalidateQueries({ queryKey: ['social-credentials'] });
      refetchPlatforms();
      setSuccessMsg('Conectado a Facebook exitosamente');
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? (err as Error).message;
      setErrorMsg(`Facebook: ${message}`);
    } finally {
      setOauthLoading(null);
    }
  };

  const handleYouTubeLogin = async () => {
    setOauthLoading('youtube');
    try {
      const { data } = await api.post('/admin/social-credentials/youtube/auth-url', {
        redirectUri: redirectUri(),
      });
      const { url } = data as { url: string };

      window.location.href = url;
      return;
    } catch (err) {
      setErrorMsg(`YouTube: ${(err as Error).message}`);
      setOauthLoading(null);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadCredentialsFile.mutate(file);
    e.target.value = '';
  };

  const isConfigured = (platformId: string) => platforms?.includes(platformId);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Configuración de Redes Sociales
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Configura las credenciales de acceso para Facebook, Instagram y YouTube. Los tokens se
          obtienen mediante inicio de sesión OAuth con cada plataforma — no se ingresan manualmente.
          Los secretos (Client Secret de Google) se cargan mediante archivo JSON descargado de la
          consola de desarrollador.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Las credenciales se almacenan de forma segura en la base de datos del servidor.
        </Typography>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plataforma</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PLATFORMS.map((platform) => {
              const configured = isConfigured(platform.id);
              return (
                <TableRow key={platform.id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {platform.icon}
                      <Typography fontWeight={600}>{platform.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={configured ? 'Configurado' : 'No configurado'}
                      color={configured ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {configured && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteCredentials.mutate(platform.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {oauthLoading && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Iniciando sesión en {oauthLoading === 'facebook' ? 'Facebook' : 'Google'}...
          </Typography>
          <LinearProgress />
        </Paper>
      )}

      <Typography variant="h5" fontWeight={600} mb={2}>
        Configurar plataformas
      </Typography>

      <Stack spacing={2}>
        {/* Facebook */}
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FacebookIcon sx={{ fontSize: 32, color: '#1877F2' }} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>Facebook</Typography>
              <Typography variant="body2" color="text.secondary">
                Ingresá el App ID de tu aplicación de Facebook y luego iniciá sesión. Los tokens de
                página y la cuenta de Instagram se obtienen automáticamente.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="stretch">
              <TextField
                label="App ID"
                size="small"
                placeholder="123456789012345"
                value={facebookAppId}
                onChange={(e) => setFacebookAppId(e.target.value)}
              />
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleFacebookLogin}
                disabled={oauthLoading === 'facebook'}
                sx={{ backgroundColor: '#1877F2', '&:hover': { backgroundColor: '#1565C0' }, whiteSpace: 'nowrap' }}
              >
                {isConfigured('facebook') ? 'Re-conectar' : 'Iniciar sesión'}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* YouTube */}
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <YouTubeIcon sx={{ fontSize: 32, color: '#FF0000' }} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>YouTube</Typography>
              <Typography variant="body2" color="text.secondary">
                Carga el archivo JSON de Google Cloud Console con client_id y client_secret.
                Luego inicia sesión para autorizar la cuenta de YouTube.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={handleFileSelect}
                disabled={uploadCredentialsFile.isPending}
              >
                Cargar archivo
              </Button>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={handleYouTubeLogin}
                disabled={oauthLoading === 'google'
                  || uploadCredentialsFile.isPending}
                sx={{ backgroundColor: '#FF0000', '&:hover': { backgroundColor: '#CC0000' } }}
              >
                {isConfigured('youtube') ? 'Re-conectar' : 'Iniciar sesión'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={6000}
        onClose={() => setErrorMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorMsg(null)} severity="error" variant="filled">
          {errorMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMsg(null)} severity="success" variant="filled">
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SocialCredentialsPage;