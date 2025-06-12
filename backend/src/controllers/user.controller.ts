import { Request, Response, NextFunction } from "express";
import Movie, { IMovie } from "../models/movie.model";
import User, { IUser } from "../models/user.model";




export const toggleFollowUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // the user to follow or unfollow is specified in the URL parameter
        const { userId } = req.params;
        const currentUserId = req.user!.id;

        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // you can't follow yourself
        if (userId === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const userToFollow = await User.findById(userId);
        if (!userToFollow || !userToFollow.followers) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentUser = await User.findById(currentUserId);
        if (!currentUser || !currentUser.following) {
            return res.status(404).json({ message: "Current user not found" });
        }

        // Check if the user is already followed
        const isFollowing = currentUser.following.includes(userId);

        if (isFollowing) {
            // Unfollow the user
            currentUser.following = currentUser.following.filter(id => id !== userId);
            userToFollow.followers = userToFollow.followers.filter(id => id !== currentUserId);
        } else {
            // Follow the user
            currentUser.following.push(userId);
            userToFollow.followers.push(currentUserId);
        }

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({
            message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
            following: currentUser.following,
            followers: userToFollow.followers
        });
    } catch (error) {
        next(error);
    }
}


// export following users
export const getFollowing = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.user!.id;

        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(currentUserId)
            .populate("following", "username email profilePicture");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.following);
    } catch (error) {
        next(error);
    }
}
// export followers
export const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.user!.id;

        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(currentUserId)
            .populate("followers", "username email profilePicture");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.followers);
    } catch (error) {
        next(error);
    }
}