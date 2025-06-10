// src/pages/UserProfilePage.tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './css/UserProfilePage.css';

const genre = [
    'Action',
    'Drama',
    'Comedy',
    'Sci-Fi',
    'Horror',
    'Romance',
]

const dummyRecommended = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Recommended Movie ${i + 1}`,
    poster: `https://placehold.co/150x220?text=R${i + 1}`,
}));

const dummySaved = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Saved Movie ${i + 1}`,
    poster: `https://placehold.co/150x220?text=S${i + 1}`,
}));

export default function UserProfilePage() {
    const [genres, setGenres] = useState<string[]>(genre);
    const [recommended, setRecommended] = useState(dummyRecommended);

    const { user, loading } = useAuth();

    const handleGenreToggle = (genre: string) => {
        setGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleLoadMore = () => {
        const more = Array.from({ length: 5 }, (_, i) => ({
            id: recommended.length + i + 1,
            title: `Recommended Movie ${recommended.length + i + 1}`,
            poster: `https://placehold.co/150x220?text=R${recommended.length + i + 1}`,
        }));
        setRecommended([...recommended, ...more]);
    };

    const handleDeleteAccount = () => {
        alert('Are you sure you want to delete your account?');
    };

    if (loading) {
        return <div className='loading'>Loading profile...</div>;
    }
    if (!user) {
        window.location.href = '/login';
        return null;
    }
    return (
        <div className="profile-container">
            {/* Profile Info Section */}
            <section className="section profile-info" id="profile-info">
                <img src="http://" alt="Avatar" className="avatar" />
                <h1>{user.username}</h1>
                <p>Email: {user.email}</p>
                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

                <h2>Preferred Genres</h2>
                <div className="genres">
                    {['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Romance'].map((genre) => (
                        <button
                            key={genre}
                            className={`genre-btn ${genres.includes(genre) ? 'selected' : ''}`}
                            onClick={() => handleGenreToggle(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </section>

            {/* Recommended Movies Section */}
            <section className="section recommended" id="recommended">
                <h2>Recommended Movies</h2>
                <div className="movie-grid">
                    {recommended.map(movie => (
                        <img key={movie.id} src={movie.poster} alt={movie.title} />
                    ))}
                </div>
                <button className="more-btn" onClick={handleLoadMore}>Load More</button>
            </section>

            {/* Saved Movies + Actions Section */}
            <section className="section saved" id="saved">
                <h2>Saved / Liked Movies</h2>
                <div className="movie-grid">
                    {dummySaved.map(movie => (
                        <img key={movie.id} src={movie.poster} alt={movie.title} />
                    ))}
                </div>

                <div className="actions">
                    <button className="edit-btn">Edit Profile</button>
                    <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </section>
        </div>
    );
}
