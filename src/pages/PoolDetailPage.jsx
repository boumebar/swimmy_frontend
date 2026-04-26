import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../utils/useAuth';
import api from '../utils/api';
import Chat from '../components/Chat';

export default function PoolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchPool = async () => {
      try {
        const res = await api.get(`/pools/${id}`);
        setPool(res.data);
      } catch (err) {
        console.error('Error fetching pool:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPool();
  }, [id]);

  const nextPhoto = () => {
    if (pool && pool.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % pool.photos.length);
    }
  };

  const prevPhoto = () => {
    if (pool && pool.photos.length > 0) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? pool.photos.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading pool details...
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Pool not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Pools
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === pool.ownerId;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🏊 SWIMMY</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}!</span>

            <a href="/"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Browse Pools
            </a>

            <a href="/profile"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Profile
            </a>
            <a href="/inbox"
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Inbox
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

      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:text-blue-700 font-bold"
        >
          ← Back to Pools
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Photo Carousel */}
          <div className="relative h-96 bg-gradient-to-r from-blue-400 to-blue-600">
            {pool.photos && pool.photos.length > 0 ? (
              <>
                <img
                  src={pool.photos[currentPhotoIndex]}
                  alt={pool.title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {pool.photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                      →
                    </button>

                    {/* Photo Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded">
                      {currentPhotoIndex + 1} / {pool.photos.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                🏊
              </div>
            )}
          </div>

          {/* Pool Details */}
          <div className="p-8">
            {/* Title & Owner */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{pool.title}</h1>
              <div className="flex items-center gap-3">
                {pool.owner?.avatar && (
                  <img
                    src={pool.owner.avatar}
                    alt={pool.owner.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-gray-600">Owner</p>
                  <p className="font-bold">{pool.owner?.name}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">About</h2>
              <p className="text-gray-700 leading-relaxed">{pool.description}</p>
            </div>

            {/* Location */}
            <div className="mb-6 p-4 bg-gray-100 rounded">
              <h2 className="text-xl font-bold mb-2">📍 Location</h2>
              <p className="text-gray-700">{pool.address}</p>
              {pool.latitude !== 0 && pool.longitude !== 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  {pool.latitude}, {pool.longitude}
                </p>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-100 rounded">
                <p className="text-gray-600 text-sm">Capacity</p>
                <p className="text-2xl font-bold text-blue-600">
                  {pool.capacity}
                </p>
                <p className="text-xs text-gray-500">people max</p>
              </div>

              <div className="p-4 bg-green-100 rounded">
                <p className="text-gray-600 text-sm">Price per Day</p>
                <p className="text-2xl font-bold text-green-600">
                  {pool.pricePerDay.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">DZD</p>
              </div>

              <div className="p-4 bg-purple-100 rounded">
                <p className="text-gray-600 text-sm">Price per Hour</p>
                <p className="text-2xl font-bold text-purple-600">
                  {pool.pricePerHour.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">DZD</p>
              </div>
            </div>

            {/* Week Price */}
            {pool.pricePerWeek && (
              <div className="p-4 bg-yellow-100 rounded mb-6">
                <p className="text-gray-600 text-sm">Price per Week</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pool.pricePerWeek.toLocaleString()} DZD
                </p>
              </div>
            )}

            {isOwner && (
              <div className="flex gap-4 mt-8 pt-8 border-t">
                <button
                  onClick={() => navigate(`/edit-pool/${pool.id}`)}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700"
                >
                  Edit Pool
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this pool?')) {
                      try {
                        await api.delete(`/pools/${pool.id}`);
                        navigate('/');
                      } catch (err) {
                        console.error('Error deleting pool:', err);
                      }
                    }
                  }}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700"
                >
                  Delete Pool
                </button>
              </div>
            )}

            {/* Renter Actions */}
            {!isOwner && (
              <div className="mt-8 pt-8 border-t">
                <button
                  onClick={() => navigate(`/booking/${pool.id}`)}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700 text-lg"
                >
                  Book This Pool
                </button>
                <button
                  onClick={() => setShowChat(true)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 text-lg"
                >
                  💬 Chat with Owner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Chat Modal */}
      {showChat && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '16px',
            zIndex: 50,
          }}
          onClick={() => setShowChat(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '600px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Chat
              partnerId={pool.ownerId}
              partnerName={pool.owner?.name}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}