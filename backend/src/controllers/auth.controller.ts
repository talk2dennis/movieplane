import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET, GOOGLE_CLIENT_ID } from "../config/env.check";
import { console } from "inspector";
import { OAuth2Client } from 'google-auth-library';

// Initialize Google OAuth2 client
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// helper to generate token
const generateAppToken = (user: IUser) => {
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '3h' }
    );
};
// for google auth
export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { id_token } = req.body;
    if (!id_token) {
        return res.status(400).json({ message: "ID token is required" });
    }

    try {
        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: GOOGLE_CLIENT_ID,
        });

        // Get the payload from the user
        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email) {
            return res.status(401).json({ message: 'Invalid Google ID token payload.' });
        }
        const googleId = payload.sub; // Google's unique user ID
        const email = payload.email;
        const username = payload.name || payload.email.split('@')[0];

        // Check if user already exists
        let user = await User.findOne({ $or: [{ google_id: googleId }, { email: email }] });
        if (user) {
            // User exists
            if (!user.google_id) {
                // If existing user (e.g., signed up with email/password) logs in with Google for first time
                user.google_id = googleId;
                user.profilePicture = payload.picture || '';
                await user.save();
            }
            // Ensure username is updated if it came from Google and was empty/generic
            if (!user.username && payload.name) {
                user.username = payload.name;
                await user.save();
            }
        } else {
            // User does not exist, create new user
            user = new User({
                google_id: googleId,
                profilePicture: payload.picture || '',
                email: email,
                username: username,
            });
            await user.save();
        }

        // Generate JWT token
        const token = generateAppToken(user);

        // Respond with user data and token
        res.status(200).json({
            message: "Google authentication successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
            token,
        });
    } catch (error: any) {
        if (error.code === 'ERR_INVALID_AUDIENCE') {
            return res.status(401).json({ message: 'Invalid Google Client ID for token verification.' });
        }
        next(error);
    }
}

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