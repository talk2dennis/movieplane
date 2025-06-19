// src/pages/UserProfilePage.tsx

import { useAuth } from '../contexts/AuthContext';
import './css/UserProfilePage.css';
import axiosClient from '../api/axiosClient';
import Loading from '../components/Loading';
import MovieSection from '../components/RenderMovie';


export default function UserProfilePage() {

    const { user, loading } = useAuth();


    const handleDeleteAccount = async () => {
        // if user confirms, send delete request
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            // Call API to delete account
            try {
                const res = await axiosClient.delete('/users/delete');
                if (res.status === 200) {
                    alert("Account deleted successfully.");
                    window.location.href = '/login'; // Redirect to login page
                }
            } catch (error) {
                console.error("Failed to delete account:", error);
                alert("Failed to delete account. Please try again later.");
            }
        }

    };

    if (loading) {
        return <Loading />;
    }
    if (!user) {
        window.location.href = '/login';
        return;
    }
    return (
        <div className="profile-container">
            {/* Profile Info Section */}
            <section className="section profile-info" id="profile-info">
                <img src="http://" alt="Avatar" className="avatar" />
                <h1>{user.username}</h1>
                <p>Email: {user.email}</p>
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </section>

            {/* Favorites Movies Section */}
            {user.favorites_movies && user.favorites_movies.length > 0 && (
                <MovieSection
                    title="Favorite Movies"
                    movies={user.favorites_movies}
                />
            )}
            {/* Watchlist Movies Section */}
            {user.watchlist_movies && user.watchlist_movies.length > 0 && (
                <MovieSection
                    title="Watchlist Movies"
                    movies={user.watchlist_movies}
                />
            )}

            {/* Account Section */}
            <section className="section account" id="account">
                <h2>Account Settings</h2>
                <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
            </section>
        </div>
    );
}
