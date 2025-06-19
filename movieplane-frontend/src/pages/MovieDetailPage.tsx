// MovieDetailPage.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IMovie } from "../types";
import MovieSection from "../components/RenderMovie";
import Loading from "../components/Loading";
import axiosClient from "../api/axiosClient";
import "./css/MovieDetailPage.css";


const MovieDetailPage: React.FC = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [recommendedMovies, setRecommendedMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get<IMovie>(`movies/${movieId}`);
                const recommendedRes = await axiosClient.get<IMovie[]>(`movies/${movieId}/recommendations`);
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

    if (loading) return <Loading />;
    if (error) return <div className="error">{error}</div>;
    if (!movie) return <div className="error">Movie not found.</div>;

    return (
        <div className="movie-detail-container">
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
                            <button className="fav-btn">Add to Favorites</button>
                            <button className="watch-btn">Add to Watchlist</button>
                        </div>
                    </div>
                </div>
            </div>

            {recommendedMovies.length > 0 && (
                <div className="recommended-section">
                    <MovieSection title="Recommended Movies" movies={recommendedMovies} />
                </div>
            )}
        </div>
    );
};

export default MovieDetailPage;
