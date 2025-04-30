import { Evaluation } from './Evaluation.models';
import { IEvaluation, EvaluationDecision } from './Evaluation.interfaces';
import httpStatus from 'http-status';
import ApiError from '../../error/ApiError';

const createEvaluation = async (evaluationData: IEvaluation) => {
  const existingEvaluation = await Evaluation.findOne({
    application: evaluationData.application,
    evaluator: evaluationData.evaluator
  });

  if (existingEvaluation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Evaluation already exists');
  }

  return Evaluation.create(evaluationData);
};

const submitEvaluation = async (
  evaluationId: string,
  evaluatorId: string,
  updateData: Partial<IEvaluation>
) => {
  const evaluation = await Evaluation.findOneAndUpdate(
    { _id: evaluationId, evaluator: evaluatorId },
    updateData,
    { new: true }
  );

  if (!evaluation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Evaluation not found');
  }

  return evaluation;
};

const getApplicationEvaluations = async (applicationId: string) => {
  return Evaluation.find({ application: applicationId })
    .populate('evaluator', 'username email role');
};

export const EvaluationService = {
  createEvaluation,
  submitEvaluation,
  getApplicationEvaluations
};