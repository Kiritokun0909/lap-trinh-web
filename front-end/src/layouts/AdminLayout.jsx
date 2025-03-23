import { Outlet } from 'react-router-dom';

import Footer from '../components/site/Footer/Footer';
import AdminSidebar from '../components/admin/AdminSidebar/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

import '../styles/App.css';
import '../styles/admin/AdminLayout.css';

export default function AdminLayout() {
  return (
    <div className='admin-layout'>
      <AdminHeader />
      <div className='admin-container'>
        <AdminSidebar />
        <div className='admin-content'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
