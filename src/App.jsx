import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import BrowsePoolsPage from './pages/BrowsePoolsPage';
import CreatePoolPage from './pages/CreatePoolPage';
import PoolDetailPage from './pages/PoolDetailPage';

import PrivateRoute from './components/PrivateRoute';

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
          path="/pools/:id"
          element={
            <PrivateRoute>
              <PoolDetailPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
