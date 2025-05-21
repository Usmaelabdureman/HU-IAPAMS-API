import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AuthService } from './Auth.services';
import { ILoginRequest, IRegisterRequest, IUpdateUserRequest } from './Auth.interfaces';
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
  const filters = pick(req.query, ['searchTerm', 'department', 'positionType', 'status', 'role']);
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


const updateUser = catchAsync(async (req: Request, res: Response) :Promise<void> => {
  const { id } = req.params;


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

    { userId: req.user?.userId! } as IUpdateUserRequest,  
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
  
  // Clean up the update data
  if (updateData.education) {
    updateData.education = updateData.education.map((edu: { institution: any; degree: any; fieldOfStudy: any; startYear: string; endYear: string; description: any; }) => ({
      institution: edu.institution || null,
      degree: edu.degree || null,
      fieldOfStudy: edu.fieldOfStudy || null,
      startYear: edu.startYear ? parseInt(edu.startYear) : null,
      endYear: edu.endYear ? parseInt(edu.endYear) : null,
      description: edu.description || null
    })).filter((edu: { institution: any; degree: any; fieldOfStudy: any; startYear: any; endYear: any; description: any; }) => 
      edu.institution || edu.degree || edu.fieldOfStudy || 
      edu.startYear || edu.endYear || edu.description
    );
  }

  if (updateData.experience) {
    updateData.experience = updateData.experience.map((exp: { company: any; position: any; startDate: any; endDate: any; current: any; description: any; }) => ({
      company: exp.company || null,
      position: exp.position || null,
      startDate: exp.startDate || null,
      endDate: exp.endDate || null,
      current: !!exp.current,
      description: exp.description || null
    })).filter((exp: { company: any; position: any; startDate: any; endDate: any; description: any; }) => 
      exp.company || exp.position || exp.startDate || 
      exp.endDate || exp.description
    );
  }

  if (updateData.skills) {
    updateData.skills = updateData.skills.map((skill: { name: any; level: any; }) => ({
      name: skill.name || null,
      level: skill.level || 'beginner'
    })).filter((skill: { name: any; }) => skill.name);
  }

  // Handle socialMedia (your current implementation is fine)
  if (updateData.socialMedia === '') {
    updateData.socialMedia = {};
  } else if (typeof updateData.socialMedia === 'string') {
    try {
      updateData.socialMedia = JSON.parse(updateData.socialMedia);
    } catch {
      updateData.socialMedia = {};
    }
  }

  const updatedUser = await AuthService.updateUser(
    req.params.id, 
    updateData,    
    req.file  
  );

  res.status(httpStatus.OK).send({
    success: true,
    data: updatedUser
  });
});


const deleteUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { ids } = req.body;
  const requesterId = req.user?.userId;
  const requesterRole = req.user?.role;
  const password = req.headers['x-delete-password'] as string;

  if (!requesterId || !requesterRole) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Requester ID and role are required');
  }

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User IDs are required and must be an array');
  }

  const result = await AuthService.deleteUsers(ids, requesterId, requesterRole, password);

  res.status(httpStatus.OK).send({
    success: true,
    message: result.message
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
  updateProfile,
  deleteUsers
};