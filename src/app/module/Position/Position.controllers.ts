// import { Request, Response } from 'express';
// import httpStatus from 'http-status';
// import { PositionService } from './Position.services';
// import catchAsync from '../../shared/catchAsync';
// import { pick } from '../../utils/pick';
// import { paginationFields } from '../../utils/paginationHelper';

// // Extend the Request interface to include the user property
// interface CustomRequest extends Request {
//   user?: {
//     userId: string;
//   };
// }

// const createPosition = catchAsync(async (req: CustomRequest, res: Response) => {
//   const positionData = req.body;
//   const userId = req.user
//   console.log('User ID:', userId);
//   console.log('body:',req.body) // Log the userId for debugging

//   if (!userId) {
//     res.status(httpStatus.BAD_REQUEST).json({
//       success: false,
//       message: 'User ID is required',
//     });
//     return;
//   }

//   const result = await PositionService.createPosition(positionData, userId);

//   res.status(httpStatus.CREATED).json({
//     success: true,
//     message: 'Position created successfully',
//     data: result,
//   });
// });

// const getAllPositions = catchAsync(async (req: Request, res: Response) => {
//   const filters = pick(req.query, ['searchTerm', 'department', 'positionType', 'status']);
//   const paginationOptions = pick(req.query, paginationFields);

//   const result = await PositionService.getAllPositions(filters, paginationOptions);

//   res.status(httpStatus.OK).json({
//     success: true,
//     message: 'Positions retrieved successfully',
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const getPositionById = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;

//   const result = await PositionService.getPositionById(id);

//   res.status(httpStatus.OK).json({
//     success: true,
//     message: 'Position retrieved successfully',
//     data: result,
//   });
// });

// const updatePosition = catchAsync(async (req: CustomRequest, res: Response) => {
//   const id = req.params.id;
//   const updateData = req.body;
//   const userId = req.user?.userId;

//   if (!userId) {
//     res.status(httpStatus.BAD_REQUEST).json({
//       success: false,
//       message: 'User ID is required',
//     });
//     return;
//   }

//   const result = await PositionService.updatePosition(id, updateData, userId);

//   res.status(httpStatus.OK).json({
//     success: true,
//     message: 'Position updated successfully',
//     data: result,
//   });
// });

// const closePosition = catchAsync(async (req: CustomRequest, res: Response) => {
//   const id = req.params.id;
//   const userId = req.user?.userId;

//   if (!userId) {
//     res.status(httpStatus.BAD_REQUEST).json({
//       success: false,
//       message: 'User ID is required',
//     });
//     return;
//   }

//   const result = await PositionService.closePosition(id, userId);

//   res.status(httpStatus.OK).json({
//     success: true,
//     message: 'Position closed successfully',
//     data: result,
//   });
// });

// export const PositionController = {
//   createPosition,
//   getAllPositions,
//   getPositionById,
//   updatePosition,
//   closePosition,
// };

// Position.controller.ts
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { PositionService } from './Position.services';
import ApiError from '../../error/ApiError';

const createPosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
    }
    
    const positionData = req.body;
    const result = await PositionService.createPosition(positionData, req.user.userId);
    res.status(httpStatus.CREATED).send(result);
  } catch (error) {
    next(error);
  }
};

const getAllPositions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const paginationOptions = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10
    };
    const result = await PositionService.getAllPositions(filters, paginationOptions);
    res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
};

const getPositionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await PositionService.getPositionById(id);
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Position not found');
    }
    res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
};

const updatePosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
    }
    
    const { id } = req.params;
    const updateData = req.body;
    const result = await PositionService.updatePosition(id, updateData, req.user.userId);
    res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
};

const closePosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
    }
    
    const { id } = req.params;
    const result = await PositionService.closePosition(id, req.user.userId);
    res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
};

export const PositionController = {
  createPosition,
  getAllPositions,
  getPositionById,
  updatePosition,
  closePosition
};