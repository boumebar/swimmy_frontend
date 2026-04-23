import { useEffect, useState } from 'react';
import useAuth from '../utils/useAuth';
import api from '../utils/api';

export default function MyBookingsPage() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (booking) => {
    if (booking.renterId === user?.id) {
      return 'As Renter';
    } else {
      return 'As Owner';
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
  try {
    if (newStatus === 'cancelled') {
      // Renter cancelling: use DELETE
      await api.delete(`/bookings/${bookingId}`);
    } else {
      // Owner accepting/declining: use PATCH
      await api.patch(`/bookings/${bookingId}`, { status: newStatus });
    }
    // Refresh bookings
    const res = await api.get('/bookings');
    setBookings(res.data);
  } catch (err) {
    console.error('Error updating booking:', err);
  }
};

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
            
            <a  href="/profile"
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
        <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded font-bold capitalize ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No bookings found</p>
            
            <a href="/"
              className="text-blue-600 hover:text-blue-700 font-bold"
            >
              Browse Pools
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="grid grid-cols-4 gap-4 items-center">
                  {/* Pool & Dates */}
                  <div>
                    <h3 className="font-bold text-lg mb-2">{booking.pool?.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {booking.pool?.address}
                    </p>
                    <p className="text-sm">
                      📅{' '}
                      {new Date(booking.startDate).toLocaleDateString()} →{' '}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* People Info */}
                  <div>
                    <p className="text-gray-600 text-sm">
                      {getRoleLabel(booking)}
                    </p>
                    {booking.renterId === user?.id ? (
                      <div>
                        <p className="font-bold">Owner: {booking.owner?.name}</p>
                        <p className="text-sm text-gray-600">
                          {booking.owner?.email}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold">Renter: {booking.renter?.name}</p>
                        <p className="text-sm text-gray-600">
                          {booking.renter?.email}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-gray-600 text-sm">Total Price</p>
                    <p className="text-2xl font-bold text-green-600">
                      {booking.totalPrice.toLocaleString()} DZD
                    </p>
                  </div>

                  {/* Status & Actions */}
                  <div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </div>

                    {/* Owner Actions */}
                    {booking.ownerId === user?.id &&
                      booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                    {/* Renter Actions */}
                    {booking.renterId === user?.id &&
                      booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-red-700"
                        >
                          Cancel
              </button>
            )}
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-gray-600 text-sm">Notes</p>
                    <p className="text-gray-700">{booking.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}