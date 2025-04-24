"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../error/handleZodError"));
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const globalErrorHandler = (error, req, res, next) => {
    // Default error response
    let statusCode = error.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = error.message || "Something went wrong";
    let errorSources = [
        {
            path: "",
            message: error.message || "Something went wrong",
        },
    ];
    // Handle Zod validation errors
    if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Handle Mongoose validation errors
    else if (error instanceof mongoose_1.default.Error.ValidationError) {
        const simplifiedError = handleMongooseValidationError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Handle Mongoose duplicate key errors
    else if (error.code === 11000 && error.name === 'MongoServerError') {
        const simplifiedError = handleMongoDuplicateKeyError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Handle Mongoose CastError (invalid ID format, etc)
    else if (error instanceof mongoose_1.default.Error.CastError) {
        const simplifiedError = handleMongooseCastError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Handle custom ApiError
    else if (error instanceof ApiError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
        errorSources = [
            {
                path: "",
                message: error.message,
            },
        ];
    }
    // Final error response
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config_1.default.node_env === "development" ? error.stack : null,
        // Only include error object in development for debugging
        error: config_1.default.node_env === "development" ? error : undefined,
    });
};
exports.default = globalErrorHandler;
// Helper functions for MongoDB-specific errors
function handleMongooseValidationError(error) {
    const errorSources = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message,
    }));
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: "Validation Error",
        errorSources,
    };
}
function handleMongoDuplicateKeyError(error) {
    const field = Object.keys(error.keyPattern)[0];
    const errorSources = [
        {
            path: field,
            message: `${field} already exists`,
        },
    ];
    return {
        statusCode: http_status_1.default.CONFLICT,
        message: "Duplicate Key Error",
        errorSources,
    };
}
function handleMongooseCastError(error) {
    const errorSources = [
        {
            path: error.path,
            message: `Invalid ${error.path}: ${error.value}`,
        },
    ];
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: "Invalid ID",
        errorSources,
    };
}
