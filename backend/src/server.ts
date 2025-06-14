import app from './app';
import { PORT } from './config/env.check';
import connectDB from './config/db';

// Connect to MongoDB
connectDB();


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


