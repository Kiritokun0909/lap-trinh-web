import { Route, Routes } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout.jsx';

import ManageMangaPage from '../pages/admin/ManageMangasPage';
import AccountPage from '../pages/account/AccountPage/AccountPage';
import PasswordPage from '../pages/account/PasswordPage/PasswordPage';
import GenrePage from '../pages/admin/ManageGenre/GenrePage';
import AuthroPage from '../pages/admin/ManageAuthor/AuthorPage.jsx';

export default function AdminRoute() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path='/' element={<ManageMangaPage />} />
        <Route path='/manage-genres' element={<GenrePage />} />
        <Route path='/manage-authors' element={<AuthroPage />} />
        <Route path='/manage-mangas' element={<ManageMangaPage />} />
        <Route path='/manage-customer' element={<ManageMangaPage />} />
        <Route path='/statistic' element={<ManageMangaPage />} />
        <Route path='/account' element={<AccountPage />} />
        <Route path='/password' element={<PasswordPage />} />
      </Route>
    </Routes>
  );
}
