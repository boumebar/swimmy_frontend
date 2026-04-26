import { useEffect, useState, useRef } from 'react';
import useAuth from '../utils/useAuth';
import api from '../utils/api';
import { getSocket } from '../utils/socket';

export default function Chat({ partnerId, partnerName, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socket = getSocket();

  // Fetch conversation history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${partnerId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [partnerId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for new messages via Socket.io
  useEffect(() => {
    if (socket) {
      socket.on(`message_from_${partnerId}`, (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off(`message_from_${partnerId}`);
      };
    }
  }, [socket, partnerId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      // Send via API
      const res = await api.post(`/messages/${partnerId}`, {
        text: newMessage,
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');

      // Emit via Socket.io for real-time delivery
      if (socket) {
        socket.emit('send_message', {
          receiverId: partnerId,
          senderId: user?.id,
          text: newMessage,
        });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        Loading messages...
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          backgroundColor: '#2563eb',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
          💬 {partnerName}
        </h3>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '32px' }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.senderId === user?.id ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor:
                    msg.senderId === user?.id ? '#3b82f6' : '#e5e7eb',
                  color: msg.senderId === user?.id ? 'white' : '#1f2937',
                  wordWrap: 'break-word',
                }}
              >
                <p style={{ margin: 0, fontSize: '14px' }}>{msg.text}</p>
                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '12px',
                    opacity: 0.7,
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}