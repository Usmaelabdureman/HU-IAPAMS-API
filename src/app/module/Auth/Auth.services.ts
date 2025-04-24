// import { User } from './Auth.models';
// import { ILoginRequest, IRegisterRequest, IAuthResponse } from './Auth.interfaces';
// import ApiError from '../../error/ApiError';
// import httpStatus from 'http-status';
// import jwt from 'jsonwebtoken';
// import config from '../../config';

// const registerUser = async (userData: IRegisterRequest): Promise<IAuthResponse> => {
//   // Check if username or email already exists
//   if (await User.findOne({ $or: [{ username: userData.username }, { email: userData.email }] })) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Username or email already exists');
//   }

//   const user = await User.create(userData);
  
//   // Generate tokens
//   const tokens = await generateAuthTokens(user);

//   return {
//     user: {
//       _id: user._id as string,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//       fullName: user.fullName
//     },
//     tokens
//   };
// };

// const loginUser = async (loginData: ILoginRequest): Promise<IAuthResponse> => {
//   const user = await User.findOne({ username: loginData.username }).select('+password');
  
//   if (!user || !(await user.comparePassword(loginData.password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect username or password');
//   }

//   if (user.status !== 'active') {
//     throw new ApiError(httpStatus.FORBIDDEN, 'Account is inactive');
//   }

//   // Update last login
//   user.lastLogin = new Date();
//   await user.save();

//   // Generate tokens
//   const tokens = await generateAuthTokens(user);

//   return {
//     user: {
//       _id: user._id as string,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//       fullName: user.fullName
//     },
//     tokens
//   };
// };


// const jwtPayload = {
//     id: user.id,
//     email: user.email,
//     role: user.role,
//     password_changed_at: passwordChangedTime,
//   };

//   const accessToken = generateToken(
//     jwtPayload,
//     config.jwt_access_secret,
//     config.jwt_access_expires_in
//   );

//   const accessToken = jwt.sign(
//     payload,
//     config.jwt_access_secret as string,
//     { expiresIn: config.jwt_access_expires_in || '1h' }
    
//   );

//   const refreshToken = jwt.sign(
//     payload,
//     config.jwt_refresh_secret as string,
//     { expiresIn: config.jwt_refresh_expires_in || '7d' }
//   );

//   return { accessToken, refreshToken };
// };

// export const AuthService = {
//   registerUser,
//   loginUser
// };
import { User } from './Auth.models';
import { ILoginRequest, IRegisterRequest, IAuthResponse } from './Auth.interfaces';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../../config';

const generateAuthTokens = async (user: any) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(
    payload,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in || '1h' }
  );

  const refreshToken = jwt.sign(
    payload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expires_in || '7d' }
  );

  return { accessToken, refreshToken };
};

const registerUser = async (userData: IRegisterRequest): Promise<IAuthResponse> => {
  // Check if username or email already exists
  if (await User.findOne({ $or: [{ username: userData.username }, { email: userData.email }] })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username or email already exists');
  }

  const user = await User.create(userData);
  
  // Generate tokens
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

  // Generate tokens
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

export const AuthService = {
  registerUser,
  loginUser,
  generateAuthTokens
};