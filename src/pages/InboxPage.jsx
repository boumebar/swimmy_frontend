import { useEffect, useState } from 'react';
import useAuth from '../utils/useAuth';
import api from '../utils/api';
import Chat from '../components/Chat';
import { getSocket } from '../utils/socket';

export default function InboxPage() {
    const { user, logout } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const socket = getSocket();

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await api.get('/messages/inbox');
                setConversations(res.data);
            } catch (err) {
                console.error('Error fetching conversations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    // Listen for new messages and refresh conversations
    useEffect(() => {
        if (socket) {
            socket.on('new_message_received', () => {
                console.log('📨 New message received, refreshing conversations');
                // Refetch conversations to update unread count
                const fetchConversations = async () => {
                    try {
                        const res = await api.get('/messages/inbox');
                        setConversations(res.data);
                    } catch (err) {
                        console.error('Error fetching conversations:', err);
                    }
                };
                fetchConversations();
            });

            return () => {
                socket.off('new_message_received');
            };
        }
    }, [socket]);

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

                        <a href="/my-bookings"
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                        >
                            My Bookings
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
                <h2 className="text-3xl font-bold mb-6">💬 Messages</h2>

                <div className="grid grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="col-span-1 bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <h3 className="font-bold text-lg">Conversations</h3>
                        </div>

                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                Loading...
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No conversations yet
                            </div>
                        ) : (
                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.partnerId}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`w-full text-left p-4 hover:bg-gray-100 transition ${selectedConversation?.partnerId === conv.partnerId
                                            ? 'bg-blue-100'
                                            : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {conv.partner?.avatar && (
                                                <img
                                                    src={conv.partner.avatar}
                                                    alt={conv.partner.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm">
                                                    {conv.partner?.name}
                                                </p>
                                                <p className="text-xs text-gray-600 truncate">
                                                    {conv.lastMessage}
                                                </p>
                                                {conv.unreadCount > 0 && (
                                                    <span className="inline-block mt-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                        {conv.unreadCount} new
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Chat Window */}
                    <div className="col-span-2">
                        {selectedConversation ? (
                            <Chat
                                partnerId={selectedConversation.partnerId}
                                partnerName={selectedConversation.partner?.name}
                                onClose={() => setSelectedConversation(null)}
                            />
                        ) : (
                            <div className="bg-white rounded-lg shadow p-12 text-center">
                                <p className="text-gray-500 text-lg">
                                    Select a conversation to start messaging
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}