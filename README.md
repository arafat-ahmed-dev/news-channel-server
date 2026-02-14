# News Channel Backend

This is the backend API for the News Channel project, built with Node.js,
Express, and MongoDB. It provides a robust RESTful API for managing news
articles, categories, comments, reactions, notifications, polls, horoscopes, and
user reading history. The backend is designed to support a modern news portal
frontend (such as a Next.js app).

## Features

- User authentication (JWT-based, ready for extension)
- CRUD operations for news articles, categories, comments, reactions,
  notifications, polls, horoscopes, and reading history
- Request validation using express-validator
- Centralized error handling
- CORS and security best practices
- Logging with morgan
- Environment-based configuration

## Folder Structure

```
news-channel-server/
  src/
    controllers/      # Business logic for each resource
    models/           # Mongoose schemas for MongoDB
    routes/           # Express route definitions
    middlewares/      # Error handling, validation, etc.
    database/         # MongoDB connection logic
    utils/            # Helper utilities (API response, mail, etc.)
    app.js            # Express app setup
    index.js          # Entry point (loads env, connects DB, starts server)
  .env                # Environment variables (see below)
  README.md           # Project documentation
```

## Environment Variables

Create a `.env` file in the root directory with the following:

```
PORT=3000
CORS_ORIGIN=*
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/
DATABASE_NAME=news-channel
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=5d
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-app-password"
SMTP_HOST="your-smtp-host"
SMTP_USER="your-email@example.com"
```

## API Endpoints

All endpoints are prefixed with `/api/v1/`.

- `/auth` - User authentication (login, register, etc.)
- `/news` - CRUD for news articles
- `/categories` - CRUD for categories
- `/horoscopes` - CRUD for horoscope signs
- `/comments` - CRUD for comments on articles
- `/reactions` - Like/love/laugh/etc. reactions on articles
- `/notifications` - User notifications
- `/polls` - Quick polls for users
- `/reading-history` - User reading history

## How to Run

1. Install dependencies:
   ```
   npm install
   ```
2. Set up your `.env` file as described above.
3. Start the server:
   ```
   npm start
   ```
   The server will run on the port specified in `.env` (default: 3000).

## Testing the API

- Use Postman or any REST client to test endpoints.
- All routes validate input and return JSON responses.
- For protected routes, use JWT tokens (see `/auth`).

## Extending the Project

# News Channel Backend API

A robust, production-ready backend for a modern news portal, built with Node.js,
Express, and MongoDB. This API powers features like news publishing, categories,
comments, reactions, notifications, polls, horoscopes, and user reading history.
Designed for seamless integration with any frontend (e.g., Next.js).

---

## Features

- **User Authentication** (JWT-based, extensible)
- **CRUD APIs** for news, categories, comments, reactions, notifications, polls,
  horoscopes, and reading history
- **Request Validation** with express-validator
- **Centralized Error Handling**
- **CORS & Security Best Practices**
- **HTTP Logging** with morgan
- **Environment-based Configuration**

---

## Project Structure

```
news-channel-server/
  src/
    controllers/      # Business logic for each resource
    models/           # Mongoose schemas for MongoDB
    routes/           # Express route definitions
    middlewares/      # Error handling, validation, etc.
    database/         # MongoDB connection logic
    utils/            # Helper utilities (API response, mail, etc.)
    app.js            # Express app setup
    index.js          # Entry point (loads env, connects DB, starts server)
  .env                # Environment variables (see below)
  README.md           # Project documentation
```

---

## Environment Setup

1. Copy `.env.example` to `.env` and fill in your values:
   ```
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/
   DATABASE_NAME=news-channel
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRES_IN=1h
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRES_IN=5d
   EMAIL_USER="your-email@example.com"
   EMAIL_PASS="your-app-password"
   SMTP_HOST="your-smtp-host"
   SMTP_USER="your-email@example.com"
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   The server runs on the port specified in `.env` (default: 3000).

---

## API Endpoints

All endpoints are prefixed with `/api/v1/`.

- `/auth` - User authentication (login, register, etc.)
- `/news` - CRUD for news articles
- `/categories` - CRUD for categories
- `/horoscopes` - CRUD for horoscope signs
- `/comments` - CRUD for comments on articles
- `/reactions` - Like/love/laugh/etc. reactions on articles
- `/notifications` - User notifications
- `/polls` - Quick polls for users
- `/reading-history` - User reading history

---

## How to Test the API

### 1. Using Postman (Recommended)

- Import the API endpoints manually or create a Postman Collection.
- Set the request URL (e.g., `http://localhost:3000/api/v1/news`).
- For POST/PUT, select **Body > raw > JSON** and provide the required fields.
- Click **Send** to see the response.
- For protected routes, first log in via `/api/v1/auth/login` to get a JWT
  token, then add it to the **Authorization** header as `Bearer <token>`.

### 2. Using cURL

Example: Create a news article

```
curl -X POST http://localhost:3000/api/v1/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test News",
    "excerpt": "Short summary",
    "category": "General",
    "categorySlug": "general",
    "author": "Admin",
    "date": "2026-02-14",
    "slug": "test-news"
  }'
```

### 3. Automated Testing (Optional)

- You can use tools like Jest or Mocha for automated endpoint testing.
- For full coverage, write tests for all CRUD operations and authentication
  flows.

### 4. Validation & Error Handling

- All routes validate input and return JSON responses.
- If validation fails, you’ll get a 400 error with details.
- Errors are returned in a consistent JSON format.

---

## Extending the Project

- Add more fields to models as needed.
- Implement role-based access control for admin features.
- Integrate with any frontend (e.g., Next.js) via the documented API.
- Add automated tests for CI/CD.

---

## License

MIT

---

**This backend is production-ready, fully documented, and easy to extend for new
features or integration with any modern frontend.**
