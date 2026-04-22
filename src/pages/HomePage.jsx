import { useEffect, useState } from 'react';
import useAuth from '../utils/useAuth';

export default function HomePage() {
  const { user, isAuthenticated, logout, loadAuth } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🏊 SWIMMY</h1>
          <div className="flex items-center gap-4">
  	    <span>Welcome, {user?.name}!</span>
  
            <a href="/profile"
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
            >
            Profile
            </a>
            <button
              onClick={() => {
                logout();
                window.location.href = '/auth';
              }}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Welcome to SWIMMY!</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700 mb-4">
            Find and book swimming pools in Algeria.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-bold mb-2">Browse Pools</h3>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-bold mb-2">Create Pool</h3>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
