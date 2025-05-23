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
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = req.body;
    // Clean up the update data
    if (updateData.education) {
        updateData.education = updateData.education.map((edu) => ({
            institution: edu.institution || null,
            degree: edu.degree || null,
            fieldOfStudy: edu.fieldOfStudy || null,
            startYear: edu.startYear ? parseInt(edu.startYear) : null,
            endYear: edu.endYear ? parseInt(edu.endYear) : null,
            description: edu.description || null
        })).filter((edu) => edu.institution || edu.degree || edu.fieldOfStudy ||
            edu.startYear || edu.endYear || edu.description);
    }
    if (updateData.experience) {
        updateData.experience = updateData.experience.map((exp) => ({
            company: exp.company || null,
            position: exp.position || null,
            startDate: exp.startDate || null,
            endDate: exp.endDate || null,
            current: !!exp.current,
            description: exp.description || null
        })).filter((exp) => exp.company || exp.position || exp.startDate ||
            exp.endDate || exp.description);
    }
    if (updateData.skills) {
        updateData.skills = updateData.skills.map((skill) => ({
            name: skill.name || null,
            level: skill.level || 'beginner'
        })).filter((skill) => skill.name);
    }
    // Handle socialMedia (your current implementation is fine)
    if (updateData.socialMedia === '') {
        updateData.socialMedia = {};
    }
    else if (typeof updateData.socialMedia === 'string') {
        try {
            updateData.socialMedia = JSON.parse(updateData.socialMedia);
        }
        catch (_a) {
            updateData.socialMedia = {};
        }
    }
    const updatedUser = yield Auth_services_1.AuthService.updateUser(req.params.id, updateData, req.file);
    res.status(http_status_1.default.OK).send({
        success: true,
        data: updatedUser
    });
}));
const deleteUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { ids } = req.body;
    const requesterId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const requesterRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    const password = req.headers['x-delete-password'];
    if (!requesterId || !requesterRole) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Requester ID and role are required');
    }
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User IDs are required and must be an array');
    }
    const result = yield Auth_services_1.AuthService.deleteUsers(ids, requesterId, requesterRole, password);
    res.status(http_status_1.default.OK).send({
        success: true,
        message: result.message
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
    updateProfile,
    deleteUsers
};
