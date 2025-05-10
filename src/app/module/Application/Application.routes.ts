import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { ApplicationController } from "../Application/Application.controllers";
import { applicationUpload } from "../../utils/multer";


const router = Router( );

router.post('/', auth('staff','evaluator'), applicationUpload,  ApplicationController.applyToPosition);
router.get('/', auth('staff', 'evaluator', 'admin'), ApplicationController.getApplications);
router.patch('/:id/withdraw', auth('staff','evaluator'), ApplicationController.withdrawApplication);
router.post('/:id/evaluate', auth('evaluator'), ApplicationController.submitEvaluation);
router.get('/:id', auth('staff','evaluator'), ApplicationController.getApplications);

export const ApplicationRoutes = router;