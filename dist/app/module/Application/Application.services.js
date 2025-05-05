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
const supabase_1 = require("../../utils/supabase");
const uploadFile = (file, userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}-${Date.now()}-${type}.${fileExt}`;
    const filePath = `applications/${userId}/${fileName}`;
    const { data, error } = yield supabase_1.supabase.storage
        .from('documents')
        .upload(filePath, file.buffer, {
        contentType: file.mimetype,
    });
    if (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'File upload failed');
    }
    // Get public URL
    const { data: { publicUrl } } = supabase_1.supabase.storage
        .from('documents')
        .getPublicUrl(data.path);
    return publicUrl;
});
const applyToPosition = (applicationData, files, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const existingApplication = yield Application_models_1.Application.findOne({
        position: applicationData.position,
        applicant: userId
    });
    if (existingApplication) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already applied to this position');
    }
    if (!((_a = files === null || files === void 0 ? void 0 : files.cv) === null || _a === void 0 ? void 0 : _a[0])) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'CV is required');
    }
    // Upload files
    const cvUrl = yield uploadFile(files.cv[0], userId, 'cv');
    let coverLetterUrl;
    let certificateUrls = [];
    if ((_b = files.coverLetter) === null || _b === void 0 ? void 0 : _b[0]) {
        coverLetterUrl = yield uploadFile(files.coverLetter[0], userId, 'cover-letter');
    }
    if (files.certificates) {
        for (const cert of files.certificates) {
            const url = yield uploadFile(cert, userId, 'certificate');
            certificateUrls.push(url);
        }
    }
    return Application_models_1.Application.create({
        position: applicationData.position,
        applicant: userId,
        documents: {
            cv: cvUrl,
            coverLetter: coverLetterUrl,
            certificates: certificateUrls
        },
        status: Application_interfaces_1.ApplicationStatus.PENDING
    });
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
    withdrawApplication,
    uploadFile
};
