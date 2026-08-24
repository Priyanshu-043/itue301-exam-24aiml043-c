import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ allowedRoles }) {
  const { role } = useAuth();
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/classes" replace />;
}
