import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthService } from './Auth.services';
import { ILoginRequest, IRegisterRequest } from './Auth.interfaces';
import catchAsync from '../../shared/catchAsync';
import { pick } from '../../utils/pick';
import { paginationFields } from '../../utils/paginationHelper';


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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'department', 'positionType', 'status']);
  const paginationOptions = pick(req.query, paginationFields);

  const page = parseInt(paginationOptions.page as string, 10) || 1;
  const limit = parseInt(paginationOptions.limit as string, 10) || 10;

  const result = await AuthService.getAllUsers(page, limit, filters);

  res.status(httpStatus.OK).send({
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

export const AuthController = {
  register,
  login,
  getAllUsers
};