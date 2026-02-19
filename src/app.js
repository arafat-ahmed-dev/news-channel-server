import express from 'express';
import cors from 'cors';
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

// Morgan for logging HTTP requests (media control/monitoring)
app.use(morgan('dev'));

// Disable ETags to prevent 304 stale cache responses after updates
app.set('etag', false);

// Basic Configuration
app.use(express.json({ limit: '16kb' })); //To get the request body in json format and limit the size of the request body
app.use(express.urlencoded({ extended: true, limit: '16kb' })); //To get the request body in urlencoded format and limit the size of the request body
app.use(express.static('private')); //To serve static files from the public directory

// CORS - Cross-Origin Resource Sharing
const corsOptions = {
  origin:
    process.env.CORS_ORIGIN?.split(',') ||
    'http://localhost:3000' ||
    'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true, //To allow the request to be sent with the credentials like cookies, headers, etc.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'], //To allow the request to be sent with the methods GET, POST, PUT, DELETE and OPTIONS and HEAD and PATCH
  allowedHeaders: ['Content-Type', 'Authorization'], //To allow the request to be sent with the headers Content-Type and Authorization
};
app.use(cors(corsOptions)); //To use the cors middleware
//Routes
app.use('/api/v1/healthcheck', healthcheckRoutes); // Health check route
app.use('/api/v1/auth', authRoutes); // Auth routes
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/horoscopes', horoscopeRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/reactions', reactionRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/polls', pollRoutes);
app.use('/api/v1/reading-history', readingHistoryRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/ads', adsRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/settings', settingsRoutes);
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
