"use strict";
// import { Request, Response } from 'express';
// import httpStatus from 'http-status';
// import { PositionService } from './Position.services';
// import catchAsync from '../../shared/catchAsync';
// import { pick } from '../../utils/pick';
// import { paginationFields } from '../../utils/paginationHelper';
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
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const createPosition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Not authenticated');
        }
        const positionData = req.body;
        const result = yield Position_services_1.PositionService.createPosition(positionData, req.user.userId);
        res.status(http_status_1.default.CREATED).send(result);
    }
    catch (error) {
        next(error);
    }
});
const getAllPositions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query;
        const paginationOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        };
        const result = yield Position_services_1.PositionService.getAllPositions(filters, paginationOptions);
        res.status(http_status_1.default.OK).send(result);
    }
    catch (error) {
        next(error);
    }
});
const getPositionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield Position_services_1.PositionService.getPositionById(id);
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Position not found');
        }
        res.status(http_status_1.default.OK).send(result);
    }
    catch (error) {
        next(error);
    }
});
const updatePosition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Not authenticated');
        }
        const { id } = req.params;
        const updateData = req.body;
        const result = yield Position_services_1.PositionService.updatePosition(id, updateData, req.user.userId);
        res.status(http_status_1.default.OK).send(result);
    }
    catch (error) {
        next(error);
    }
});
const closePosition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Not authenticated');
        }
        const { id } = req.params;
        const result = yield Position_services_1.PositionService.closePosition(id, req.user.userId);
        res.status(http_status_1.default.OK).send(result);
    }
    catch (error) {
        next(error);
    }
});
exports.PositionController = {
    createPosition,
    getAllPositions,
    getPositionById,
    updatePosition,
    closePosition
};
