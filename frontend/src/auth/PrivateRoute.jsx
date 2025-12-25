import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toLowerCase(); // ✅ normalisation

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.warn(`🚫 Accès refusé pour rôle : ${user.role}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
