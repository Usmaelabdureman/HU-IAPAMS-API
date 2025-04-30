"use strict";
// import { Request, Response, NextFunction } from 'express';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
const auth = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            // Get token from header
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
            }
            // Verify token
            const verifiedUser = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
            // Check if user has required role (if any roles are specified)
            if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
            }
            // Add user to request
            req.user = verifiedUser;
            next();
        }
        catch (error) {
            next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired token'));
        }
    });
};
exports.auth = auth;
