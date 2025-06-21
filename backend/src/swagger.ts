import { Express } from "express";
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';


dotenv.config();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const url = NODE_ENV === 'production'
  ? 'https://movieplane.onrender.com'
  : `http://localhost:${PORT}`;


// swagger options
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "MoviePlane API",
      version: "0.1.0",
      description:
        "MoviePlane API swagger documentation. This API allows you to create, read, update, and delete movies.\n Visit [MoviePlane](https://movieplane.vercel.app) for more information.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Dennis Adigwe",
        url: "https://example.com",
        email: "adigwedennis@email.com",
      },
    },
    servers: [
      {
        url,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

// Function to setup swagger docs in Express
export const setupSwaggerDocs = (app: Express) => {
  app.use(
    "/api-docs", swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true }),
  );
  console.log(`Swagger docs available at ${url}/api-docs`);
};