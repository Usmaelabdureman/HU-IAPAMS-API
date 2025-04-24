import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "HU-IAPAMS internal vacancy API",
    version: "1.0.0",
    description: "API documentation for HU-IAPAMS internal vacancy",
  },
  servers: [
    {
      url: "http://localhost:5002/api/v1",
      description: "Local Server",
    },
    // {
    //   url: "https://my-studio-backend.vercel.app/api/v1",
    //   description: "Deployed Server",
    // },
  ],
  components: {
    // securitySchemes: {
    //   AdminAuth: {
    //     type: "apiKey",
    //     in: "header",
    //     name: "Authorization",
    //   },
    //   UserAuth: {
    //     type: "apiKey",
    //     in: "header",
    //     name: "Authorization",
    //   },
    // },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/app/module/**/*.swagger.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;