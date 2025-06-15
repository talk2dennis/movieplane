# 🎬 MoviePlane Backend API

MoviePlane is a RESTful API that supports user management, movie discovery, and personalized movie tracking using JWT-based authentication.

## 📚 Table of Contents

- [🎬 MoviePlane Backend API](#-movieplane-backend-api)
  - [📚 Table of Contents](#-table-of-contents)
  - [🚀 Features](#-features)
  - [⚙️ Tech Stack](#️-tech-stack)
  - [🧰 Getting Started](#-getting-started)
    - [📦 Installation](#-installation)
    - [⚙️ Environment Variables](#️-environment-variables)
    - [▶️ Running Locally](#️-running-locally)
  - [📑 API Documentation](#-api-documentation)
  - [🔐 Authentication](#-authentication)
  - [📦 Routes](#-routes)
    - [🔑 Auth Routes](#-auth-routes)
    - [👥 User Routes](#-user-routes)
    - [🎬 Movie Routes](#-movie-routes)
  - [🚀 Deployment](#-deployment)
  - [📄 License](#-license)

---

## 🚀 Features

- 🔐 JWT Authentication (Register, Login, Get current user)
- 👤 User Management (Update, Delete, Get followers/following)
- 🎥 Movie Discovery (Popular, Trending, Search, Details)
- 📽️ Personalized Collections (Favorites & Watchlist)
- 📄 Swagger UI for API documentation
- 🛡️ Secure with Helmet & CORS
- 📝 Request validation with middleware

---

## ⚙️ Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **JWT (JSON Web Tokens)**
- **Swagger (OpenAPI 3.1)**
- **Mongoose / MongoDB (or preferred DB)**
- **Helmet, CORS, Morgan**

---

## 🧰 Getting Started

### 📦 Installation

```bash
git clone https://github.com/your-username/movieplane-backend.git
cd movieplane-backend
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000
```

### ▶️ Running Locally

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

---

## 📑 API Documentation

Access the live Swagger documentation:

- **Local**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Production (Render)**: [https://movieplane.onrender.com/api-docs](https://movieplane.onrender.com/api-docs)

Use the **Authorize** button to input your JWT token for protected endpoints.

---

## 🔐 Authentication

MoviePlane uses JWT-based authentication. To access protected routes:

1. Register or Login to obtain a token.
2. Include the token in requests using:

```http
Authorization: Bearer <your_token>
```

---

## 📦 Routes

### 🔑 Auth Routes

| Method | Endpoint           | Description                   |
|--------|--------------------|-------------------------------|
| POST   | `/api/auth/register` | Register a new user          |
| POST   | `/api/auth/login`    | Log in and receive a token   |
| GET    | `/api/auth/me`       | Get the current user profile |

---

### 👥 User Routes

**Base URL**: `/api/users`

| Method | Endpoint                    | Description                      |
|--------|-----------------------------|----------------------------------|
| GET    | `/`                         | Get all users (protected)        |
| GET    | `/:id`                      | Get user by ID                   |
| PUT    | `/:id`                      | Update user by ID                |
| DELETE | `/:id`                      | Delete user by ID                |
| POST   | `/:userId/follow`           | Toggle follow/unfollow user      |
| GET    | `/followers`                | Get followers of logged-in user  |
| GET    | `/following`                | Get following users              |
| POST   | `/favorites/toggle`         | Add/remove a movie from favorites|
| GET    | `/favorites`                | Get favorite movies              |
| POST   | `/watchlist/toggle`         | Add/remove a movie from watchlist|
| GET    | `/watchlist`               | Get watchlist movies             |

---

### 🎬 Movie Routes

**Base URL**: `/api/movies`

| Method | Endpoint                       | Description                            |
|--------|--------------------------------|----------------------------------------|
| GET    | `/popular`                     | Fetch popular movies                   |
| GET    | `/trending`                    | Fetch trending movies                  |
| GET    | `/search?query=batman`         | Search movies by title (protected)     |
| GET    | `/:movieId`                    | Get movie details by ID (protected)    |
| GET    | `/:movieId/recommendations`    | Get movie recommendations (protected)  |

---

## 🚀 Deployment

This app is deployed on **Render.com**.

- Base URL: `https://movieplane.onrender.com`
- API Docs: [https://movieplane.onrender.com/api-docs](https://movieplane.onrender.com/api-docs)

Make sure your Swagger server URL reflects production:

```ts
servers: [
  {
    url: "https://movieplane.onrender.com",
  },
]
```

---

## 📄 License

MIT License © 2025 Dennis Adigwe