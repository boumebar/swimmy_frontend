import { useEffect, useState } from 'react';
import useAuth from '../utils/useAuth';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loadAuth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuth();
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = '/auth';
    return null;
  }

  return children;
}
