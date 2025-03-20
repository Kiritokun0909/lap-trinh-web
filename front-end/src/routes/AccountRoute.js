import { Route, Routes } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import NotFoundPage from '../pages/site/NotFoundPage';

export default function AccountRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path='/*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
