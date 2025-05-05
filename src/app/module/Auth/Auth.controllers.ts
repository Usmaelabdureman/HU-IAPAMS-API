import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthService } from './Auth.services';
import { ILoginRequest, IRegisterRequest } from './Auth.interfaces';
import catchAsync from '../../shared/catchAsync';
import { pick } from '../../utils/pick';
import { paginationFields } from '../../utils/paginationHelper';
import ApiError from '../../error/ApiError';


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


// Auth.controller.ts
const updateUser = catchAsync(async (req: Request, res: Response) :Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  const requesterId = req.user?.userId;

  if (!id) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'User ID is required',
    });
    return;
  }
  if (!id) {
    throw new Error('User ID is required');
  }
  if (!id) {
    throw new Error('User ID is required');
  }
  const result = await AuthService.updateUser( 
    req.params.userId, 
    req.body,
    req.user?.userId!,  
    req.user?.role!,   
    req.file  
  );

  res.status(httpStatus.OK).send({
    success: true,
    message: 'User updated successfully',
    data: result
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const requesterId = req.user?.userId;
  const requesterRole = req.user?.role;

  if (!requesterId || !requesterRole) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'Requester ID and role are required',
    });
    return;
  }

  const result = await AuthService.deleteUser(id, requesterId, requesterRole);

  res.status(httpStatus.OK).send({
    success: true,
    message: result.message
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.userId;

  const result = await AuthService.changePassword(userId!, currentPassword, newPassword);

  res.status(httpStatus.OK).send({
    success: true,
    message: result.message
  });
});


const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required');
  }

  const result = await AuthService.forgotPassword(email);

  res.status(httpStatus.OK).send({
    success: true,
    message: result.message
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Reset token and new password are required');
  }

  const result = await AuthService.resetPassword(resetToken, newPassword);

  res.status(httpStatus.OK).send({
    success: true,
    message: result.message
  });
});


// get me
const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await AuthService.getMe(userId!);

  res.status(httpStatus.OK).send({
    success: true,
    message: 'User retrieved successfully',
    data: result
  });
});


const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const updateData = req.body;
  // log users data
  console.log('User data:', updateData);
  // log user id
  console.log('User ID:', req.params.id);
  // log user role
  console.log('User role:', req.user?.role);
  // log user file
  console.log('User file:', req.file);
  

  if (typeof updateData.education === 'string') {
    updateData.education = JSON.parse(updateData.education);
  }
  if (typeof updateData.experience === 'string') {
    updateData.experience = JSON.parse(updateData.experience);
  }
  if (typeof updateData.skills === 'string') {
    updateData.skills = JSON.parse(updateData.skills);
  }

  const updatedUser = await AuthService.updateUser(
    req.params.id, 
    req.body,
    req.user?.userId!,    
    req.user?.role!,   
    req.file  
  );

  res.status(httpStatus.OK).send({
    success: true,
    data: updatedUser
  });
});


export const AuthController = {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile
};