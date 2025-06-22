// MovieDetailPage.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IMovie } from "../types";
import MovieSection from "../components/RenderMovie";
import Loading from "../components/Loading";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../contexts/AuthContext";
import "./css/MovieDetailPage.css";


const MovieDetailPage: React.FC = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [recommendedMovies, setRecommendedMovies] = useState<IMovie[]>([]);
    const [similarMovies, setSimilarMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isAuthenticated, user, setUser } = useAuth();

    // function to check if movie is in favorites or watchlist
    const isInFavorites = (movieId: number) => {
        return user?.favorites_movies?.some(fav => fav.tmdb_id === movieId);
    };

    const isInWatchlist = (movieId: number) => {
        return user?.watchlist_movies?.some(watch => watch.tmdb_id === movieId);
    };

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                // check if user is authenticated
                if (!isAuthenticated && !user) {
                    // // display message to user and redirect to homepage
                    alert("You need to be logged in to view movie details.");
                    window.location.href = "/";
                    return;
                }
                setLoading(true);
                const res = await axiosClient.get<IMovie>(`movies/${movieId}`);
                const recommendedRes = await axiosClient.get<IMovie[]>(`movies/${movieId}/recommendations`);
                const similarRes = await axiosClient.get<IMovie[]>(`movies/${movieId}/similar`);
                setSimilarMovies(similarRes.data || []);
                setMovie(res.data);
                setRecommendedMovies(recommendedRes.data || []);
            } catch (err) {
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [movieId]);

    // to add favorites
    const handleAddFavorite = async (movie: IMovie) => {
        setLoading(true);
        try {
            const res = await axiosClient.post<{ message: string }>('users/favorites/toggle', { movieId });
            // Update user state to reflect the change
            if (res.data.message.includes("added")) {
                // If movie was added to favorites, add it to user's favorites
                setUser(prevUser => {
                    if (!prevUser) return prevUser;

                    return {
                        ...prevUser,
                        favorites_movies: [
                            ...prevUser.favorites_movies,
                            movie
                        ]
                    };
                });
            } else {
                // If movie was removed from favorites, filter it out
                setUser(prevUser => {
                    if (!prevUser) return prevUser;
                    return {
                        ...prevUser,
                        favorites_movies: prevUser.favorites_movies.filter(fav => fav.tmdb_id !== movie.tmdb_id)
                    };
                });
            }
            alert(res.data.message);
        } catch (error) {
            alert("Failed to add or remove movie to favorites");
        } finally {
            setLoading(false);
        }
    }

    // to add watchlist
    const handleAddWatchlist = async (movie: IMovie) => {
        try {
            setLoading(true);
            const res = await axiosClient.post<{ message: string }>('users/watchlist/toggle', { movieId: movie.tmdb_id });
            // Update user state to reflect the change
            if (res.data.message.includes("added")) {
                // If movie was added to favorites, add it to user's favorites
                setUser(prevUser => {
                    if (!prevUser) return prevUser;

                    return {
                        ...prevUser,
                        watchlist_movies: [
                            ...prevUser.watchlist_movies,
                            movie
                        ]
                    };
                });
            } else {
                // If movie was removed from favorites, filter it out
                setUser(prevUser => {
                    if (!prevUser) return prevUser;
                    return {
                        ...prevUser,
                        favorites_movies: prevUser.favorites_movies.filter(fav => fav.tmdb_id !== movie.tmdb_id)
                    };
                });
            }
            alert(res.data.message);

        } catch (error: any) {
            alert(`Failed to add or remove movie to watchlist: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }
    if (loading) return <Loading />;
    if (error) return <div className="error">{error}</div>;
    if (!movie) return <div className="error">Movie not found.</div>;

    return (
        <div className="movie-detail-container">
            {/* {loading && <div className="loading">{<Loading />}</div>} */}
            <div
                className="movie-detail-page"
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
            >
                <div className="overlay" />
                <div className="movie-detail-content">
                    <img
                        className="poster"
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <div className="details">
                        <h1>{movie.title}</h1>
                        <p className="overview">{movie.overview}</p>
                        <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
                        <p><strong>Rating:</strong> {movie.vote_average}</p>

                        <div className="actions">
                            <button
                                className={isInFavorites(movie.tmdb_id) ? "fav-btn" : "watch-btn"}
                                onClick={() => handleAddFavorite(movie)}
                            >
                                {isInFavorites(movie.tmdb_id) ? "Remove from Favorites" : "Add to Favorites"}
                            </button>
                            <button
                                className={isInWatchlist(movie.tmdb_id) ? "fav-btn" : "watch-btn"}
                                onClick={() => handleAddWatchlist(movie)}
                            >
                                {isInWatchlist(movie.tmdb_id) ? "Remove from Watchlist" : "Add to Watchlist"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {similarMovies.length > 0 && (
                <div className="recommended-section">
                    <MovieSection title="Similar Movies" movies={similarMovies} />
                </div>
            )}

            {recommendedMovies.length > 0 && (
                <div className="recommended-section">
                    <MovieSection title="Recommended Movies" movies={recommendedMovies} />
                </div>
            )}
        </div>
    );
};

export default MovieDetailPage;
