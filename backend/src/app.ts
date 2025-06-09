import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { CORS_ORIGIN } from './config/env.check';
import authRoutes from './routes/auth.routes';
import userRouter from './routes/user.routes';


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
        credentials: true, // Allow credentials
    }
));

// status check endpoint
app.get('/status', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// use auth routes
app.use('/api/auth', authRoutes);

// use users routes
app.use('/api/users', userRouter);

export default app;