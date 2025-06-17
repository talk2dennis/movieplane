import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css'
import type { IMovie } from '../types';
import axiosClient from '../api/axiosClient';
import Loading from '../components/Loading';
import renderMovieSection from '../components/RenderMovie';


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
            try {
                const [popularRes, trendingRes] = await Promise.all([
                    axiosClient.get<IMovie[]>('movies/popular'),
                    axiosClient.get<IMovie[]>('movies/trending')
                ]);

                setMovies(popularRes.data || []);
                setTrendingMovies(trendingRes.data || []);
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

            {!loading && !error && renderMovieSection('Popular Movies', movies)}
            {!loading && !error && renderMovieSection('Trending Movies', trendingMovies)}

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