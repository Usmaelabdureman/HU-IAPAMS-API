import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { EvaluationController } from "./Evaluation.controllers";

const router = Router( );

router.post('/', auth('evaluator'), EvaluationController.createEvaluation);
router.patch('/:id', auth('evaluator'), EvaluationController.submitEvaluation);
router.get('/application/:id', auth('admin', 'evaluator'), EvaluationController.getApplicationEvaluations);
export const EvaluationRoutes = router