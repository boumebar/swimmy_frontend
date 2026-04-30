import io from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
    if (socket) {
        socket.disconnect();
    }

    // Utilise la variable d'environnement de Vercel ou l'URL Railway par défaut
    // En local, si VITE_SOCKET_URL n'est pas défini, il utilisera l'URL de secours
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://swimmybackend-production.up.railway.app';

    socket = io(SOCKET_URL, {
        auth: {
            userId,
        },
        // Ajout des transports pour assurer une compatibilité maximale entre Railway et Vercel
        transports: ['polling', 'websocket'],
    });

    socket.on('connect', () => {
        console.log('✅ Socket connected:', socket.id);
        // Rejoindre la salle personnelle de l'utilisateur
        socket.emit('join_user', userId);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
    });

    // Optionnel : Log les erreurs de connexion pour faciliter le débug
    socket.on('connect_error', (error) => {
        console.error('⚠️ Socket Connection Error:', error.message);
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