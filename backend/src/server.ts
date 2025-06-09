import app from './app';
import dotenv from 'dotenv';
import { setupSwaggerDocs } from './swagger';


dotenv.config();

const PORT = process.env.PORT || 3000;

setupSwaggerDocs(app);
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});


