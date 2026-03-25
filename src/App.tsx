import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell, Group } from '@mantine/core';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { PageLoader } from './components/ui/PageLoader';

// Ленивая загрузка страниц для разделения бандлов (Code Splitting)
const AdsListPage = lazy(() => import('./pages/AdsListPage').then((module) => ({ default: module.AdsListPage })));
const AdDetailsPage = lazy(() => import('./pages/AdDetailsPage').then((module) => ({ default: module.AdDetailsPage })));
const AdEditPage = lazy(() => import('./pages/AdEditPage').then((module) => ({ default: module.AdEditPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function App() {
  return (
    <BrowserRouter>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header withBorder={false}>
          <Group h="100%" px="md" justify="flex-end">
            <ThemeToggle />
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/ads" replace />} />
              <Route path="/ads" element={<AdsListPage />} />
              <Route path="/ads/:id" element={<AdDetailsPage />} />
              <Route path="/ads/:id/edit" element={<AdEditPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
