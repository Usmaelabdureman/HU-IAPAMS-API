import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import config from "../config";
import { ZodError } from "zod";
import handleZodError from "../error/handleZodError";
import { TErrorSources } from "../interfaces/error";
import mongoose from "mongoose";
import ApiError from "../error/ApiError";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Default error response
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || "Something went wrong";
  let errorSources: TErrorSources[] = [
    {
      path: "",
      message: error.message || "Something went wrong",
    },
  ];

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } 
  // Handle Mongoose validation errors
  else if (error instanceof mongoose.Error.ValidationError) {
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
  else if (error instanceof mongoose.Error.CastError) {
    const simplifiedError = handleMongooseCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // Handle custom ApiError
  else if (error instanceof ApiError) {
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
    stack: config.node_env === "development" ? error.stack : null,
    // Only include error object in development for debugging
    error: config.node_env === "development" ? error : undefined,
  });
};

export default globalErrorHandler;

// Helper functions for MongoDB-specific errors

function handleMongooseValidationError(error: mongoose.Error.ValidationError) {
  const errorSources: TErrorSources[] = Object.values(error.errors).map(
    (err: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: err.path,
      message: err.message,
    })
  );

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Validation Error",
    errorSources,
  };
}

function handleMongoDuplicateKeyError(error: any) {
  const field = Object.keys(error.keyPattern)[0];
  const errorSources: TErrorSources[] = [
    {
      path: field,
      message: `${field} already exists`,
    },
  ];

  return {
    statusCode: httpStatus.CONFLICT,
    message: "Duplicate Key Error",
    errorSources,
  };
}

function handleMongooseCastError(error: mongoose.Error.CastError) {
  const errorSources: TErrorSources[] = [
    {
      path: error.path,
      message: `Invalid ${error.path}: ${error.value}`,
    },
  ];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Invalid ID",
    errorSources,
  };
}