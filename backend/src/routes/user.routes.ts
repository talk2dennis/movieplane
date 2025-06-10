import { Router } from "express";
import { updateUserById, getUserById, getAllUsers, deleteUserById } from "../controllers/auth.controller";
import { getUserValidation, updateValidation, deleteUserValidation } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validation.middleware";
import { protect } from "../middleware/auth.middleware";

const userRouter = Router();

// get all users
userRouter.get("/", protect, getAllUsers);

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

export default userRouter;
