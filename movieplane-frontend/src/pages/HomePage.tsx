import { useState, useEffect } from 'react';
import './css/HomePage.css'
import type { IMovie } from '../types';
import axiosClient from '../api/axiosClient';
import Loading from '../components/Loading';


const HomePage: React.FC = () => {
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<IMovie[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            console.log('Fetching movies...');

            try {


                const response = await axiosClient.get<IMovie[]>('movies/popular');

                console.log('Fetched movies:', response.data);
                setMovies(response.data || []);
                localStorage.setItem('movies', JSON.stringify(response.data));
                // Fetch trending movies
                const trendingResponse = await axiosClient.get<IMovie[]>('movies/trending');
                console.log('Fetched trending movies:', trendingResponse.data);
                setTrendingMovies(trendingResponse.data || []);
                localStorage.setItem('trendingMovies', JSON.stringify(trendingResponse.data));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(`Failed to load movies. Please try again later: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);



    return (
        <div className="home-page">
            <div className="hero">
                <div className="hero-content">
                    <h1>Welcome to MoviePlane</h1>
                    <p>Your one-stop destination for all things movies!</p>
                    <p>Explore the latest and greatest films from around the world.</p>
                    <p>Discover, watch, and enjoy your favorite movies with us.</p>
                    <p>Join our community of movie lovers today!</p>
                </div>
            </div>

            {/* Popular Movies */}
            <h2>Popular Movies</h2>
            <div className="movie-grid">
                {loading && <Loading />}
                {error && <p className="error">{error}</p>}
                {!loading && !error && movies.length === 0 && <p>No movies found.</p>}
                {!loading && !error && movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <div className="movie-poster">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                        </div>
                        <h2>{movie.title}</h2>
                        <p className='mDescription'>{movie.overview}</p>
                        <p><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
                        <p><strong>Rating:</strong> {movie.vote_average}</p>
                    </div>
                ))}
            </div>
            {/* trending movies */}
            <h2>Trending Movies</h2>
            <div className="movie-grid">


                {loading && <Loading />}
                {error && <p className="error">{error}</p>}
                {!loading && !error && trendingMovies.length === 0 && <p>No movies found.</p>}
                {!loading && !error && trendingMovies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <div className="movie-poster">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                        </div>
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