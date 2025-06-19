import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IMovie } from "../types";
import "./css/RenderMovies.css";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  title: string;
  movies: IMovie[];
  detail?: boolean;
}

const MovieSection: React.FC<Props> = ({ title, movies, detail=false }) => {
  const paginationLimit = 4;
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(paginationLimit);
  const { isAuthenticated } = useAuth();

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + paginationLimit);
  };

  const handleShowDetails = (movieId: number) => {
    if (isAuthenticated) {
      navigate(`/movies/${movieId}`);
    } else {
      if (window.confirm("Please log in to view movie details. Do you want to go to the login page?")) {
        navigate("/login");
      }
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>{title}</h2>
      </div>
      <div className="movie-grid">
        {movies.slice(0, visibleCount).map((movie) => (
          <div key={movie._id} className="movie-card">
            <div className="movie-poster">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            </div>
            {detail && (
              <>
                <h3>{movie.title}</h3>
                <p className="mDescription">{movie.overview}</p>
                <p><strong>Release:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
                <p><strong>Rating:</strong> {movie.vote_average}</p>
              </>
            )}
            <button onClick={() => handleShowDetails(movie.tmdb_id)}>
              {movie.tmdb_id}
            </button>
          </div>
        ))}
      </div>

      {/* Show More button */}
      {visibleCount < movies.length && (
        <div className="show-more-container">
          <button className="show-more-button" onClick={handleShowMore}>
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieSection;
