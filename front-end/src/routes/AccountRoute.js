import { Route, Routes } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import LikeFollowPage from '../pages/account/LikeFollowPage';

export default function AccountRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path='/likes' element={<LikeFollowPage pageType='like' />} />
        <Route path='/follows' element={<LikeFollowPage pageType='follow' />} />
      </Route>
    </Routes>
  );
}
