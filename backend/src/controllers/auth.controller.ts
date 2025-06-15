import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.check";
import { console } from "inspector";


// Controller for user registration
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body);

        // Check if user already exists
        const existingUser = await User.find({ $or: [{ username }, { email }] });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username or email already exists" });
        }
        // Create new user
        const newUser = new User({
            username,
            email,
            password_hash: password,
        });
        await newUser.save();

        // Respond with user data and token
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },

        });
    } catch (error) {
        next(error);
    }
}


// Controller for user login
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password_hash');
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

        // Respond with user data and token
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
}

// Controller for getting the current user with JWT token
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get user ID from JWT token
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find user by ID
        const user = await User.findById(userId, '-password_hash').populate('favorites_movies').populate('watchlist_movies').populate('followers', '-password_hash').populate('following', '-password_hash');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(user.favorites_movies);

        // Respond with user data
        res.status(200).json({
            user
        });
    }
    catch (error) {
        next(error);
    }
}

// get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({}, '-password_hash');
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

// get user by id
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, '-password_hash');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}
// update user by id
export const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const { username, email, password } = req.body;

        // Find user by id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user data
        user.username = username;
        user.email = email;
        user.password_hash = password;

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
}
// delete user by id
export const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        // Find user by id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Delete user
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
}