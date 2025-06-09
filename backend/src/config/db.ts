import mongoose from "mongoose";
import { MONGO_URI } from "./env.check";


// Function to connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        // Log the connection host
        console.log("connecting to MongoDB...");

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};


// Export the connectDB function
export default connectDB;
