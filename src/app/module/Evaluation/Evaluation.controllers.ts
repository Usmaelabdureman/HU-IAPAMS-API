import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { EvaluationService } from './Evaluation.services';
import { IEvaluation } from './Evaluation.interfaces';
import catchAsync from '../../shared/catchAsync';

const createEvaluation = catchAsync(async (req: Request, res: Response) => {
  const evaluationData: IEvaluation = {
    ...req.body,
    evaluator: req.user?.userId
  };
  
  const result = await EvaluationService.createEvaluation(evaluationData);
  
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Evaluation created successfully',
    data: result
  });
});

const submitEvaluation = catchAsync(async (req: Request, res: Response) => {
  const result = await EvaluationService.submitEvaluation(
    req.params.id,
    req.user?.userId!,
    req.body
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Evaluation submitted successfully',
    data: result
  });
});

const getApplicationEvaluations = catchAsync(async (req: Request, res: Response) => {
  const result = await EvaluationService.getApplicationEvaluations(
    req.params.id
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Evaluations retrieved successfully',
    data: result
  });
});

export const EvaluationController = {
  createEvaluation,
  submitEvaluation,
  getApplicationEvaluations
};