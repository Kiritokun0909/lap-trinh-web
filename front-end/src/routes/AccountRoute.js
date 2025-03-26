import { Route, Routes } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import LikeFollowPage from '../pages/account/LikeFollowPage/LikeFollowPage';
import HistoryPage from '../pages/account/HistoryPage/Historypage';
import NotificationPage from '../pages/account/NotificationPage/NotificationPage';
import AccountPage from '../pages/account/AccountPage/AccountPage';
import PasswordPage from '../pages/account/PasswordPage/PasswordPage';

export default function AccountRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path='/likes' element={<LikeFollowPage pageType='like' />} />
        <Route path='/follows' element={<LikeFollowPage pageType='follow' />} />
        <Route path='/histories' element={<HistoryPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/info' element={<AccountPage />} />
        <Route path='/password' element={<PasswordPage />} />
      </Route>
    </Routes>
  );
}
