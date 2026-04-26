import { create } from 'zustand';
import { initSocket, disconnectSocket } from './socket';

const useAuth = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  // Set user after login/signup
  setAuth: (token, user) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });

    // Initialize socket connection
    initSocket(user.id);
  },

  // Load user from localStorage on app start
  loadAuth: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      set({ user, token, isAuthenticated: true });

      // Initialize socket connection
      initSocket(user.id);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });

    // Disconnect socket
    disconnectSocket();
  },
}));

export default useAuth;