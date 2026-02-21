import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
const app = express();

import healthcheckRoutes from './routes/healthcheck.routes.js';
import authRoutes from './routes/auth.routes.js';
import newsRoutes from './routes/news.routes.js';
import categoryRoutes from './routes/category.routes.js';
import horoscopeRoutes from './routes/horoscope.routes.js';
import commentRoutes from './routes/comment.routes.js';
import reactionRoutes from './routes/reaction.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import pollRoutes from './routes/poll.routes.js';
import readingHistoryRoutes from './routes/readinghistory.routes.js';
import usersRoutes from './routes/users.routes.js';
import adsRoutes from './routes/ads.routes.js';
import mediaRoutes from './routes/media.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import settingsRoutes from './routes/settings.routes.js';

// Security headers
app.use(helmet());

// Gzip/Deflate compression
app.use(compression());

// Rate limiting — 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts, please try again later.',
  },
});

// Morgan for logging HTTP requests (media control/monitoring)
if (process.env.NODE_ENV !== 'development') {
  app.use(morgan('dev'));
}

// Disable ETags to prevent 304 stale cache responses after updates
app.set('etag', false);

// Basic Configuration
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// CORS - Cross-Origin Resource Sharing
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Apply rate limiters
app.use('/api/v1/auth', authLimiter, authRoutes);

// Routes
app.use('/api/v1/healthcheck', healthcheckRoutes);
app.use('/api/v1/news', apiLimiter, newsRoutes);
app.use('/api/v1/categories', apiLimiter, categoryRoutes);
app.use('/api/v1/horoscopes', apiLimiter, horoscopeRoutes);
app.use('/api/v1/comments', apiLimiter, commentRoutes);
app.use('/api/v1/reactions', apiLimiter, reactionRoutes);
app.use('/api/v1/notifications', apiLimiter, notificationRoutes);
app.use('/api/v1/polls', apiLimiter, pollRoutes);
app.use('/api/v1/reading-history', apiLimiter, readingHistoryRoutes);
app.use('/api/v1/users', apiLimiter, usersRoutes);
app.use('/api/v1/ads', apiLimiter, adsRoutes);
app.use('/api/v1/media', apiLimiter, mediaRoutes);
app.use('/api/v1/analytics', apiLimiter, analyticsRoutes);
app.use('/api/v1/settings', apiLimiter, settingsRoutes);
app.get('/', (req, res) => {
  res.send('Hello, World! :)');
});

app.get('/about', (req, res) => {
  res.send('About page');
});

// Error handler middleware (should be last)
import errorHandler from './middlewares/errorHandler.js';
app.use(errorHandler);

export default app;
