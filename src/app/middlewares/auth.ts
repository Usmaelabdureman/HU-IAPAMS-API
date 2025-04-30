// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import ApiError from '../error/ApiError';
import { ITokenPayload } from '../module/Auth/Auth.interfaces';
const JWT_ACCESS_SECRET="plCyCNec9l1L_HzcUEdhN7OQrUWgo3VO7C9-GQrnbvQ"
const JWT_REFRESH_SECRET="1cIsp1tlnEIMs9CabFPeR5jJ15kiYTZ2LiYCPZUUPpc"
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

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
export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log('Incoming headers:', req.headers);
      // console.log('Authorization header:', req.headers.authorization);

      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        console.error('No authorization header found');
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please provide a valid token');
      }

      if (!authHeader.startsWith('Bearer ')) {
        console.error('Invalid authorization format. Header:', authHeader);
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token format');
      }

      const token = authHeader.split(' ')[1];
      // console.log('Extracted token:', token);

      if (!token) {
        console.error('Token missing after Bearer prefix');
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please provide a valid token');
      }

      const verifiedUser = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as ITokenPayload;
      // console.log('Verified user:', verifiedUser);

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        console.error(
          `Role check failed. Required: ${requiredRoles}, Found: ${verifiedUser.role}`
        );
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      req.user = verifiedUser;
      // console.log('Authentication successful');
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      next(error);
    }
  };
};