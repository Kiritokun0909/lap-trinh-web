import { Navigate, Outlet, useLocation } from "react-router-dom";
import HandleCode from "../utils/HandleCode";

const ProtectedRoute = ({ allowedRoles }) => {
  const accessToken = localStorage.getItem("accessToken");
  const roleId = JSON.parse(localStorage.getItem("roleId"));

  const location = useLocation();
  const currentPath = location.pathname;

  // console.log(">>> routes: ", currentPath);
  if (currentPath === "/login" && accessToken) {
    return <Navigate to="/" />;
  }

  if (!accessToken && allowedRoles) {
    return <Navigate to="/login" />;
  }

  // Redirect admin users trying to access public routes
  if (roleId === HandleCode.ROLE_ADMIN && !allowedRoles) {
    return <Navigate to="/admin" />;
  }

  if (allowedRoles && !allowedRoles.includes(roleId)) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
