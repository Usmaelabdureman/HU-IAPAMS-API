import { User } from './Auth.models';
import { ILoginRequest, IRegisterRequest, IAuthResponse, IUpdateUserRequest, IEducation, IExperience, ISkill } from './Auth.interfaces';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../config';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../../shared/emailService';
import { supabase } from '../../utils/supabase';
import mongoose from 'mongoose';

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
// const updateUser = async (
//   userId: string,
//   updateData: IUpdateUserRequest,

//   profilePhoto?: Express.Multer.File
// ): Promise<any> => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }



//   // Handle profile photo upload
//   if (profilePhoto) {
//     const photoUrl = await uploadProfilePhoto(profilePhoto, userId);
//     updateData.profilePhoto = photoUrl;
//   }

//   // Handle array updates (education, experience, skills)
//   if (updateData.education) {
//     user.education = updateData.education as unknown as typeof user.education;
//     delete updateData.education;
//   }

//   if (updateData.experience) {
//     user.experience = updateData.experience as unknown as typeof user.experience;
//     delete updateData.experience;
//   }

//   if (updateData.skills) {
//     user.skills = updateData.skills as unknown as typeof user.skills;
//     delete updateData.skills;
//   }


//   Object.assign(user, updateData);
//   await user.save();

//   return user;
// };

// const updateUser = async (
//   userId: string,
//   updateData: IUpdateUserRequest,
//   profilePhoto?: Express.Multer.File
// ): Promise<any> => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // Handle profile photo upload
//   if (profilePhoto) {
//     const photoUrl = await uploadProfilePhoto(profilePhoto, userId);
//     updateData.profilePhoto = photoUrl;
//   }

//   // Handle array updates
//   if (updateData.education) {
//     user.education = Array.isArray(updateData.education) ? 
//       updateData.education.map(edu => new mongoose.Schema(edu)) : 
//       [];
//     delete updateData.education;
//   }

//   if (updateData.experience) {
//     user.experience = Array.isArray(updateData.experience) ? 
//       updateData.experience.map(exp => new mongoose.Schema(exp)) : 
//       [];
//     delete updateData.experience;
//   }

//   if (updateData.skills) {
//     user.skills = Array.isArray(updateData.skills) ? 
//       updateData.skills.map(skill => new mongoose.Schema(skill)) : 
//       [];
//     delete updateData.skills;
//   }

//   // Handle socialMedia - ensure it's always an object
//   if (updateData.socialMedia) {
//     user.socialMedia = typeof updateData.socialMedia === 'object' && 
//                       !Array.isArray(updateData.socialMedia) && 
//                       updateData.socialMedia !== null ?
//       updateData.socialMedia :
//       {};
//     delete updateData.socialMedia;
//   }

//   // Update other fields
//   Object.assign(user, updateData);
  
//   try {
//     await user.save();
//     return user;
//   } catch (error) {
//     // Handle validation errors gracefully
//     if (error instanceof mongoose.Error.ValidationError) {
//       const messages = Object.values(error.errors).map(err => err.message);
//       throw new ApiError(httpStatus.BAD_REQUEST, messages.join(', '));
//     }
//     throw error;
//   }
// };
const updateUser = async (
  userId: string,
  updateData: IUpdateUserRequest,
  profilePhoto?: Express.Multer.File
): Promise<any> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Handle profile photo upload
  if (profilePhoto) {
    const photoUrl = await uploadProfilePhoto(profilePhoto, userId);
    updateData.profilePhoto = photoUrl;
  }

  // Handle array updates - CORRECTED IMPLEMENTATION
  if (updateData.education !== undefined) {
    user.set('education', Array.isArray(updateData.education)
      ? updateData.education.map(edu => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          fieldOfStudy: edu.fieldOfStudy || '',
          startYear: edu.startYear ? Number(edu.startYear) : undefined,
          endYear: edu.endYear ? Number(edu.endYear) : undefined,
          description: edu.description || ''
        }))
      : []
    );
    delete updateData.education;
  }

  if (updateData.experience !== undefined) {
    user.set('experience', Array.isArray(updateData.experience)
      ? updateData.experience.map(exp => ({
          company: exp.company || '',
          position: exp.position || '',
          startDate: exp.startDate ? new Date(exp.startDate) : undefined,
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          current: !!exp.current,
          description: exp.description || ''
        }))
      : []
    );
    delete updateData.experience;
  }

  if (updateData.skills !== undefined) {
    user.set('skills', Array.isArray(updateData.skills) ? 
      updateData.skills.map(skill => ({
        name: skill.name || '',
        level: skill.level || 'beginner'
      })) : 
      []);
    delete updateData.skills;
  }

  // Handle socialMedia - ensure it's always an object
  if (updateData.socialMedia !== undefined) {
    user.socialMedia = typeof updateData.socialMedia === 'object' && 
                      !Array.isArray(updateData.socialMedia) && 
                      updateData.socialMedia !== null ?
      updateData.socialMedia :
      {};
    delete updateData.socialMedia;
  }

  // Update other fields
  (Object.keys(updateData) as (keyof IUpdateUserRequest)[]).forEach(key => {
    if (updateData[key] !== undefined) {
      (user as any)[key] = updateData[key];
    }
  });
  
  try {
    await user.save();
    return user;
  } catch (error) {
    // Handle validation errors gracefully
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(httpStatus.BAD_REQUEST, messages.join(', '));
    }
    throw error;
  }
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
  filters: { searchTerm?: string; department?: string; role?:string, positionType?: string; status?: string }
): Promise<{ meta: { page: number; limit: number; total: number }; data: any[] }> => {
  const skip = (page - 1) * limit;

  // Build the query object based on filters
  const query: any = {};

  if (filters.searchTerm) {
    query.$or = [
      { username: { $regex: filters.searchTerm, $options: 'i' } },
      { email: { $regex: filters.searchTerm, $options: 'i' } },
      { fullName: { $regex: filters.searchTerm, $options: 'i' } },
      { department: { $regex: filters.searchTerm, $options: 'i' } },
      { positionType: { $regex: filters.searchTerm, $options: 'i' } },
      { status: { $regex: filters.searchTerm, $options: 'i' } }

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
  if (filters.role) {
    query.role = filters.role;
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

const deleteUsers = async (
  userIds: string[],
  requesterId: string,
  requesterRole: string,
  password?: string
): Promise<{ message: string }> => {
  // If password is required for admin bulk deletion (optional security measure)
  if (requesterRole === 'admin' && password) {
    const adminUser = await User.findById(requesterId).select('+password');
    if (!adminUser || !(await adminUser.comparePassword(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }
  }

  const users = await User.find({ _id: { $in: userIds } });
  if (users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found');
  }

  // Check authorization
  if (requesterRole !== 'admin') {
    // Non-admin can only delete themselves if their ID is in the list
    if (!userIds.includes(requesterId) || userIds.length > 1) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete these users');
    }
  }

  // Perform deletion
  await User.deleteMany({ _id: { $in: userIds } });

  return { message: `${userIds.length} user(s) deleted successfully` };
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
  permanentlyDeleteUser,
  deleteUsers
};