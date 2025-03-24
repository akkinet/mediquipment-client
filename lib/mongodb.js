import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable in .env file');
}

// Store connection globally to prevent multiple connections
let isConnected = false;

async function connectDatabase() {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        // console.log('MongoDB Connected Automatically');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Automatically connect on import
connectDatabase();

export default mongoose;