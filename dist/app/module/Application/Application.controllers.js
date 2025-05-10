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
exports.ApplicationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const Application_services_1 = require("./Application.services");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const applyToPosition = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // const applicationData: IApplication = {
    //   ...req.body,
    //   applicant: req.user?.userId
    // };
    const applicationData = req.body;
    const files = req.files;
    // const result = await ApplicationService.applyToPosition(applicationData);
    const result = yield Application_services_1.ApplicationService.applyToPosition(applicationData, files, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: 'Application submitted successfully',
        data: result
    });
}));
// const getApplications = catchAsync(async (req: Request, res: Response) => {
//   const filters = req.query;
//   const result = await ApplicationService.getApplications(
//     req.user?.userId!,
//     req.user?.role!,
//     filters
//   );
//   res.status(httpStatus.OK).json({
//     success: true,
//     message: 'Applications retrieved successfully',
//     data: result
//   });
// });
// In your controller
const getApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const filters = req.query;
        const applications = yield Application_services_1.ApplicationService.getApplications((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role, filters);
        res.status(200).json({
            success: true,
            data: applications
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications'
        });
    }
});
const withdrawApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield Application_services_1.ApplicationService.withdrawApplication(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Application withdrawn successfully',
        data: result
    });
}));
// submitevaluation
const submitEvaluation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield Application_services_1.ApplicationService.submitEvaluation(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body.scores, req.body.comments);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Evaluation submitted successfully',
        data: result
    });
}));
exports.ApplicationController = {
    applyToPosition,
    getApplications,
    withdrawApplication,
    submitEvaluation
};
