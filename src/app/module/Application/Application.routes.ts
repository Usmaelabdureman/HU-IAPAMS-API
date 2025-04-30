import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { ApplicationController } from "../Application/Application.controllers";

const router = Router( );

router.post('/', auth('applicant'), ApplicationController.applyToPosition);
router.get('/', auth('applicant', 'evaluator', 'admin'), ApplicationController.getApplications);
router.patch('/:id/withdraw', auth('applicant'), ApplicationController.withdrawApplication);

export const ApplicationRoutes = router;