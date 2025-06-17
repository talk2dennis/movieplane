import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import Movie, { IMovie } from '../models/movie.model';
import User from '../models/user.model';
import { MOVIE_API_KEY, MOVIE_API_URL } from '../config/env.check';


interface CachedMovieList {
    movies: IMovie[];
    timestamp: number;
}
let cachedPopularMovies: CachedMovieList | null = null;
let cachedTrendingMovies: CachedMovieList | null = null;
const CACHE_DURATION_MS = 1000 * 60 * 60 * 24;

// helper function to fetch movies from the API
const fetchAndCacheMovieData = async (tmdbId: number): Promise<IMovie | null> => {
    try {
        // Check if the movie is already cached
        let movie = await Movie.findOne({ tmdb_id: tmdbId });
        if (!movie) {
            const response = await axios.get(`${MOVIE_API_URL}/movie/${tmdbId}?api_key=${MOVIE_API_KEY}`);
            const tmdbMovieData = response.data as IMovie;
            // Create a new movie instance and save it to the database
            movie = new Movie({
                tmdb_id: tmdbMovieData.id,
                title: tmdbMovieData.title,
                overview: tmdbMovieData.overview,
                release_date: tmdbMovieData.release_date,
                vote_average: tmdbMovieData.vote_average,
                poster_path: tmdbMovieData.poster_path,
                backdrop_path: tmdbMovieData.backdrop_path,
                genre_ids: tmdbMovieData.genre_ids,
                popularity: tmdbMovieData.popularity
            });
            await movie.save();
        }
        return movie;
    } catch (error) {
        console.error(`Error fetching/caching movie ${tmdbId} from TMDb:`, error);
        return null;
    }
};

// Function to fetch and cache a list of movies (e.g., popular, trending)
const fetchAndCacheMovieList = async (endpoint: string, cacheType: 'popular' | 'trending'): Promise<IMovie[]> => {
    const now = Date.now();
    let
        cache = cacheType === 'popular' ? cachedPopularMovies : cachedTrendingMovies;

    if (cache && (now - cache.timestamp < CACHE_DURATION_MS)) {
        // Return cached data if still fresh
        return cache.movies;
    }

    try {
        const response = await axios.get(`${MOVIE_API_URL}/${endpoint}`, {
            params: {
                api_key: MOVIE_API_KEY,
                sort_by: 'popularity.desc',
                language: 'en-US',
                page: 1
            }
        });

        // Extract movies from the response
        const data = response.data as { results: IMovie[] };
        const tmdbMovies = data.results;
        const moviesToCache: IMovie[] = [];

        // For each movie from TMDb, ensure it's in our local Movie collection
        for (const tmdbMovie of tmdbMovies) {
            const movie = await fetchAndCacheMovieData(tmdbMovie.id);
            if (movie) {
                moviesToCache.push(movie);
            }
        }

        // Update cache
        if (cacheType === 'popular') {
            cachedPopularMovies = { movies: moviesToCache, timestamp: now };
        } else {
            cachedTrendingMovies = { movies: moviesToCache, timestamp: now };
        }

        return moviesToCache;

    } catch (error: any) {
        console.error(`Error fetching ${cacheType} movies from TMDb:`, error.message);
        // If fetching fails, return empty array or throw error
        return error.response?.status === 404 ? [] : Promise.reject(new Error(`Failed to fetch ${cacheType} movies: ${error.message}`));
    }
};

// get popular movies
export const getPopularMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movies = await fetchAndCacheMovieList('movie/popular', 'popular');
        res.status(200).json(movies);
    } catch (error) {
        next(error);
    }
};

// get trending movies
export const getTrendingMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 'all/day' or 'movie/day' or 'tv/day' etc. for trending
        const movies = await fetchAndCacheMovieList('trending/movie/day', 'trending');
        res.status(200).json(movies);
    } catch (error) {
        next(error);
    }
};

export const searchMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query, page = 1 } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required.' });
        }

        const response = await axios.get(`${MOVIE_API_URL}/search/movie`, {
            params: {
                api_key: MOVIE_API_KEY,
                language: 'en-US',
                query: query,
                page: page
            }
        });

        const tmdbSearchResults = response.data as { results: IMovie[] };
        const moviesToReturn: IMovie[] = [];

        // Cache search results if they don't exist
        for (const tmdbMovie of tmdbSearchResults.results) {
            const movie = await fetchAndCacheMovieData(tmdbMovie.id);
            if (movie) {
                moviesToReturn.push(movie);
            }
        }
        res.status(200).json(moviesToReturn);

    } catch (error) {
        next(error);
    }
};

// get movie by ID
export const getMovieById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movieId = parseInt(req.params.movieId);
        if (isNaN(movieId)) {
            return res.status(400).json({ message: 'Invalid movie ID.' });
        }
        const movie = await fetchAndCacheMovieData(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found.' });
        }
        res.status(200).json(movie);
    } catch (error) {
        next(error);
    }
};

// movie recommendations
export const getMovieRecommendations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movieId = parseInt(req.params.movieId);
        if (isNaN(movieId)) {
            return res.status(400).json({ message: 'Invalid movie ID.' });
        }

        const response = await axios.get(`${MOVIE_API_URL}/movie/${movieId}/recommendations`, {
            params: {
                api_key: MOVIE_API_KEY,
            }
        });
        const tmdbRecommendations = response.data as { results: IMovie[] };
        const recommendations: IMovie[] = [];
        for (const tmdbMovie of tmdbRecommendations.results) {
            const movie = await fetchAndCacheMovieData(tmdbMovie.id);
            if (movie) {
                recommendations.push(movie);
            }
        }
        res.status(200).json(recommendations);
    } catch (error) {
        next(error);
    }
};

