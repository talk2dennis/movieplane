import { Router } from "express";
import { updateUserById, getUserById, getAllUsers, deleteUserById } from "../controllers/auth.controller";
import { getUserValidation, updateValidation, deleteUserValidation } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validation.middleware";

const userRouter = Router();

// get all users
userRouter.get("/", getAllUsers);

// get user by id
userRouter.get(
    '/:id',
    getUserValidation,
    validateRequest,
    getUserById
);

// update user by id
userRouter.put(
    '/:id',
    updateValidation,
    validateRequest,
    updateUserById
);

// delete a user
userRouter.delete(
    '/:id',
    deleteUserValidation,
    validateRequest,
    deleteUserById
);

export default userRouter;
