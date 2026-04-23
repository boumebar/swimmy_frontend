import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../utils/useAuth';
import api from '../utils/api';

export default function BrowsePoolsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const fetchPools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (priceMax) params.append('priceMax', priceMax);

      const res = await api.get(`/pools?${params.toString()}`);
      setPools(res.data);
    } catch (err) {
      console.error('Error fetching pools:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPools();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🏊 SWIMMY</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}!</span>
            
            <a href="/create-pool"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 font-bold"
            >
              + Create Pool
            </a>
            
            <a href="/profile"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
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
        <h2 className="text-3xl font-bold mb-6">Browse Pools</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Location (e.g., Algiers)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max Price (DZD)"
              value={priceMax}
              onChange={(e) => {
                const value = Math.max(0, Math.floor(parseInt(e.target.value) || 0) / 10) * 10;
                setPriceMax(value);
              }}
              step="10"
              min="0"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-bold"
            >
              Search
            </button>
          </div>
        </form>

        {/* Pools Grid */}
        {loading ? (
          <div className="text-center py-12">Loading pools...</div>
        ) : pools.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No pools found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool) => (
              <div
                key={pool.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/pools/${pool.id}`)}
              >
                {/* Pool Image */}
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 relative overflow-hidden">
                  {pool.photos && pool.photos.length > 0 ? (
                    <img
                      src={pool.photos[0]}
                      alt={pool.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                      🏊
                    </div>
                  )}
                </div>

                {/* Pool Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{pool.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {pool.description}
                  </p>

                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-blue-600 font-bold">
                      {pool.pricePerDay.toLocaleString()} DZD/day
                    </p>
                    {pool.pricePerHour > 0 && (
                      <p className="text-gray-500 text-sm">
                        {pool.pricePerHour.toLocaleString()} DZD/hour
                      </p>
                    )}
                  </div>

                  {/* Location & Capacity */}
                  <div className="text-sm text-gray-600 mb-3">
                    <p>📍 {pool.address}</p>
                    <p>👥 {pool.capacity} people max</p>
                  </div>

                  {/* Owner */}
                  <div className="border-t pt-3">
                    <p className="text-sm">
                      <span className="font-bold">Owner:</span> {pool.owner?.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}