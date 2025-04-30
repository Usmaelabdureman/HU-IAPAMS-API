"use strict";
// import swaggerJsdoc from "swagger-jsdoc";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const swaggerDefinition = {
//   openapi: "3.0.0",
//   info: {
//     title: "HU-IAPAMS internal vacancy API",
//     version: "1.0.0",
//     description: "API documentation for HU-IAPAMS internal vacancy",
//   },
//   servers: [
//     {
//       url: "http://localhost:5002/api/v1",
//       description: "Local Server",
//     },
//     {
//       url: "https://hu-iapams-api.vercel.app/api/v1",
//       description: "Deployed Server",
//     },
//   ],
//   components: {
//     securitySchemes: {
//       bearerAuth: {
//         type: "http",
//         scheme: "Bearer",
//         bearerFormat: "JWT",
//         description: "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
//       }
//     }
//   },
//   security: [{
//     bearerAuth: []
//   }]
// };
// const apiPaths = process.env.NODE_ENV === 'production'
//   ? [
//       "dist/app/module/**/*.routes.js", 
//       "dist/app/module/**/*.swagger.js"
//     ]
//   : [
//       "src/app/module/**/*.routes.ts", 
//       "src/app/module/**/*.swagger.ts"
//     ];
// const options = {
//   swaggerDefinition,
//   apis: apiPaths
// };
// const swaggerSpec = swaggerJsdoc(options);
// export default swaggerSpec;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "HU-IAPAMS Internal Vacancy API",
        version: "1.0.0",
        description: "API documentation for HU-IAPAMS internal vacancy management system.",
    },
    servers: [
        {
            url: "http://localhost:5002/api/v1",
            description: "Local Server",
        },
        {
            url: "https://hu-iapams-api.vercel.app/api/v1",
            description: "Deployed Server",
        },
    ],
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
const apiPaths = process.env.NODE_ENV === "production"
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
