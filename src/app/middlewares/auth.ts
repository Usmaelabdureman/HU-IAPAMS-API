import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import ApiError from '../error/ApiError';

export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // Verify token
      const verifiedUser = jwt.verify(token, config.jwt_access_secret as string) as {
        userId: string;
        role: string;
      };

      // Check if user has required role
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      // Add user to request
    //   req.user = verifiedUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};