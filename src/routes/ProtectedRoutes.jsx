import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ allowedRoles }) {
  const { loggedInUser } = useSelector((state) => state.auth);

  // Not logged in → send to login
  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed → send to home
  if (!allowedRoles.includes(loggedInUser.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized → allow access
  return <Outlet />;
}

export default ProtectedRoute;
