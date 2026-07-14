import { Navigate, Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { Sidebar } from '../../components/admin/Sidebar';
import { useAuth } from '../../lib/auth';

export function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Box display="flex">
      <Sidebar />
      <Box component="main" flex={1} p={3}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
