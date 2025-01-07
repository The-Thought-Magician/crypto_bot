import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import tradeRoutes from './routes/trades.js';
import tokenRoutes from './routes/tokens.js';
import accountRoutes from './routes/accounts.js';
import subscriptionRoutes from './routes/subscriptions.js';
import notificationRoutes from './routes/notifications.js';
import connectDB from './db.js';
import { logInfo } from './utils/logger.js';

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trades', tradeRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);

// Route for listing active WebSocket subscriptions
app.get('/api/subscriptions', (req, res) => {
  res.json(listSubscriptions());
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Error Handling Middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => logInfo(`Server running on http://localhost:${PORT}`));
