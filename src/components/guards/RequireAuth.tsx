import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../store/authStore';
import Loading from '../UI/Loading.tsx';

const RequireAuth = () => {
  const status = useAuthStore((state) => state.status);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    if (status === 'idle') checkAuth();
  }, [status, checkAuth]);

  if (status === 'idle' || status === 'loading') {
    return <Loading />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
