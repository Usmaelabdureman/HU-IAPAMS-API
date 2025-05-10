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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Auth_services_1 = require("./Auth.services");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = require("../../utils/pick");
const paginationHelper_1 = require("../../utils/paginationHelper");
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const result = yield Auth_services_1.AuthService.registerUser(userData);
    res.status(http_status_1.default.CREATED).send({
        success: true,
        message: 'User registered successfully',
        data: result
    });
}));
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = req.body;
    const result = yield Auth_services_1.AuthService.loginUser(loginData);
    res.status(http_status_1.default.OK).send({
        success: true,
        message: 'User logged in successfully',
        data: result
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, ['searchTerm', 'department', 'positionType', 'status', 'role']);
    const paginationOptions = (0, pick_1.pick)(req.query, paginationHelper_1.paginationFields);
    const page = parseInt(paginationOptions.page, 10) || 1;
    const limit = parseInt(paginationOptions.limit, 10) || 10;
    const result = yield Auth_services_1.AuthService.getAllUsers(page, limit, filters);
    res.status(http_status_1.default.OK).send({
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.data
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (!id) {
        res.status(http_status_1.default.BAD_REQUEST).send({
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
    const result = yield Auth_services_1.AuthService.updateUser(req.params.userId, { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }, req.file);
    res.status(http_status_1.default.OK).send({
        success: true,
        message: 'User updated successfully',
        data: result
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const requesterId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const requesterRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    if (!requesterId || !requesterRole) {
        res.status(http_status_1.default.BAD_REQUEST).send({
            success: false,
            message: 'Requester ID and role are required',
        });
        return;
    }
    const result = yield Auth_services_1.AuthService.deleteUser(id, requesterId, requesterRole);
    res.status(http_status_1.default.OK).send({
        success: true,
        message: result.message
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { currentPassword, newPassword } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield Auth_services_1.AuthService.changePassword(userId, currentPassword, newPassword);
    res.status(http_status_1.default.OK).send({
        success: true,
        message: result.message
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email is required');
    }
    const result = yield Auth_services_1.AuthService.forgotPassword(email);
    res.status(http_status_1.default.OK).send({
        success: true,
        message: result.message
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Reset token and new password are required');
    }
    const result = yield Auth_services_1.AuthService.resetPassword(resetToken, newPassword);
    res.status(http_status_1.default.OK).send({
        success: true,
        message: result.message
    });
}));
// get me
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield Auth_services_1.AuthService.getMe(userId);
    res.status(http_status_1.default.OK).send({
        success: true,
        message: 'User retrieved successfully',
        data: result
    });
}));
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
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = req.body;
    // Parse stringified arrays if needed
    if (typeof updateData.education === 'string') {
        try {
            updateData.education = JSON.parse(updateData.education);
        }
        catch (e) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid education data format');
        }
    }
    if (typeof updateData.experience === 'string') {
        try {
            updateData.experience = JSON.parse(updateData.experience);
        }
        catch (e) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid experience data format');
        }
    }
    if (typeof updateData.skills === 'string') {
        try {
            updateData.skills = JSON.parse(updateData.skills);
        }
        catch (e) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid skills data format');
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
        }
        catch (e) {
            updateData.socialMedia = {};
        }
    }
    else {
        updateData.socialMedia = {};
    }
    const updatedUser = yield Auth_services_1.AuthService.updateUser(req.params.id, updateData, req.file);
    res.status(http_status_1.default.OK).send({
        success: true,
        data: updatedUser
    });
}));
exports.AuthController = {
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
