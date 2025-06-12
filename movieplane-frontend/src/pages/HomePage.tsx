import { useState, useEffect } from 'react';
import './css/HomePage.css'
import type { IMovie, MovieApiResponse } from '../types';
import { tmdbClient } from '../api/axiosClient';


const HomePage: React.FC = () => {
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                setMovies(localStorage.getItem('movies') ? JSON.parse(localStorage.getItem('movies') || '[]') : []);
                if (movies.length > 0) {
                    setLoading(false);
                    return;
                }
                const response = await tmdbClient.get<MovieApiResponse>('movie/popular');
                setMovies(response.data.results || []);
                localStorage.setItem('movies', JSON.stringify(response.data.results));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(`Failed to load movies. Please try again later.: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);


    return (
        <div className="home-page">
            <h1>Welcome to MoviePlane</h1>
            <div className="movie-grid">
                {loading && <p>Loading movies...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && movies.length === 0 && <p>No movies found.</p>}
                {!loading && !error && movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                        <h2>{movie.title}</h2>
                        <p className='mDescription'>{movie.overview}</p>
                        <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
                        <p><strong>Rating:</strong> {movie.vote_average}</p>
                    </div>
                ))}
            </div>
            <div className="footer">
                <p>&copy; {new Date().getFullYear()} MoviePlane. All rights reserved.</p>
            </div>
        </div>
    );
}
export default HomePage;