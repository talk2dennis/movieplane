/// <reference path="./types/express.d.ts" />
import { Response, Request, NextFunction } from 'express';

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { CORS_ORIGIN } from './config/env.check';
import authRoutes from './routes/auth.routes';
import userRouter from './routes/user.routes';
import movieRoutes from './routes/movie.routes';
import { setupSwaggerDocs } from './swagger';



const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors(
    {
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
));

setupSwaggerDocs(app);

// status check endpoint
app.get('/status', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// use auth routes
app.use('/api/auth', authRoutes);

// use users routes
app.use('/api/users', userRouter);

// use movie routes
app.use('/api/movies', movieRoutes);

// Handle 404 - Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: 'Route not found',
        url: req.originalUrl,
        method: req.method
    });
});

// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});


export default app;