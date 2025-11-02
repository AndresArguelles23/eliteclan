import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import '@fontsource/anton/400.css';
import '@fontsource/urbanist/latin.css';
import '@fontsource/inter/latin.css';

import './index.css';
import './App.css';
import SiteLayout from './layouts/SiteLayout';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import ShowsPage from './pages/Shows';
import ShowDetailPage from './pages/ShowDetail';
import DiscographyPage from './pages/Discography';
import ContactPage from './pages/Contact';
import { ThemeProvider } from './styles/theme';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<SiteLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="services" element={<ServicesPage />} />
      <Route path="shows" element={<ShowsPage />} />
      <Route path="shows/:slug" element={<ShowDetailPage />} />
      <Route path="discography" element={<DiscographyPage />} />
      <Route path="contact" element={<ContactPage />} />
    </Route>,
  ),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
