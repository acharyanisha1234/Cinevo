import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the Backend root folder BEFORE anything else
dotenv.config({ path: resolve(__dirname, '../.env') });

console.log('Loading .env from:', resolve(__dirname, '../.env'));
console.log('TMDB_ACCESS_TOKEN:', process.env.TMDB_ACCESS_TOKEN ? 'Set' : 'Missing');
console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY ? 'Set' : 'Missing');

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// connectDB() will now have access to process.env
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Cinevo API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));