import { useEffect, useState } from 'react';
import useAuth from '../utils/useAuth';
import api from '../utils/api';
import BookingRequestCard from '../components/BookingRequestCard';
import BookingStatusCard from '../components/BookingStatusCard';

export default function OwnerDashboard() {
    const { user, logout } = useAuth();
    const [pools, setPools] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pools');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user's pools
                const poolsRes = await api.get('/pools');
                const userPools = poolsRes.data.filter(p => p.ownerId === user?.id);
                setPools(userPools);

                // Get bookings for user's pools
                const bookingsRes = await api.get('/bookings');
                const ownerBookings = bookingsRes.data.filter(b => b.ownerId === user?.id);
                setBookings(ownerBookings);

                // Get conversations
                const messagesRes = await api.get('/messages/inbox');
                setMessages(messagesRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

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
                </div >
            </nav >

            <div className="max-w-6xl mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6">Owner Dashboard</h2>

                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : (
                    <div>
                        {/* Tabs */}
                        <div className="flex gap-4 mb-6 border-b">
                            <button
                                onClick={() => setActiveTab('pools')}
                                className={`px-6 py-3 font-bold ${activeTab === 'pools'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                                    }`}
                            >
                                My Pools ({pools.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`px-6 py-3 font-bold ${activeTab === 'bookings'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                                    }`}
                            >
                                Booking Requests ({bookings.filter(b => b.status === 'pending').length})
                            </button>
                            <button
                                onClick={() => setActiveTab('messages')}
                                className={`px-6 py-3 font-bold ${activeTab === 'messages'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-600'
                                    }`}
                            >
                                Messages ({messages.filter(m => m.unreadCount > 0).length})
                            </button>
                        </div>

                        {/* Pools Tab */}
                        {activeTab === 'pools' && (
                            <div className="space-y-4">
                                {pools.length === 0 ? (
                                    <p className="text-gray-500">No pools yet</p>
                                ) : (
                                    pools.map((pool) => (
                                        <div key={pool.id} className="bg-white rounded-lg shadow p-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold">{pool.title}</h3>
                                                    <p className="text-gray-600">{pool.address}</p>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Capacity: {pool.capacity} | Price/Day: {pool.pricePerDay.toLocaleString()} DZD
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => window.location.href = `/edit-pool/${pool.id}`}
                                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => window.location.href = `/pools/${pool.id}`}
                                                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Bookings Tab */}
                        {activeTab === 'bookings' && (
                            <div>
                                {/* Pending Requests */}
                                {bookings.filter(b => b.status === 'pending').length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold mb-4 text-yellow-600">
                                            ⏳ Pending Requests ({bookings.filter(b => b.status === 'pending').length})
                                        </h3>
                                        <div className="space-y-4">
                                            {bookings
                                                .filter(b => b.status === 'pending')
                                                .map((booking) => (
                                                    <BookingRequestCard
                                                        key={booking.id}
                                                        booking={booking}
                                                        onUpdate={() => {
                                                            // Refetch bookings
                                                            const refetch = async () => {
                                                                try {
                                                                    const res = await api.get('/bookings');
                                                                    const ownerBookings = res.data.filter(b => b.ownerId === user?.id);
                                                                    setBookings(ownerBookings);
                                                                } catch (err) {
                                                                    console.error('Error refetching bookings:', err);
                                                                }
                                                            };
                                                            refetch();
                                                        }}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Confirmed & Cancelled */}
                                {bookings.filter(b => b.status !== 'pending').length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold mb-4">
                                            📋 All Bookings ({bookings.filter(b => b.status !== 'pending').length})
                                        </h3>
                                        <div className="space-y-4">
                                            {bookings
                                                .filter(b => b.status !== 'pending')
                                                .map((booking) => (
                                                    <BookingStatusCard
                                                        key={booking.id}
                                                        booking={booking}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {bookings.length === 0 && (
                                    <p className="text-gray-500">No bookings yet</p>
                                )}
                            </div>
                        )}

                        {/* Messages Tab */}
                        {activeTab === 'messages' && (
                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <p className="text-gray-500">No messages yet</p>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.partnerId}
                                            onClick={() => window.location.href = '/inbox'}
                                            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold">{msg.partner?.name}</h3>
                                                    <p className="text-gray-600 truncate">{msg.lastMessage}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {new Date(msg.lastMessageTime).toLocaleString()}
                                                    </p>
                                                </div>
                                                {msg.unreadCount > 0 && (
                                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                                                        {msg.unreadCount} new
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
}