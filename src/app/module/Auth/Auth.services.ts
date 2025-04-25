import { User } from './Auth.models';
import { ILoginRequest, IRegisterRequest, IAuthResponse } from './Auth.interfaces';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../config';

interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}

const generateAuthTokens = async (user: any): Promise<{ accessToken: string; refreshToken: string }> => {
  const payload: ITokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  if (!config.jwt_access_secret || !config.jwt_refresh_secret) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT secrets are not configured');
  }

const accessToken = jwt.sign(
    payload,
    config.jwt_access_secret,
{   expiresIn:'1h'
}
  );
  
  const refreshToken = jwt.sign(
    payload,
    config.jwt_refresh_secret,
    { expiresIn: '7d' }
  );
  

  return { accessToken, refreshToken };
};

const registerUser = async (userData: IRegisterRequest): Promise<IAuthResponse> => {
  // Check if username or email already exists
  const existingUser = await User.findOne({ 
    $or: [
      { username: userData.username }, 
      { email: userData.email }
    ] 
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, 'Username or email already exists');
  }

  const user = await User.create(userData);
  const tokens = await generateAuthTokens(user);

  return {
    user: {
      _id: user.id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    },
    tokens
  };
};

const loginUser = async (loginData: ILoginRequest): Promise<IAuthResponse> => {
  const user = await User.findOne({ username: loginData.username }).select('+password');
  
  if (!user || !(await user.comparePassword(loginData.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username or password');
  }

  if (user.status !== 'active') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account is inactive');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const tokens = await generateAuthTokens(user);

  return {
    user: {
      _id: user.id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    },
    tokens
  };
};

const getAllUsers = async (
  page: number,
  limit: number,
  filters: { searchTerm?: string; department?: string; positionType?: string; status?: string }
): Promise<{ meta: { page: number; limit: number; total: number }; data: any[] }> => {
  const skip = (page - 1) * limit;

  // Build the query object based on filters
  const query: any = {};

  if (filters.searchTerm) {
    query.$or = [
      { username: { $regex: filters.searchTerm, $options: 'i' } },
      { email: { $regex: filters.searchTerm, $options: 'i' } },
      { fullName: { $regex: filters.searchTerm, $options: 'i' } }
    ];
  }

  if (filters.department) {
    query.department = filters.department;
  }

  if (filters.positionType) {
    query.positionType = filters.positionType;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  const users = await User.find(query).skip(skip).limit(limit);
  const total = await User.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: users
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  generateAuthTokens,
  getAllUsers
};