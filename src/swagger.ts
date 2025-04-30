
// import swaggerJsdoc from "swagger-jsdoc";

// const swaggerDefinition = {
//   openapi: "3.0.0",
//   info: {
//     title: "HU-IAPAMS Internal Vacancy API",
//     version: "1.0.0",
//     description: "API documentation for HU-IAPAMS internal vacancy management system.",
//   },
//   servers: [
//     {
//       url: "http://localhost:5002/api/v1",
//       description: "Local Server",
//     },
//     {
//       url: "https://hu-iapams-api.onrender.com/api/v1",
//       description: "Deployed Server",
//     },
//   ],
//   components: {
//     securitySchemes: {
//       bearerAuth: {
//         type: "http",
//         scheme: "bearer",  
//         bearerFormat: "JWT",
//         description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
//       },
//     },
//   },
//   security: [
//     {
//       bearerAuth: [],
//     },
//   ],
// };

// const apiPaths = process.env.NODE_ENV === "production"
//   ? [
//       "dist/app/module/**/*.routes.js",
//       "dist/app/module/**/*.swagger.js",
//     ]
//   : [
//       "src/app/module/**/*.routes.ts",
//       "src/app/module/**/*.swagger.ts",
//     ];

// const options = {
//   definition: swaggerDefinition, 
//   apis: apiPaths,
// };

// const swaggerSpec = swaggerJsdoc(options);

// export default swaggerSpec;

import swaggerJsdoc from "swagger-jsdoc";

const isProduction = process.env.NODE_ENV === "production";

const localServer = {
  url: "http://localhost:5002/api/v1",
  description: "Local Server",
};

const deployedServer = {
  url: "https://hu-iapams-api.onrender.com/api/v1",
  description: "Deployed Server",
};

// Prioritize current environment's server
const servers = isProduction ? [deployedServer, localServer] : [localServer, deployedServer];

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "HU-IAPAMS Internal Vacancy API",
    version: "1.0.0",
    description: "API documentation for HU-IAPAMS internal vacancy management system.",
  },
  servers,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const apiPaths = isProduction
  ? [
      "dist/app/module/**/*.routes.js",
      "dist/app/module/**/*.swagger.js",
    ]
  : [
      "src/app/module/**/*.routes.ts",
      "src/app/module/**/*.swagger.ts",
    ];

const options = {
  definition: swaggerDefinition,
  apis: apiPaths,
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
