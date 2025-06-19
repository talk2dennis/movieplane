import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import type { IMovie } from "../types";
import MovieSection from "../components/RenderMovie";

const Favorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<IMovie[]>([]);

  useEffect(() => {
    if (isAuthenticated && user?.favorites_movies) {
      setFavorites(user.favorites_movies);
    }
  }, [user, isAuthenticated]);

  return (
    <div className="favorites-page">
      {isAuthenticated && favorites.length > 0 ? <MovieSection movies={favorites} title="Your Favorites" /> : (<div className="no-favorites">
        <h2>No Favorites Found</h2>
        <p>It seems you haven't added any movies to your favorites yet.</p>
        <p>Browse the <a href="/">home page</a> to find movies you like!</p>
    </div>)}
    </div>
  );
}

export default Favorites;