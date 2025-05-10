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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = exports.submitEvaluation = void 0;
const Application_models_1 = require("./Application.models");
const Application_interfaces_1 = require("./Application.interfaces");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const supabase_1 = require("../../utils/supabase");
const Position_models_1 = require("../Position/Position.models");
const mongoose_1 = __importStar(require("mongoose"));
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
    try {
        let query = {};
        // console.log(`Fetching applications for ${role} ${userId}`); // Debug
        if (role === 'staff') {
            query.applicant = new mongoose_1.default.Types.ObjectId(userId);
        }
        else if (role === 'evaluator') {
            const evaluatorId = new mongoose_1.default.Types.ObjectId(userId);
            // Debug: Check position assignments
            const assignedPositions = yield Position_models_1.Position.find({ evaluators: evaluatorId }, { _id: 1 });
            // console.log('Assigned positions:', assignedPositions);
            if (!assignedPositions.length) {
                // console.log('No positions assigned to evaluator');
                return [];
            }
            query.position = {
                $in: assignedPositions.map(p => p._id)
            };
            query.status = { $in: [Application_interfaces_1.ApplicationStatus.PENDING, Application_interfaces_1.ApplicationStatus.UNDER_REVIEW, Application_interfaces_1.ApplicationStatus.ACCEPTED, Application_interfaces_1.ApplicationStatus.REJECTED, Application_interfaces_1.ApplicationStatus.SHORTLISTED] };
        }
        if (filters.position) {
            query.position = new mongoose_1.default.Types.ObjectId(filters.position);
        }
        // console.log('Final query:', JSON.stringify(query)); // Debug
        const applications = yield Application_models_1.Application.find(query)
            .populate({
            path: 'position',
            select: 'title department evaluators',
            populate: {
                path: 'evaluators',
                select: 'username email'
            }
        })
            .populate('applicant', 'username email')
            .populate({
            path: 'evaluations.evaluator',
            select: 'username email'
        });
        // console.log('Found applications:', applications.length); // Debug
        return applications;
    }
    catch (error) {
        console.error('Error in getApplications:', error);
        throw error;
    }
});
const withdrawApplication = (applicationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield Application_models_1.Application.findOneAndUpdate({ _id: applicationId, applicant: userId }, { status: Application_interfaces_1.ApplicationStatus.WITHDRAWN }, { new: true });
    if (!application) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Application not found');
    }
    return application;
});
// export const submitEvaluation = async (
//   applicationId: string,
//   evaluatorId: string,
//   scores: { experience: number; education: number; skills: number },
//   comments: string
// ) => {
// // debug
// console.log('submitEvaluation called with:', {
//   applicationId,
//   evaluatorId,
//   scores,
//   comments
// });
//   // 1. Verify evaluator is assigned to this position
//   const application = await Application.findById(applicationId).populate('position');
//   if (!application) throw new ApiError(404, 'Application not found');
//   const position = await Position.findById(application.position);
//   if (!position?.evaluators?.includes(new mongoose.Types.ObjectId(evaluatorId))) {
//     throw new ApiError(403, 'Not authorized to evaluate this application');
//   }
//   // 2. Add/update evaluation
//   const evaluationIndex = application.evaluations.findIndex(
//     (e) => e?.evaluator!.toString() === evaluatorId
//   );
//   const evaluationData = {
//     evaluator: new mongoose.Types.ObjectId(evaluatorId),
//     scores,
//     comments,
//     submittedAt: new Date()
//   };
//   if (evaluationIndex === -1) {
//     application.evaluations.push(evaluationData);
//   } else {
//     application.evaluations[evaluationIndex].set(evaluationData);
//   }
//   // 3. Calculate average score
//   const avgScore = calculateAverageScore(application.evaluations);
//   application.averageScore = avgScore;
//   // 4. Auto-decide if all evaluators submitted
//   if (position.evaluators.length === application.evaluations.length) {
//     application.status = avgScore >= 7 ? ApplicationStatus.ACCEPTED : ApplicationStatus.REJECTED;
//   }
//   await application.save();
//   return application;
// };
// Helper function
const calculateAverageScore = (evaluations) => {
    if (evaluations.length === 0)
        return 0;
    const total = evaluations.reduce((sum, evaluation) => {
        return sum + (evaluation.scores.experience + evaluation.scores.education + evaluation.scores.skills) / 3;
    }, 0);
    return total / evaluations.length;
};
const submitEvaluation = (applicationId, evaluatorId, scores, comments) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1. Get application with properly typed population
        const application = yield Application_models_1.Application.findById(applicationId)
            .populate({
            path: 'position',
            select: 'evaluators'
        })
            .session(session);
        if (!application) {
            throw new ApiError_1.default(404, 'Application not found');
        }
        // 2. Verify evaluator with proper typing
        const evaluatorObjectId = new mongoose_1.Types.ObjectId(evaluatorId);
        const isEvaluator = application.position.evaluators.some(evaluator => evaluator.equals(evaluatorObjectId));
        if (!isEvaluator) {
            throw new ApiError_1.default(403, 'Not authorized to evaluate this application');
        }
        // 3. Update or add evaluation with proper typing
        const evaluationIndex = application.evaluations.findIndex(e => e.evaluator && e.evaluator.equals(evaluatorObjectId));
        const evaluationData = {
            evaluator: evaluatorObjectId,
            scores,
            comments,
            submittedAt: new Date()
        };
        if (evaluationIndex === -1) {
            application.evaluations.push(evaluationData);
        }
        else {
            application.evaluations[evaluationIndex].set(evaluationData);
        }
        // 4. Calculate average score
        application.averageScore = calculateAverageScore(application.evaluations);
        // 5. Check completion and update status
        const allEvaluatorIds = application.position.evaluators.map(e => e.toString());
        const evaluatedIds = application.evaluations.map(e => e.evaluator.toString());
        const allEvaluated = allEvaluatorIds.some(id => evaluatedIds.includes(id));
        if (allEvaluated) {
            application.status = application.averageScore >= 7 ?
                Application_interfaces_1.ApplicationStatus.ACCEPTED :
                Application_interfaces_1.ApplicationStatus.REJECTED;
        }
        yield application.save({ session });
        yield session.commitTransaction();
        return application;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.submitEvaluation = submitEvaluation;
exports.ApplicationService = {
    applyToPosition,
    getApplications,
    withdrawApplication,
    uploadFile,
    submitEvaluation: exports.submitEvaluation,
    calculateAverageScore
};
