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
exports.ApplicationService = void 0;
const Application_models_1 = require("./Application.models");
const Application_interfaces_1 = require("./Application.interfaces");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const applyToPosition = (applicationData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check existing application
    const existingApplication = yield Application_models_1.Application.findOne({
        position: applicationData.position,
        applicant: applicationData.applicant
    });
    if (existingApplication) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already applied to this position');
    }
    return Application_models_1.Application.create(applicationData);
});
const getApplications = (userId, role, filters) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {};
    if (role === 'staff') {
        query.applicant = userId;
    }
    else if (role === 'evaluator') {
        query.status = Application_interfaces_1.ApplicationStatus.UNDER_REVIEW;
    }
    if (filters.position) {
        query.position = filters.position;
    }
    return Application_models_1.Application.find(query)
        .populate('position', 'title department')
        .populate('applicant', 'username email');
});
const withdrawApplication = (applicationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield Application_models_1.Application.findOneAndUpdate({ _id: applicationId, applicant: userId }, { status: Application_interfaces_1.ApplicationStatus.WITHDRAWN }, { new: true });
    if (!application) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Application not found');
    }
    return application;
});
exports.ApplicationService = {
    applyToPosition,
    getApplications,
    withdrawApplication
};
