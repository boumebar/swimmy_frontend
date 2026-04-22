import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
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
      </Routes>
    </Router>
  );
}

export default App;
