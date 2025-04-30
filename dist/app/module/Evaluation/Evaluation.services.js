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
exports.EvaluationService = void 0;
const Evaluation_models_1 = require("./Evaluation.models");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../error/ApiError"));
const createEvaluation = (evaluationData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEvaluation = yield Evaluation_models_1.Evaluation.findOne({
        application: evaluationData.application,
        evaluator: evaluationData.evaluator
    });
    if (existingEvaluation) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Evaluation already exists');
    }
    return Evaluation_models_1.Evaluation.create(evaluationData);
});
const submitEvaluation = (evaluationId, evaluatorId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluation = yield Evaluation_models_1.Evaluation.findOneAndUpdate({ _id: evaluationId, evaluator: evaluatorId }, updateData, { new: true });
    if (!evaluation) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Evaluation not found');
    }
    return evaluation;
});
const getApplicationEvaluations = (applicationId) => __awaiter(void 0, void 0, void 0, function* () {
    return Evaluation_models_1.Evaluation.find({ application: applicationId })
        .populate('evaluator', 'username email role');
});
exports.EvaluationService = {
    createEvaluation,
    submitEvaluation,
    getApplicationEvaluations
};
