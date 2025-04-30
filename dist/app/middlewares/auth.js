"use strict";
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
const JWT_ACCESS_SECRET = "plCyCNec9l1L_HzcUEdhN7OQrUWgo3VO7C9-GQrnbvQ";
const JWT_REFRESH_SECRET = "1cIsp1tlnEIMs9CabFPeR5jJ15kiYTZ2LiYCPZUUPpc";
// export const auth = (...requiredRoles: string[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Get token from header
//       const authHeader = req.headers.authorization;
//       if (!authHeader || !authHeader.startsWith('bearer ')) {
//         throw new ApiError(httpStatus.UNAUTHORIZED, 'Please provide a valid token');
//       }
//       const token = authHeader.split(' ')[1];
//       if (!token) {
//         throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//       }
//       // Verify token with better error handling
//       let verifiedUser;
//       try {
//         verifiedUser = jwt.verify(
//           token, 
//           JWT_ACCESS_SECRET
//         ) as {
//           userId: string;
//           email: string;
//           role: string;
//         };
//       } catch (verifyError) {
//         if (verifyError instanceof jwt.TokenExpiredError) {
//           throw new ApiError(httpStatus.UNAUTHORIZED, 'Token expired');
//         } else if (verifyError instanceof jwt.JsonWebTokenError) {
//           throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
//         } else {
//           throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed');
//         }
//       }
//       // Check if user has required role (if any roles are specified)
//       if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
//         throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
//       }
//       // Add user to request
//       req.user = verifiedUser;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };
// auth.middleware.ts
const auth = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('Incoming headers:', req.headers);
            console.log('Authorization header:', req.headers.authorization);
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                console.error('No authorization header found');
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please provide a valid token');
            }
            if (!authHeader.startsWith('Bearer ')) {
                console.error('Invalid authorization format. Header:', authHeader);
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token format');
            }
            const token = authHeader.split(' ')[1];
            console.log('Extracted token:', token);
            if (!token) {
                console.error('Token missing after Bearer prefix');
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please provide a valid token');
            }
            const verifiedUser = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
            console.log('Verified user:', verifiedUser);
            if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
                console.error(`Role check failed. Required: ${requiredRoles}, Found: ${verifiedUser.role}`);
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
            }
            req.user = verifiedUser;
            console.log('Authentication successful');
            next();
        }
        catch (error) {
            console.error('Authentication error:', error);
            next(error);
        }
    });
};
exports.auth = auth;
