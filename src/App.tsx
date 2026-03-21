import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdsListPage } from './pages/AdsListPage';
import { AdDetailsPage } from './pages/AdDetailsPage';
import { AdEditPage } from './pages/AdEditPage';

function App() {
  return (
    // BrowserRouter — это главный "прослушиватель" адресной строки браузера
    <BrowserRouter>
      {/* Routes — это контейнер, где мы перечисляем все наши пути */}
      <Routes>
        {/* 1. Если пользователь зашел в корень сайта (/), сразу кидаем его на /ads */}
        <Route path="/" element={<Navigate to="/ads" replace />} />

        {/* 2. Страница со списком всех объявлений */}
        <Route path="/ads" element={<AdsListPage />} />

        {/* 3. Страница просмотра одного объявления (id - это переменная) */}
        <Route path="/ads/:id" element={<AdDetailsPage />} />

        {/* 4. Страница редактирования этого же объявления */}
        <Route path="/ads/:id/edit" element={<AdEditPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
