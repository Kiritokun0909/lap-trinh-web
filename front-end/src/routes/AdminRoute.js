import { Route, Routes } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout.jsx';

import ManageMangaPage from '../pages/admin/ManageMangasPage';
import AccountPage from '../pages/account/AccountPage/AccountPage';
import PasswordPage from '../pages/account/PasswordPage/PasswordPage';
import GenrePage from '../pages/admin/ManageGenre/GenrePage';
import AuthorPage from '../pages/admin/ManageAuthor/AuthorPage.jsx';
import ListMangaPage from '../pages/admin/ManageListManga/ListMangaPage.jsx';
import MangaPage from '../pages/admin/ManageManga/MangaPage.jsx';
import AddUpdateMangaPage from '../pages/admin/AddUpdateManga/AddUpdateMangaPage.jsx';
import AddUpdateChapterPage from '../pages/admin/AddUpdateChapter/AddUpdateChapterPage.jsx';
import ManageListUserPage from '../pages/admin/ManageListUser/ManageListUserPage.jsx';
export default function AdminRoute() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path='/manage-genres' element={<GenrePage />} />
        <Route path='/manage-authors' element={<AuthorPage />} />
        <Route path='/manage-mangas' element={<ListMangaPage />} />
        <Route path='/manga/:mangaId' element={<MangaPage />} />
        <Route path='/add-update-manga/:mangaId' element={<AddUpdateMangaPage />} />
        <Route path='/add-chapter/:mangaId' element={<AddUpdateChapterPage />} />
        <Route path='/chapter/:chapterId' element={<AddUpdateChapterPage />} />

        <Route path='/manage-list-user' element={<ManageListUserPage />} />
        <Route path='/statistic' element={<ManageMangaPage />} />
        <Route path='/account' element={<AccountPage />} />
        <Route path='/password' element={<PasswordPage />} />
        <Route path='/*' element={<ListMangaPage />} />
      </Route>
    </Routes>
  );
}
