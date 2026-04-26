import io from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
    if (socket) {
        socket.disconnect();
    }

    socket = io('http://localhost:3001', {
        auth: {
            userId,
        },
    });

    socket.on('connect', () => {
        console.log('✅ Socket connected:', socket.id);
        // Join user's personal room
        socket.emit('join_user', userId);
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
    });

    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.emit('leave_user');
        socket.disconnect();
        socket = null;
    }
};

export const onNewMessage = (callback) => {
    if (socket) {
        socket.on('new_message', callback);
    }
};

export const sendMessageSocket = (receiverId, message) => {
    if (socket) {
        socket.emit('send_message', {
            receiverId,
            text: message,
        });
    }
};