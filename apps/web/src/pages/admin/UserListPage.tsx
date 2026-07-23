import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, MenuItem, Snackbar, Alert, IconButton,
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  EDITOR: 'Editor',
  WRITER: 'Redactor',
  VALIDATOR: 'Validador',
  PUBLISHER: 'Publicador',
  AUDITOR: 'Auditor',
};

const ROLE_COLORS: Record<string, 'error' | 'primary' | 'success' | 'warning' | 'info' | 'default'> = {
  ADMIN: 'error',
  EDITOR: 'primary',
  WRITER: 'success',
  VALIDATOR: 'warning',
  PUBLISHER: 'info',
  AUDITOR: 'default',
};

interface UserForm {
  id?: string;
  email: string;
  displayName: string;
  password: string;
  role: string;
}

const EMPTY_FORM: UserForm = { email: '', displayName: '', password: '', role: 'EDITOR' };

export function UserListPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSave = async () => {
    try {
      if (form.id) {
        const payload: any = { email: form.email, displayName: form.displayName, role: form.role };
        if (form.password) payload.password = form.password;
        await api.patch(`/admin/users/${form.id}`, payload);
        setSuccess('Usuario actualizado');
      } else {
        await api.post('/admin/users', form);
        setSuccess('Usuario creado');
      }
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      loadUsers();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/users/${deleteId}`);
      setSuccess('Usuario desactivado');
      setDeleteId(null);
      loadUsers();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al desactivar usuario');
    }
  };

  const openEdit = (u: any) => {
    setForm({ id: u.id, email: u.email, displayName: u.displayName, password: '', role: u.role });
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>Usuarios</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setForm(EMPTY_FORM); setDialogOpen(true); }}>
          Nuevo usuario
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center">Cargando...</TableCell></TableRow>
            ) : users.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">Sin usuarios</TableCell></TableRow>
            ) : users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>
                  {u.displayName}
                  {u.id === currentUser?.id && (
                    <Chip label="Tú" size="small" sx={{ ml: 1 }} />
                  )}
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip label={ROLE_LABELS[u.role] || u.role} color={ROLE_COLORS[u.role] || 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={u.isActive ? 'Sí' : 'No'} color={u.isActive ? 'success' : 'default'} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(u)}><Edit /></IconButton>
                  {u.id !== currentUser?.id && (
                    <Button size="small" color="error" onClick={() => setDeleteId(u.id)}>Desactivar</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField label="Nombre" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} fullWidth required />
            <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth required />
            <TextField label="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth helperText={form.id ? 'Dejar vacío para no cambiar' : undefined} required={!form.id} />
            <TextField select label="Rol" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} fullWidth required>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>{form.id ? 'Guardar' : 'Crear'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Desactivar usuario</DialogTitle>
        <DialogContent><DialogContentText>El usuario dejará de tener acceso al sistema. Puedes reactivarlo después.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Desactivar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}
