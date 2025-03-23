import { Route, Routes } from 'react-router-dom';

import SiteLayout from '../layouts/SiteLayout';
import HomePage from '../pages/site/HomePage/HomePage';
import NotFoundPage from '../pages/site/NotFoundPage';
import PrivacyPage from '../pages/site/PrivacyPage';
import AboutPage from '../pages/site/AboutPage';
import { LoginPage } from '../pages/site/LoginPage/LoginPage';
import MangaPage from '../pages/site/MangaPage/MangaPage';
import ChapterPage from '../pages/site/ChapterPage/ChapterPage';

export default function SiteRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/privacy' element={<PrivacyPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/manga/:mangaId' element={<MangaPage />} />
        <Route path='/chapter/:chapterId' element={<ChapterPage />} />
        <Route path='/*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
