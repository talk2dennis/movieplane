import { useNavigate } from "react-router-dom";
import type { IMovie } from "../types";



const renderMovieSection = (title: string, movies: IMovie[]) => {
    const navigate = useNavigate();
    return (
        <div className="section">
            <div className="section-header">
                <h2>{title}</h2>
            </div>
            <div className="movie-grid">
                {movies.slice(0, 8).map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <div className="movie-poster">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                        </div>
                        <h3>{movie.title}</h3>
                        <p className='mDescription'>{movie.overview}</p>
                        <p><strong>Release:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
                        <p><strong>Rating:</strong> {movie.vote_average}</p>
                        <button onClick={() => navigate(`/movies/${movie.id}`)}>
                            View Details
                        </button>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default renderMovieSection;
