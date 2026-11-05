
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../api/api';

export default function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setChecking(false);
        return;
      }

      try {
        await api.get('/auth/admin/profile');
        setAuthorized(true);
      } catch (error) {
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    verifyToken();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
