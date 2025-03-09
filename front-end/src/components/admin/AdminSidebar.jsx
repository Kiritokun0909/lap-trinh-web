import { NavLink } from "react-router-dom";
import "../../styles/admin/AdminSidebar.css";

function FunctionRow({ title, link }) {
  return (
    <div className="sidebar-row">
      <NavLink to={link}>{title}</NavLink>
    </div>
  );
}

export default function AdminSidebar() {
  return (
    <>
      <div className="admin-sidebar">
        <div className="sidebar-title">
          <span>CHỨC NĂNG</span>
        </div>
        <FunctionRow title="Quản lý thể loại" link="/admin/manage-genres" />
        <FunctionRow title="Quản lý tác giả" link="/admin/manage-authors" />
        <FunctionRow title="Quản lý truyện" link="/admin/manage-mangas" />
        <FunctionRow title="Quản lý người dùng" link="/admin/manage-customer" />
        <FunctionRow title="Thống kê" link="/admin/statistic" />
        <FunctionRow title="Quản lý tài khoản" link="/admin/manage-account" />
        <FunctionRow title="Đăng xuất" link="/#" />
      </div>
    </>
  );
}
