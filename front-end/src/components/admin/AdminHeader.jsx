import { Link } from 'react-router-dom';
import '../../layouts/AdminLayout.css';

export default function AdminHeader() {
  return (
    <div className='admin-header'>
      <Link to='/admin/'>Bảng điểu khiển</Link>
    </div>
  );
}
