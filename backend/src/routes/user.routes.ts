import { Router } from "express";
import { updateUserById, getUserById, getAllUsers, deleteUserById } from "../controllers/auth.controller";
import { getUserValidation, updateValidation, deleteUserValidation } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validation.middleware";
import { protect } from "../middleware/auth.middleware";
import { toggleFollowUser, getFollowers, getFollowing } from "../controllers/user.controller";

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
