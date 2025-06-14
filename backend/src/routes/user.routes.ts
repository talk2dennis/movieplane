import { Router } from "express";
import { updateUserById, getUserById, getAllUsers, deleteUserById } from "../controllers/auth.controller";
import { getUserValidation, updateValidation, deleteUserValidation } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validation.middleware";
import { protect } from "../middleware/auth.middleware";
import { toggleFollowUser, getFollowers, getFollowing, toggleFavoriteMovie, toggleWatchlistMovie, getFavoriteMovies, getWatchlistMovies } from "../controllers/user.controller";

const userRouter = Router();

// get all users
userRouter.get("/", protect, getAllUsers);

// toggle follow user
userRouter.post(
    '/:userId/follow',
    protect,
    toggleFollowUser
);

// get followers of a user
userRouter.get(
    '/followers',
    protect,
    getFollowers
);

// get following users of a user
userRouter.get(
    '/following',
    protect,
    getFollowing
);

// toggle favorite movie
userRouter.post(
    '/favorites/toggle',
    protect,
    toggleFavoriteMovie
);

// toggle watchlist movie
userRouter.post(
    '/watchlist/toggle',
    protect,
    toggleWatchlistMovie
);

// get favorite movies of a user
userRouter.get(
    '/favorites',
    protect,
    getFavoriteMovies
);

// get watchlist movies of a user
userRouter.get(
    '/watchlist',
    protect,
    getWatchlistMovies
);

// get user by id
userRouter.get(
    '/:id',
    getUserValidation,
    validateRequest,
    protect,
    getUserById
);

// update user by id
userRouter.put(
    '/:id',
    updateValidation,
    validateRequest,
    protect,
    updateUserById
);

// delete a user
userRouter.delete(
    '/:id',
    deleteUserValidation,
    validateRequest,
    protect,
    deleteUserById
);



// Export the user router
export default userRouter;


//// Swagger documentation for user routes
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Endpoints related to user management and social actions
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/{userId}/follow:
 *   post:
 *     summary: Follow or unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow/unfollow
 *     responses:
 *       200:
 *         description: Follow status updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/followers:
 *   get:
 *     summary: Get followers of the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of followers
 */

/**
 * @swagger
 * /api/users/following:
 *   get:
 *     summary: Get users the authenticated user is following
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of following users
 */

/**
 * @swagger
 * /api/users/favorites/toggle:
 *   post:
 *     summary: Add or remove a movie from favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "tt4154796"
 *     responses:
 *       200:
 *         description: Movie added or removed from favorites
 */

/**
 * @swagger
 * /api/users/watchlist/toggle:
 *   post:
 *     summary: Add or remove a movie from watchlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "tt1375666"
 *     responses:
 *       200:
 *         description: Movie added or removed from watchlist
 */

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Get favorite movies of the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite movies
 */

/**
 * @swagger
 * /api/users/watchlist:
 *   get:
 *     summary: Get watchlist movies of the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of watchlist movies
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User object
 *       404:
 *         description: User not found
 *
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newUsername
 *               email:
 *                 type: string
 *                 example: newemail@example.com
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 */
