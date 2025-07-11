export interface IUser {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    token?: string;
    isAdmin?: boolean;
    isAuthenticated?: boolean;
    profilePicture?: string;
    favorites_movies: IMovie[];
    watchlist_movies: IMovie[];
    followers?: string[];
    following?: string[];
}

// interface IMovie 
export interface IMovie {
    _id: string;
    tmdb_id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: string[];
    director: string;
    cast: string[];
    poster_path: string;
    trailerUrl?: string;
    video: boolean;
}

export interface MovieApiResponse {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
