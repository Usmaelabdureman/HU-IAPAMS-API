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
exports.PositionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Position_services_1 = require("./Position.services");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const pick_1 = require("../../utils/pick");
const paginationHelper_1 = require("../../utils/paginationHelper");
const createPosition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const positionData = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'User ID is required',
        });
        return;
    }
    const result = yield Position_services_1.PositionService.createPosition(positionData, userId);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: 'Position created successfully',
        data: result,
    });
}));
const getAllPositions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, ['searchTerm', 'department', 'positionType', 'status']);
    const paginationOptions = (0, pick_1.pick)(req.query, paginationHelper_1.paginationFields);
    const result = yield Position_services_1.PositionService.getAllPositions(filters, paginationOptions);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Positions retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getPositionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield Position_services_1.PositionService.getPositionById(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Position retrieved successfully',
        data: result,
    });
}));
const updatePosition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const updateData = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'User ID is required',
        });
        return;
    }
    const result = yield Position_services_1.PositionService.updatePosition(id, updateData, userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Position updated successfully',
        data: result,
    });
}));
const closePosition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'User ID is required',
        });
        return;
    }
    const result = yield Position_services_1.PositionService.closePosition(id, userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Position closed successfully',
        data: result,
    });
}));
exports.PositionController = {
    createPosition,
    getAllPositions,
    getPositionById,
    updatePosition,
    closePosition,
};
