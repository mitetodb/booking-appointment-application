import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export const RequireGuest = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};