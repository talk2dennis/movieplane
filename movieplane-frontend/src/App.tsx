import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import MovieDetailPage from './pages/MovieDetailPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import AboutPage from './pages/About';
import PrivacyPage from './pages/Privacy';
import ContactPage from './pages/Contact';

interface PrivateRouteProps {
    children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path='/movies/:movieId' element={<MovieDetailPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/About" element={<AboutPage />}/>
                <Route path="/contact" element={<ContactPage />} />

                {/* Protected Routes */}
                <Route path="/profile" element={
                    <PrivateRoute>
                        <UserProfilePage />
                    </PrivateRoute>
                } />
                <Route path="/movie/:movieId" element={
                    <PrivateRoute>
                        <MovieDetailPage />
                    </PrivateRoute>
                } />
                <Route path="/favorites" element={
                    <PrivateRoute>
                        <Favorites />
                    </PrivateRoute>
                } />

                <Route path="/watchlist" element={
                    <PrivateRoute>
                        <Watchlist />
                    </PrivateRoute>
                } />
                

                {/* Redirect unknown paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
        </Router>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default App;
