import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApplicationService } from './Application.services';
import { IApplication } from './Application.interfaces';
import catchAsync from '../../shared/catchAsync';

const applyToPosition = catchAsync(async (req: Request, res: Response) => {
  // const applicationData: IApplication = {
  //   ...req.body,
  //   applicant: req.user?.userId
  // };
  const applicationData = req.body;
  const files = req.files as {
    cv: Express.Multer.File[];
    coverLetter?: Express.Multer.File[];
    certificates?: Express.Multer.File[];
  };

  console.log('applicationData', applicationData);
  console.log('files', files);
  //user id is coming from the token
  console.log('userId', req.user?.userId); 
  
  // const result = await ApplicationService.applyToPosition(applicationData);
  const result = await ApplicationService.applyToPosition(
    applicationData,
    files,
    req.user?.userId!
  );
  
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