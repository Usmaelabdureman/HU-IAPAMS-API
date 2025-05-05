import { User } from './Auth.models';
import { ILoginRequest, IRegisterRequest, IAuthResponse, IUpdateUserRequest, IEducation, IExperience, ISkill } from './Auth.interfaces';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../config';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../shared/emailService';
import { supabase } from '../../utils/supabase';

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


// Add this helper function
const uploadProfilePhoto = async (file: Express.Multer.File, userId: string) => {
  try {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}-profile-${Date.now()}.${fileExt}`;
    const filePath = `profile-photos/${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Profile photo upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (err) {
    console.error('Profile photo upload error:', err);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Profile photo upload failed');
  }
};

// Update the updateUser function
const updateUser = async (
  userId: string,
  updateData: IUpdateUserRequest,
  requesterId: string,
  requesterRole: string,
  profilePhoto?: Express.Multer.File
): Promise<any> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Only allow users to update their own profile or admins to update any profile
  // if (requesterRole !== 'admin' && requesterId !== userId) {
  //   throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this user');
  // }

  // Handle profile photo upload
  if (profilePhoto) {
    const photoUrl = await uploadProfilePhoto(profilePhoto, userId);
    updateData.profilePhoto = photoUrl;
  }

  // Handle array updates (education, experience, skills)
  if (updateData.education) {
    user.education = updateData.education as unknown as typeof user.education;
    delete updateData.education;
  }

  if (updateData.experience) {
    user.experience = updateData.experience as unknown as typeof user.experience;
    delete updateData.experience;
  }

  if (updateData.skills) {
    user.skills = updateData.skills as unknown as typeof user.skills;
    delete updateData.skills;
  }

  // Prevent role modification for non-admins
  // if (updateData.role && requesterRole !== 'admin') {
  //   throw new ApiError(httpStatus.FORBIDDEN, 'Only admins can modify roles');
  // }

  // Prevent status modification for non-admins
  // if (updateData.status && requesterRole !== 'admin') {
  //   throw new ApiError(httpStatus.FORBIDDEN, 'Only admins can modify status');
  // }

  Object.assign(user, updateData);
  await user.save();

  return user;
};
const registerUser = async (userData: IRegisterRequest): Promise<IAuthResponse> => {
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
      fullName: user.fullName,
      department: user.department,
      positionType: user.positionType,
      status: user.status,
      lastLogin: user.lastLogin,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profilePhoto,
      bio: user.bio,
      education: user.education ? (user.education as unknown as IEducation[]) : undefined,
      experience: user.experience ? (user.experience as unknown as IExperience[]) : undefined,
      skills: user.skills ? (user.skills as unknown as ISkill[]) : undefined,
      socialMedia: user.socialMedia,
      website: user.website

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
      fullName: user.fullName,
      department: user.department,
      positionType: user.positionType,
      status: user.status,
      lastLogin: user.lastLogin,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profilePhoto,
      bio: user.bio,
      education: user.education ? (user.education as unknown as IEducation[]) : undefined,
      experience: user.experience ? (user.experience as unknown as IExperience[]) : undefined,
      skills: user.skills ? (user.skills as unknown as ISkill[]) : undefined,
      socialMedia: user.socialMedia,
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


// const updateUser = async (
//   userId: string,
//   updateData: IUpdateUserRequest,
//   requesterId: string,
//   requesterRole: string
// ): Promise<any> => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

 
//   if (requesterRole !== 'admin' && requesterId !== userId) {
//     throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this user');
//   }

//   if (updateData.email || updateData.username) {
//     const existingUser = await User.findOne({
//       $or: [
//         { email: updateData.email },
//         { username: updateData.username }
//       ],
//       _id: { $ne: userId }
//     });

//     if (existingUser) {
//       throw new ApiError(httpStatus.CONFLICT, 'Email or username already exists');
//     }
//   }

//   // Prevent role modification for non-admins
//   if (updateData.role && requesterRole !== 'admin') {
//     throw new ApiError(httpStatus.FORBIDDEN, 'Only admins can modify roles');
//   }

//   Object.assign(user, updateData);
//   await user.save();

//   return {
//     _id: user.id.toString(),
//     username: user.username,
//     email: user.email,
//     role: user.role,
//     fullName: user.fullName,
//     status: user.status
//   };
// };

const deleteUser = async (
  userId: string,
  requesterId: string,
  requesterRole: string
): Promise<{ message: string }> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (requesterRole !== 'admin' && requesterId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this user');
  }

  // Soft delete
  // user.status = 'inactive';
  // await user.save();
  await user.deleteOne();

  return { message: 'User deleted successfully' };
};

// permanently delete user
const permanentlyDeleteUser = async (userId: string): Promise<{ message: string }> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  await user.deleteOne();
  return { message: 'User deleted successfully' };
}


const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};



const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found with this email');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordExpires = new Date(Date.now() + Number(config.reset_password_expire) * 60 * 1000);

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${config.client_url}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail(user, resetUrl);
    return { message: 'Password reset email sent successfully' };
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'There was an error sending the email. Please try again later.'
    );
  }
};

const resetPassword = async (resetToken: string, newPassword: string): Promise<{ message: string }> => {
  // Hash token to compare with what's in DB
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password reset token is invalid or has expired');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return { message: 'Password reset successfully' };
};


//  get me 

const getMe = async (userId: string): Promise<any> => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
}



export const AuthService = {
  registerUser,
  loginUser,
  generateAuthTokens,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
  permanentlyDeleteUser
};