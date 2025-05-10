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
const getApplications = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    
    const applications = await ApplicationService.getApplications(
      req.user?.userId!,
      req.user?.role!,
      filters
    );

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
};

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


// submitevaluation

const submitEvaluation = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplicationService.submitEvaluation(
    req.params.id,
    req.user?.userId!,
    req.body.scores,
    req.body.comments
  );
 

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Evaluation submitted successfully',
    data: result
  });
});
export const ApplicationController = {
  applyToPosition,
  getApplications,
  withdrawApplication,
  submitEvaluation
};