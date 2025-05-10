"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Auth_models_1 = require("./Auth.models");
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../../shared/emailService");
const supabase_1 = require("../../utils/supabase");
const mongoose_1 = __importDefault(require("mongoose"));
const generateAuthTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
    };
    if (!config_1.default.jwt_access_secret || !config_1.default.jwt_refresh_secret) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'JWT secrets are not configured');
    }
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_access_secret, { expiresIn: '1h'
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_refresh_secret, { expiresIn: '7d' });
    return { accessToken, refreshToken };
});
// Add this helper function
const uploadProfilePhoto = (file, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${userId}-profile-${Date.now()}.${fileExt}`;
        const filePath = `profile-photos/${userId}/${fileName}`;
        const { data, error } = yield supabase_1.supabase.storage
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
        const { data: { publicUrl } } = supabase_1.supabase.storage
            .from('profile-photos')
            .getPublicUrl(data.path);
        return publicUrl;
    }
    catch (err) {
        console.error('Profile photo upload error:', err);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Profile photo upload failed');
    }
});
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
const updateUser = (userId, updateData, profilePhoto) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_models_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Handle profile photo upload
    if (profilePhoto) {
        const photoUrl = yield uploadProfilePhoto(profilePhoto, userId);
        updateData.profilePhoto = photoUrl;
    }
    // Handle array updates
    if (updateData.education) {
        user.education = Array.isArray(updateData.education) ?
            updateData.education.map(edu => new mongoose_1.default.Schema(edu)) :
            [];
        delete updateData.education;
    }
    if (updateData.experience) {
        user.experience = Array.isArray(updateData.experience) ?
            updateData.experience.map(exp => new mongoose_1.default.Schema(exp)) :
            [];
        delete updateData.experience;
    }
    if (updateData.skills) {
        user.skills = Array.isArray(updateData.skills) ?
            updateData.skills.map(skill => new mongoose_1.default.Schema(skill)) :
            [];
        delete updateData.skills;
    }
    // Handle socialMedia - ensure it's always an object
    if (updateData.socialMedia) {
        user.socialMedia = typeof updateData.socialMedia === 'object' &&
            !Array.isArray(updateData.socialMedia) &&
            updateData.socialMedia !== null ?
            updateData.socialMedia :
            {};
        delete updateData.socialMedia;
    }
    // Update other fields
    Object.assign(user, updateData);
    try {
        yield user.save();
        return user;
    }
    catch (error) {
        // Handle validation errors gracefully
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            const messages = Object.values(error.errors).map(err => err.message);
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, messages.join(', '));
        }
        throw error;
    }
});
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield Auth_models_1.User.findOne({
        $or: [
            { username: userData.username },
            { email: userData.email }
        ]
    });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Username or email already exists');
    }
    const user = yield Auth_models_1.User.create(userData);
    const tokens = yield generateAuthTokens(user);
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
            education: user.education ? user.education : undefined,
            experience: user.experience ? user.experience : undefined,
            skills: user.skills ? user.skills : undefined,
            socialMedia: user.socialMedia,
            website: user.website
        },
        tokens
    };
});
const loginUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_models_1.User.findOne({ username: loginData.username }).select('+password');
    if (!user || !(yield user.comparePassword(loginData.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect username or password');
    }
    if (user.status !== 'active') {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Account is inactive');
    }
    // Update last login
    user.lastLogin = new Date();
    yield user.save();
    const tokens = yield generateAuthTokens(user);
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
            education: user.education ? user.education : undefined,
            experience: user.experience ? user.experience : undefined,
            skills: user.skills ? user.skills : undefined,
            socialMedia: user.socialMedia,
        },
        tokens
    };
});
const getAllUsers = (page, limit, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    // Build the query object based on filters
    const query = {};
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
    const users = yield Auth_models_1.User.find(query).skip(skip).limit(limit);
    const total = yield Auth_models_1.User.countDocuments(query);
    return {
        meta: {
            page,
            limit,
            total
        },
        data: users
    };
});
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
const deleteUser = (userId, requesterId, requesterRole) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_models_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (requesterRole !== 'admin' && requesterId !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Not authorized to delete this user');
    }
    // Soft delete
    // user.status = 'inactive';
    // await user.save();
    yield user.deleteOne();
    return { message: 'User deleted successfully' };
});
// permanently delete user
const permanentlyDeleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_models_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield user.deleteOne();
    return { message: 'User deleted successfully' };
});
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_models_1.User.findById(userId).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (!(yield user.comparePassword(currentPassword))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Current password is incorrect');
    }
    user.password = newPassword;
    yield user.save();
    return { message: 'Password changed successfully' };
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_models_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found with this email');
    }
    // Generate reset token
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + Number(config_1.default.reset_password_expire) * 60 * 1000);
    yield user.save({ validateBeforeSave: false });
    const resetUrl = `${config_1.default.client_url}/reset-password/${resetToken}`;
    try {
        yield (0, emailService_1.sendPasswordResetEmail)(user, resetUrl);
        return { message: 'Password reset email sent successfully' };
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'There was an error sending the email. Please try again later.');
    }
});
const resetPassword = (resetToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Hash token to compare with what's in DB
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    const user = yield Auth_models_1.User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password reset token is invalid or has expired');
    }
    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    yield user.save();
    return { message: 'Password reset successfully' };
});
//  get me 
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_models_1.User.findById(userId).select('-password');
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
exports.AuthService = {
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
