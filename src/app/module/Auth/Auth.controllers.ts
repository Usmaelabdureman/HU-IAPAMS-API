import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthService } from './Auth.services';
import { ILoginRequest, IRegisterRequest } from './Auth.interfaces';
import catchAsync from '../../shared/catchAsync';


const register = catchAsync(async (req: Request, res: Response) => {
  const userData: IRegisterRequest = req.body;
  const result = await AuthService.registerUser(userData);
  
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'User registered successfully',
    data: result
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const loginData: ILoginRequest = req.body;
  const result = await AuthService.loginUser(loginData);
  
  res.status(httpStatus.OK).send({
    success: true,
    message: 'User logged in successfully',
    data: result
  });
});

export const AuthController = {
  register,
  login
};