# MoviePlane

## Overview

MoviePlane is a movie recommendation application that leverages the Movie Database API to provide users with personalized movie suggestions. The project is structured with a robust backend and a modern frontend:

### Backend

- **Express.js**: Handles API routing and server logic.
- **TypeScript**: Ensures type safety and maintainable code.
- **MongoDB**: Stores user data and movie preferences.
- **CORS**: Enables secure cross-origin requests.
- **Helmet**: Secures HTTP headers.
- **Morgan**: Logs HTTP requests for monitoring and debugging.

### Frontend

- **React**: Builds a dynamic and responsive user interface.
- **Redux**: Manages application state efficiently.
- **TypeScript**: Provides type safety for scalable frontend development.

MoviePlane aims to deliver a seamless and secure movie discovery experience for users.

## Setup

Follow these steps to set up the application locally:

### Prerequisites

- Node.js (v16 or higher)
- npm
- MongoDB instance (local or cloud)

### Backend Setup

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file based on `.env.example` and configure your environment variables.
4. ```
PORT=your_port
MONGO_URI=w=URI
JWT_SECRET=SECRET
JWT_EXPIRATION=1R-OR-2H
CORS_ORIGIN=YOUR-URL
```
1. Start the backend server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file based on `.env.example` and set the backend API URL.
4. Start the frontend development server:
    ```bash
    npm start
    ```

The app should now be running locally. Access the frontend in your browser and enjoy MoviePlane!

### Live Demo

You can access MoviePlane online at [https://movieplane.vercel.app/](https://movieplane.vercel.app/).  
On the site, you can create a new account, log in, and start exploring personalized movie recommendations right away. Enjoy discovering and managing your favorite movies with a seamless user experience.
