import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.check";


interface JwtPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

// protect middleware
export const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = { id: decoded.id, email: decoded.email };
        next();
    } catch (error: any) {
        // Handle specific JWT errors
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Not authorized, token expired' }); 
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Not authorized, token invalid' }); 
        }
        // Catch any other unexpected errors during verification
        res.status(500).json({ message: 'Internal server error during token verification' });
    }
};