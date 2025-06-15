import { Request, Response, NextFunction } from "express";
import Movie, { IMovie } from "../models/movie.model";
import User, { IUser } from "../models/user.model";
import { MOVIE_API_KEY } from "../config/env.check"
import axios from "axios";
import mongoose from "mongoose";


// for trending and popular movies
const fetchAndCacheMovie = async (tmdbId: number): Promise<IMovie | null> => {
    try {
        let movie = await Movie.findOne({ tmdb_id: tmdbId });

        if (!movie) {
            // Fetch from TMDb
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
                params: {
                    api_key: MOVIE_API_KEY,
                }
            });
            const tmdbMovieData = response.data as IMovie;
            // Check if the movie data is valid
            if (!tmdbMovieData || !tmdbMovieData.id) {
                console.error(`Movie with TMDb ID ${tmdbId} not found.`);
                return null;
            }
            // Create a new movie document
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
        console.error(`Error fetching movie with TMDb ID ${tmdbId}:`, error);
        return null;
    }
};


// toggle favorites movie
export const toggleFavoriteMovie = async (req: Request, res: Response, next: NextFunction) => {
    // check if the user is authenticated and the movie ID is provided
    try {
        const { movieId } = req.body;
        const currentUserId = req.user!.id;
        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required" });
        }
        // find the movie by ID
        const movieTmdbId = parseInt(movieId);
        if (isNaN(movieTmdbId)) {
            return res.status(400).json({ message: 'Invalid movie ID provided.' });
        }
        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        console.log("User: ", user);

        // Fetch and cache the movie details if not already present
        const movie = await fetchAndCacheMovie(movieTmdbId);
        // check if movie was found
        if (!movie) return res.status(404).json({ message: "Movie cannot be found."})
        // Check if the movie is already in favorites
        // if (user.favorites_movies.length >= 100) {
        //     return res.status(400).json({ message: 'You can only have up to 100 favorite movies.' });
        // }
      
        const index = user.favorites_movies.includes(movie._id) ? user.favorites_movies.indexOf(movie._id) : -1;
        console.log(`Movie TMDB ID: ${movieTmdbId}, Index in favorites: ${index}`);
        if (index === -1) {
             // Add to favorites
            user.favorites_movies.push(movie._id);
            await user.save();
            res.status(200).json({ message: 'Movie added to favorites', action: 'added' });
        } else {
            user.favorites_movies.splice(index, 1);
             // Remove from favorites
            await user.save();
            res.status(200).json({ message: 'Movie removed from favorites', action: 'removed' });
        }
    } catch (error) {
        next(error);
    }
};

// toggle watchlist movie
export const toggleWatchlistMovie = async (req: Request, res: Response, next: NextFunction) => {
    // check if the user is authenticated and the movie ID is provided
    try {
        const { movieId } = req.body;
        const currentUserId = req.user!.id;
        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required" });
        }
        // find the movie by ID
        const movieTmdbId = parseInt(movieId);
        if (isNaN(movieTmdbId)) {
            return res.status(400).json({ message: 'Invalid movie ID provided.' });
        }
        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Fetch and cache the movie details if not already present
        const movie = await fetchAndCacheMovie(movieTmdbId);
        // check if movie was found
        if (!movie) return res.status(404).json({ message: "Movie cannot be found."});
        const index = user.watchlist_movies.indexOf(movie._id);
        if (index === -1) {
            // Add to watchlist
            user.watchlist_movies.push(movie._id);
            await user.save();
            res.status(200).json({ message: 'Movie added to watchlist', action: 'added' });
        } else {
            // Remove from watchlist
            user.watchlist_movies.splice(index, 1);
            await user.save();
            res.status(200).json({ message: 'Movie removed from watchlist', action: 'removed' });
        }
    } catch (error) {
        next(error);
    }
};


// get favorites movies
export const getFavoriteMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
         // Get ID from param or current user
        const targetUserId = req.params.userId || req.user!.id;
        const currentUserId = req.user!.id;

        // If the target user ID is not provided, use the current user's ID
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });

        // If trying to access someone else's list, check if current user is following them
        if (
            targetUserId.toString() !== currentUserId.toString() &&
            !(targetUser.followers?.includes(currentUserId))
        ) {
            return res.status(403).json({ message: 'You must follow this user to view their favorite movies.' });
        }

        const favoriteMovies = await Movie.find({ _id: { $in: targetUser.favorites_movies } });

        res.status(200).json(favoriteMovies);
    } catch (error) {
        next(error);
    }
};

// get watchlist movies
export const getWatchlistMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const targetUserId = req.params.userId || req.user!.id;
        const currentUserId = req.user!.id;
        // If the target user ID is not provided, use the current user's ID
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ message: 'User not found' });
        // If trying to access someone else's list, check if current user is following them
        if (
            targetUserId.toString() !== currentUserId.toString() &&
            !(targetUser.followers?.includes(currentUserId))
        ) {
            return res.status(403).json({ message: 'You must follow this user to view their watchlist movies.' });
        }
        const watchlistMovies = await Movie.find({ _id: { $in: targetUser.watchlist_movies } });
        res.status(200).json(watchlistMovies);
    } catch (error) {
        next(error);
    }
};


// handle user follow/unfollow functionality
export const toggleFollowUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // the user to follow or unfollow is specified in the URL parameter
        const { userId } = req.params;
        const currentUserId = req.user!.id;

        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // you can't follow yourself
        if (userId === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userToFollow = await User.findById(userId);
        if (!userToFollow || !userToFollow.followers) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentUser = await User.findById(currentUserId);
        if (!currentUser || !currentUser.following) {
            return res.status(404).json({ message: "Current user not found" });
        }

        // Check if the user is already followed
        const isFollowing = currentUser.following.includes(userId);

        if (isFollowing) {
            // Unfollow the user
            currentUser.following = currentUser.following.filter(id => id !== userId);
            userToFollow.followers = userToFollow.followers.filter(id => id !== currentUserId);
        } else {
            // Follow the user
            currentUser.following.push(userId);
            userToFollow.followers.push(currentUserId);
        }

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({
            message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
            following: currentUser.following,
            followers: userToFollow.followers
        });
    } catch (error) {
        next(error);
    }
}


// export following users
export const getFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.user!.id;

        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(currentUserId)
            .populate("following", "username email profilePicture");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.following);
    } catch (error) {
        next(error);
    }
}
// export followers
export const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.user!.id;

        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(currentUserId)
            .populate("followers", "username email profilePicture");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.followers);
    } catch (error) {
        next(error);
    }
}