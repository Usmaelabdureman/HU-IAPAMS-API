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


// const updateProfile = catchAsync(async (req: Request, res: Response) => {
//   const updateData = req.body;
//   // log users data

  
//   if (typeof updateData.education === 'string') {
//     updateData.education = JSON.parse(updateData.education);
//   }
//   if (typeof updateData.experience === 'string') {
//     updateData.experience = JSON.parse(updateData.experience);
//   }
//   if (typeof updateData.skills === 'string') {
//     updateData.skills = JSON.parse(updateData.skills);
//   }

//   const updatedUser = await AuthService.updateUser(
//     req.params.id, 
//     { userId: req.user?.userId! } as IUpdateUserRequest,    
//     req.file  
//   );

//   res.status(httpStatus.OK).send({
//     success: true,
//     data: updatedUser
//   });
// });

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const updateData = req.body;
  
  // Parse stringified arrays if needed
  if (typeof updateData.education === 'string') {
    try {
      updateData.education = JSON.parse(updateData.education);
    } catch (e) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid education data format');
    }
  }
  
  if (typeof updateData.experience === 'string') {
    try {
      updateData.experience = JSON.parse(updateData.experience);
    } catch (e) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid experience data format');
    }
  }
  
  if (typeof updateData.skills === 'string') {
    try {
      updateData.skills = JSON.parse(updateData.skills);
    } catch (e) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid skills data format');
    }
  }

  // Handle socialMedia field
  if (updateData.socialMedia) {
    try {
      updateData.socialMedia = typeof updateData.socialMedia === 'string' ?
        JSON.parse(updateData.socialMedia) :
        updateData.socialMedia;
      
      // Ensure it's always an object
      if (typeof updateData.socialMedia !== 'object' || updateData.socialMedia === null) {
        updateData.socialMedia = {};
      }
    } catch (e) {
      updateData.socialMedia = {};
    }
  } else {
    updateData.socialMedia = {};
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