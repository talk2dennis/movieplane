import { useAuth } from '../contexts/AuthContext';
import './css/UserProfilePage.css';
import axiosClient from '../api/axiosClient';
import MovieSection from '../components/RenderMovie';
import ProfilePicture from '../components/ProfilePicture';


export default function UserProfilePage() {

    const { user, logout, isAuthenticated, token } = useAuth();


    const handleDeleteAccount = async () => {
        // if user confirms, send delete request
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            // Call API to delete account
            try {
                const res = await axiosClient.delete('/users/delete');
                if (res.status === 200) {
                    alert("Account deleted successfully.");
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error("Failed to delete account:", error);
                alert("Failed to delete account. Please try again later.");
            }
        }

    };

    const handleEditProfile = () => {
        // Redirect to edit profile page
        window.location.href = '/edit-profile';
    };

    if (!user || !isAuthenticated) {
        logout(); // Clear token and user data
        localStorage.removeItem("token");
        alert("You need to be logged in to view your profile.");
        window.location.href = '/login';
        return;
    } else localStorage.setItem("token", token || "");
    return (
        <div className="profile-container">
            {/* Profile Info Section */}
            <section className="section profile-info" id="profile-info">
                <div className="profile-picture">
                    <ProfilePicture imageUrl={user.profilePicture ?? null} username={user.username} />
                </div>
                <h1>{user.username}</h1>
                <p>Email: {user.email}</p>
                <p>Joined: {new Date(user.createdAt).toUTCString()}</p>
            </section>

            {/* Favorites Movies Section */}
            <section className="section favorites" id="favorites">
                {user.favorites_movies && user.favorites_movies.length > 0 ? (
                    <MovieSection
                        title="Favorite Movies"
                        movies={user.favorites_movies}
                    />
                ) : (
                    <div className="no-favorites">
                        <h2>No Favorites Found</h2>
                        <p>It seems you haven't added any movies to your favorites yet.</p>
                        <p>Browse the <a href="/">home page</a> to find movies you like!</p>
                    </div>
                )}
            </section>
            {/* Watchlist Movies Section */}
            <section className="section watchlist" id="watchlist">
                {user.watchlist_movies && user.watchlist_movies.length > 0 ? (
                    <MovieSection
                        title="Watchlist Movies"
                        movies={user.watchlist_movies}
                    />
                ) : (
                    <div className="no-watchlist">
                        <h2>No Watchlist Found</h2>
                        <p>It seems you haven't added any movies to your watchlist yet.</p>
                        <p>Browse the <a href="/">home page</a> to find movies you like!</p>
                    </div>
                )}
            </section>

            {/* Account Section */}
            <section className="section account" id="account">
                <h2>Account Settings</h2>
                <p>Manage your account settings and preferences.</p>
                <button className="edit-profile-btn" onClick={handleEditProfile}>
                    Edit Profile
                </button>
                <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
            </section>
        </div>
    );
}
