import { Express } from "express";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
dotenv.config();
const PORT = process.env.PORT || 3000;



// swagger options
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "MoviePlane API",
      version: "0.1.0",
      description:
        "MoviePlane API swagger documentation. This API allows you to create, read, update, and delete movies.",
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
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

// Function to setup swagger docs in Express
export const setupSwaggerDocs = (app: Express) => {
  app.use(
    "/api-docs", swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true }),
    swaggerUi.serve
);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
};