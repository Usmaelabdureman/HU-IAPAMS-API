"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionService = void 0;
const Position_models_1 = require("./Position.models");
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelpers = __importStar(require("../../utils/paginationHelper"));
const createPosition = (positionData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    positionData.createdBy = userId;
    return yield Position_models_1.Position.create(positionData);
});
const getAllPositions = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip } = paginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value
            }))
        });
    }
    const whereConditions = andConditions.length ? { $and: andConditions } : {};
    const result = yield Position_models_1.Position.find(whereConditions)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = yield Position_models_1.Position.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const getPositionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Position_models_1.Position.findById(id).populate('createdBy', 'username email');
});
const updatePosition = (id, updateData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const position = yield Position_models_1.Position.findById(id);
    if (!position) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Position not found');
    }
    if (position.createdBy.toString() !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update this position');
    }
    Object.assign(position, updateData);
    yield position.save();
    return position;
});
const closePosition = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const position = yield Position_models_1.Position.findById(id);
    if (!position) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Position not found');
    }
    if (position.createdBy.toString() !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to close this position');
    }
    position.status = 'closed';
    yield position.save();
    return position;
});
exports.PositionService = {
    createPosition,
    getAllPositions,
    getPositionById,
    updatePosition,
    closePosition
};
