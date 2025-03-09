import { Link } from "react-router-dom";
import "../../styles/admin/AdminLayout.css";

export default function AdminHeader() {
  return (
    <div className="admin-header">
      <Link to="/admin/">Bảng điểu khiển</Link>
    </div>
  );
}
