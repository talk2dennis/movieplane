import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import type { IMovie } from "../types";
import MovieSection from "../components/RenderMovie";

const Watchlist = () => {
  const { user, isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState<IMovie[]>([]);

  useEffect(() => {
    if (isAuthenticated && user?.watchlist_movies) {
      setWatchlist(user.watchlist_movies);
    }
  }, [user, isAuthenticated]);

  return (
    <div className="watchlist-page">
      {isAuthenticated && watchlist.length > 0 ? <MovieSection movies={watchlist} title="Your Watchlist" /> : (<div className="no-watchlist">
        <h2>No watchlist Found</h2>
        <p>It seems you haven't added any movies to your watchlist yet.</p>
        <p>Browse the <a href="/">home page</a> to find movies you like!</p>
    </div>)}
    </div>
  );
}

export default Watchlist;