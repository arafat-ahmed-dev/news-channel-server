import express from 'express';
import cors from 'cors';
const app = express();
import healthcheckRoutes from './routes/healthcheck.routes.js';
import authRoutes from './routes/auth.routes.js';

// Basic Configuration
app.use(express.json({ limit: '16kb' })); //To get the request body in json format and limit the size of the request body
app.use(express.urlencoded({ extended: true, limit: '16kb' })); //To get the request body in urlencoded format and limit the size of the request body
app.use(express.static('public')); //To serve static files from the public directory

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
app.get('/', (req, res) => {
  res.send('Hello, World! :)');
});

app.get('/about', (req, res) => {
  res.send('About page');
});

export default app;
