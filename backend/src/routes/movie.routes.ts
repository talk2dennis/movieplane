import { Router } from 'express';
import { 
    getPopularMovies, 
    getTrendingMovies, 
    searchMovies, 
    getMovieById,
    getMovieRecommendations,
    getSimilarMovies
} from '../controllers/movie.controller';
import { protect } from '../middleware/auth.middleware';


const router = Router();

// Define routes for movie-related endpoints
// Protect all movie routes
// router.use(protect);
router.get('/popular', getPopularMovies);
router.get('/trending', getTrendingMovies);
router.get('/search', protect, searchMovies);
router.get('/:movieId', protect, getMovieById);
router.get('/:movieId/recommendations', protect, getMovieRecommendations);
router.get('/:movieId/similar', protect, getSimilarMovies);


export default router;

// Swagger documentation for movie routes
/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: Endpoints for retrieving movie data
 */

/**
 * @swagger
 * /api/movies/popular:
 *   get:
 *     summary: Get popular movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of popular movies
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/movies/trending:
 *   get:
 *     summary: Get trending movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of trending movies
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Search for movies
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for the movie title
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of search results
 *       400:
 *         description: Missing or invalid query parameter
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/movies/{movieId}:
 *   get:
 *     summary: Get a movie by its ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/movies/{movieId}/recommendations:
 *   get:
 *     summary: Get movie recommendations based on a movie ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie for which to get recommendations
 *     responses:
 *       200:
 *         description: Recommended movies
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/movies/{movieId}/similar:
 *   get:
 *     summary: Get similar movies based on a movie ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie for which to get Similar movies
 *     responses:
 *       200:
 *         description: Recommended movies
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
