import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './lib/auth';
import { AdminLayout } from './pages/admin/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { ContentListPage } from './pages/admin/contents/ContentListPage';
import { ContentFormPage } from './pages/admin/contents/ContentFormPage';
import { HomePage } from './pages/HomePage';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="contents" replace />} />
              <Route path="contents" element={<ContentListPage />} />
              <Route path="contents/new" element={<ContentFormPage />} />
              <Route path="contents/:id/edit" element={<ContentFormPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
