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
    const filters = (0, pick_1.pick)(req.query, ['searchTerm', 'department', 'positionType', 'status']);
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
exports.AuthController = {
    register,
    login,
    getAllUsers
};
