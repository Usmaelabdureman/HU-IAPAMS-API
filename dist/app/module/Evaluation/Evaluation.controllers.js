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
exports.EvaluationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Evaluation_services_1 = require("./Evaluation.services");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const createEvaluation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const evaluationData = Object.assign(Object.assign({}, req.body), { evaluator: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    const result = yield Evaluation_services_1.EvaluationService.createEvaluation(evaluationData);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: 'Evaluation created successfully',
        data: result
    });
}));
const submitEvaluation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield Evaluation_services_1.EvaluationService.submitEvaluation(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Evaluation submitted successfully',
        data: result
    });
}));
const getApplicationEvaluations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Evaluation_services_1.EvaluationService.getApplicationEvaluations(req.params.id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Evaluations retrieved successfully',
        data: result
    });
}));
exports.EvaluationController = {
    createEvaluation,
    submitEvaluation,
    getApplicationEvaluations
};
