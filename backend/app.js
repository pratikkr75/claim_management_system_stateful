import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js'; // Import the connectDB function
import claimRoutes from './routes/claimRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import policyholderRoutes from './routes/policyholderRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/claims', claimRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/policyholders', policyholderRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
