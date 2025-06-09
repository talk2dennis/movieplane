// src/types/express.d.ts

// Import Request from 'express'
import { Request } from 'express';

// Extend the Express Request interface
declare global {
    namespace Express {
        interface Request {
            // Add a 'user' property to the Request object
            // This property will hold the decoded JWT payload (e.g., user ID and username)
            user?: {
                id: string; // MongoDB ObjectId converted to string
                email: string;
            };
        }
    }
}