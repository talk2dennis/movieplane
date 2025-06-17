import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IMovie } from "../types";

interface Props {
  title: string;
  movies: IMovie[];
}

const MovieSection: React.FC<Props> = ({ title, movies }) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(8);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>{title}</h2>
      </div>
      <div className="movie-grid">
        {movies.slice(0, visibleCount).map((movie, index) => (
          <div key={movie.id ?? index} className="movie-card">
            <div className="movie-poster">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            </div>
            <h3>{movie.title}</h3>
            <p className="mDescription">{movie.overview}</p>
            <p><strong>Release:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
            <p><strong>Rating:</strong> {movie.vote_average}</p>
            <button onClick={() => navigate(`/movies/${movie.id}`)}>
              View Details
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
