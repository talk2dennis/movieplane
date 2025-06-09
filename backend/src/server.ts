import app from './app';
import { setupSwaggerDocs } from './swagger';
import { PORT } from './config/env.check';
import connectDB from './config/db';

// Connect to MongoDB
connectDB();


setupSwaggerDocs(app);
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


