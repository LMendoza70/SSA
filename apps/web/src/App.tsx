import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './lib/auth';
import { AdminLayout } from './pages/admin/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { ContentListPage } from './pages/admin/contents/ContentListPage';
import { ContentFormPage } from './pages/admin/contents/ContentFormPage';
import { PublicationListPage } from './pages/admin/publications/PublicationListPage';
import { MediaManagerPage } from './pages/admin/media/MediaManagerPage';
import { CategoryListPage } from './pages/admin/categories/CategoryListPage';
import { TagListPage } from './pages/admin/tags/TagListPage';
import CampaignListPage from './pages/admin/campaigns/CampaignListPage';
import DiseaseListPage from './pages/admin/diseases/DiseaseListPage';
import TimelineEventListPage from './pages/admin/timeline/TimelineEventListPage';
import CommunicationChannelListPage from './pages/admin/communication-channels/CommunicationChannelListPage';
import ContentTypeListPage from './pages/admin/content-types/ContentTypeListPage';
import PublicCampaignListPage from './pages/public/campaigns/PublicCampaignListPage';
import PublicCampaignDetailPage from './pages/public/campaigns/PublicCampaignDetailPage';
import PublicDiseaseListPage from './pages/public/diseases/PublicDiseaseListPage';
import PublicDiseaseDetailPage from './pages/public/diseases/PublicDiseaseDetailPage';
import PublicTimelinePage from './pages/public/timeline/PublicTimelinePage';
import PublicTimelineEventDetailPage from './pages/public/timeline/PublicTimelineEventDetailPage';
import { PublicLayout } from './pages/public/PublicLayout';
import { PublicHomePage } from './pages/public/PublicHomePage';
import { PublicPublicationListPage } from './pages/public/PublicPublicationListPage';
import { PublicPublicationDetailPage } from './pages/public/PublicPublicationDetailPage';
import { PublicSearchPage } from './pages/public/PublicSearchPage';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<PublicHomePage />} />
              <Route path="/publications" element={<PublicPublicationListPage />} />
              <Route path="/publications/:slug" element={<PublicPublicationDetailPage />} />
              <Route path="/campaigns" element={<PublicCampaignListPage />} />
              <Route path="/campaigns/:slug" element={<PublicCampaignDetailPage />} />
              <Route path="/diseases" element={<PublicDiseaseListPage />} />
              <Route path="/diseases/:slug" element={<PublicDiseaseDetailPage />} />
              <Route path="/timeline" element={<PublicTimelinePage />} />
              <Route path="/timeline/:slug" element={<PublicTimelineEventDetailPage />} />
              <Route path="/search" element={<PublicSearchPage />} />
            </Route>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="contents" replace />} />
              <Route path="contents" element={<ContentListPage />} />
              <Route path="contents/new" element={<ContentFormPage />} />
              <Route path="contents/:id/edit" element={<ContentFormPage />} />
              <Route path="publications" element={<PublicationListPage />} />
              <Route path="media" element={<MediaManagerPage />} />
              <Route path="categories" element={<CategoryListPage />} />
              <Route path="tags" element={<TagListPage />} />
              <Route path="content-types" element={<ContentTypeListPage />} />
              <Route path="campaigns" element={<CampaignListPage />} />
              <Route path="diseases" element={<DiseaseListPage />} />
              <Route path="timeline" element={<TimelineEventListPage />} />
              <Route path="communication-channels" element={<CommunicationChannelListPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
