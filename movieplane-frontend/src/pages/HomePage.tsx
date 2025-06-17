import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css'
import type { IMovie } from '../types';
import axiosClient from '../api/axiosClient';
import Loading from '../components/Loading';
import MovieSection from '../components/RenderMovie';


const HomePage: React.FC = () => {
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<IMovie[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            const storedMovies = localStorage.getItem('movies');
            if (storedMovies) {
                const parsedMovies = JSON.parse(storedMovies) as IMovie[];
                setMovies(parsedMovies);
                setLoading(false);
                return;
            }
            const storedTrendingMovies = localStorage.getItem('trendingMovies');
            console.log(`Stored trending movies: ${storedTrendingMovies}`);
            if (storedTrendingMovies) {
                const parsedTrendingMovies = JSON.parse(storedTrendingMovies) as IMovie[];
                setTrendingMovies(parsedTrendingMovies);
                setLoading(false);
                return;
            }
            try {
                const [popularRes, trendingRes] = await Promise.all([
                    axiosClient.get<IMovie[]>('movies/popular'),
                    axiosClient.get<IMovie[]>('movies/trending')
                ]);

                setMovies(popularRes.data || []);
                localStorage.setItem('movies', JSON.stringify(popularRes.data || []));
                setTrendingMovies(trendingRes.data || []);
                localStorage.setItem('trendingMovies', JSON.stringify(trendingRes.data || []));
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
                    <p>Explore, discover, and enjoy the best of cinema.</p>
                    <p>Create an account to add movies to your watchlist and favorites.</p>
                    <button
                        className="cta-button"
                        onClick={() => navigate('/signup')}
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {loading && <Loading />}
            {error && <p className="error">{error}</p>}


            {!loading && !error && <MovieSection title="Popular Movies" movies={movies} />}
            {!loading && !error && <MovieSection title="Trending Movies" movies={trendingMovies} />}

            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} MoviePlane. All rights reserved.</p>
                    <p><a href="/about">About</a> | <a href="/contact">Contact</a> | <a href="/privacy">Privacy</a></p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;