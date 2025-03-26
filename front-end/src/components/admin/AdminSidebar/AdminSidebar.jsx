import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuth } from '../../../context/AuthContext';

import './AdminSidebar.css';

function FunctionRow({ title, link, onClick }) {
  return (
    <div className='sidebar-row' onClick={onClick}>
      <NavLink to={link}>{title}</NavLink>
    </div>
  );
}

export default function AdminSidebar() {
  const { removeCredentials } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    removeCredentials();
    toast.success('Đăng xuất thành công!');
    navigate('/');
  };

  return (
    <div className='admin-sidebar'>
      <div className='sidebar-title'>
        <span>CHỨC NĂNG</span>
      </div>
      <FunctionRow title='Quản lý thể loại' link='/admin/manage-genres' />
      <FunctionRow title='Quản lý tác giả' link='/admin/manage-authors' />
      <FunctionRow title='Quản lý truyện' link='/admin/manage-mangas' />
      <FunctionRow title='Quản lý người dùng' link='/admin/manage-customer' />
      <FunctionRow title='Thống kê' link='/admin/statistic' />
      <FunctionRow title='Quản lý tài khoản' link='/admin/account' />
      <FunctionRow title='Đổi mật khẩu' link='/admin/password' />
      <FunctionRow title='Đăng xuất' link='/#' onClick={handleLogoutClick} />
    </div>
  );
}
