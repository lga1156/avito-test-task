import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdsListPage } from './pages/AdsListPage';
import { AdDetailsPage } from './pages/AdDetailsPage';
import { AdEditPage } from './pages/AdEditPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ads" replace />} />

        <Route path="/ads" element={<AdsListPage />} />

        <Route path="/ads/:id" element={<AdDetailsPage />} />

        <Route path="/ads/:id/edit" element={<AdEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
