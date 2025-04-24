"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
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
const apiPaths = process.env.NODE_ENV === 'production'
    ? [
        // In production, only look at compiled files
        "dist/app/module/**/*.routes.js", "dist/app/module/**/*.swagger.js"
    ]
    : [
        // In development, look at TypeScript files
        "src/app/module/**/*.routes.ts", "./src/app/module/**/*.swagger.ts"
    ];
const options = {
    swaggerDefinition,
    apis: apiPaths
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
