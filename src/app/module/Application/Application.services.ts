import { Application } from './Application.models';
import { IApplication, ApplicationStatus } from './Application.interfaces';
import httpStatus from 'http-status';
import ApiError from '../../error/ApiError';

const applyToPosition = async (applicationData: IApplication) => {
  // Check existing application
  const existingApplication = await Application.findOne({
    position: applicationData.position,
    applicant: applicationData.applicant
  });

  if (existingApplication) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already applied to this position');
  }

  return Application.create(applicationData);
};

const getApplications = async (userId: string, role: string, filters: any) => {
  let query: any = {};

  if (role === 'staff') {
    query.applicant = userId;
  } else if (role === 'evaluator') {
    query.status = ApplicationStatus.UNDER_REVIEW;
  }

  if (filters.position) {
    query.position = filters.position;
  }

  return Application.find(query)
    .populate('position', 'title department')
    .populate('applicant', 'username email');
};

const withdrawApplication = async (applicationId: string, userId: string) => {
  const application = await Application.findOneAndUpdate(
    { _id: applicationId, applicant: userId },
    { status: ApplicationStatus.WITHDRAWN },
    { new: true }
  );

  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Application not found');
  }

  return application;
};

export const ApplicationService = {
  applyToPosition,
  getApplications,
  withdrawApplication
};