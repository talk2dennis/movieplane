import { Router } from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/auth.controller";

const router = Router();

// Route for user registration
router.post("/register", registerUser);
// Route for user login
router.post("/login", loginUser);
// get all users
router.get("/users", getAllUsers);



// Export the router
export default router;
