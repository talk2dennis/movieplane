import { Router } from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/auth.controller";
import { registerValidation, loginValidation } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validation.middleware";

const router = Router();

// Route for user registration
router.post(
    "/register",
    registerValidation,
    validateRequest,
    registerUser
);
// Route for user login
router.post(
    "/login",
    loginValidation,
    validateRequest,
    loginUser
);

// Export the router
export default router;
