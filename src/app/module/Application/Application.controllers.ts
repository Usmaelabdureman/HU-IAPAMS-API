import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApplicationService } from './Application.services';
import { IApplication } from './Application.interfaces';
import catchAsync from '../../shared/catchAsync';

const applyToPosition = catchAsync(async (req: Request, res: Response) => {
  const applicationData: IApplication = {
    ...req.body,
    applicant: req.user?.userId
  };
  
  const result = await ApplicationService.applyToPosition(applicationData);
  
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Application submitted successfully',
    data: result
  });
});

const getApplications = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const result = await ApplicationService.getApplications(
    req.user?.userId!,
    req.user?.role!,
    filters
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Applications retrieved successfully',
    data: result
  });
});

const withdrawApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplicationService.withdrawApplication(
    req.params.id,
    req.user?.userId!
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Application withdrawn successfully',
    data: result
  });
});

export const ApplicationController = {
  applyToPosition,
  getApplications,
  withdrawApplication
};