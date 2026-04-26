import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import BrowsePoolsPage from './pages/BrowsePoolsPage';
import CreatePoolPage from './pages/CreatePoolPage';
import EditPoolPage from './pages/EditPoolPage';
import PoolDetailPage from './pages/PoolDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingPage from './pages/BookingPage';
import InboxPage from './pages/InboxPage';

import PrivateRoute from './components/PrivateRoute';
import OwnerDashboard from './pages/OwnerDashboard';
import RenterDashboard from './pages/RenterDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <BrowsePoolsPage />
            </PrivateRoute>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-pool"
          element={
            <PrivateRoute>
              <CreatePoolPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-pool/:id"
          element={
            <PrivateRoute>
              <EditPoolPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/pools/:id"
          element={
            <PrivateRoute>
              <PoolDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking/:id"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <PrivateRoute>
              <InboxPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <PrivateRoute>
              <OwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/renter-dashboard"
          element={
            <PrivateRoute>
              <RenterDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
