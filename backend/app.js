import express from 'express';
import claimRoutes from './routes/claimRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import policyholderRoutes from './routes/policyholderRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

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
