import { Router } from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/auth.controller";
import { registerValidation, loginValidation } from "../validators/auth.validator";
import { validateRequest } from "../middleware/validation.middleware";
import { protect } from "../middleware/auth.middleware";

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

// Route to current user
router.get(
    "/me",
    protect,
    getCurrentUser
);

// Export the router
export default router;
