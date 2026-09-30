import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../store/authStore';
import Loading from '../UI/Loading.tsx';

const RequireGuest = () => {
  const status = useAuthStore((state) => state.status);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    if (status === 'idle') checkAuth();
  }, [status, checkAuth]);

  if (status === 'idle' || status === 'loading') {
    return <Loading />;
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireGuest;
