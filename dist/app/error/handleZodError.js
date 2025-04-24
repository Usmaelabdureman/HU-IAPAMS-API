"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const errorSources = err.issues.map((issue) => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));
    let message = "Validation Error";
    if (errorSources === null || errorSources === void 0 ? void 0 : errorSources.length) {
        message = errorSources.map((item) => item.message).join(" | ");
    }
    const statusCode = 400;
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.default = handleZodError;
