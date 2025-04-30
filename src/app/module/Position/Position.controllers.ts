// Position.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PositionService } from './Position.services';
import catchAsync from '../../shared/catchAsync';
import { pick } from '../../utils/pick';
import { IPositionFilters } from './Position.interfaces';
import { paginationFields } from '../../utils/paginationHelper';
import ApiError from '../../error/ApiError';

// Extend the Request interface to include the user property
interface CustomRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

const createPosition = catchAsync(async (req: CustomRequest, res: Response) => {
  const positionData = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
  }

  const result = await PositionService.createPosition(positionData, userId);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Position created successfully',
    data: result,
  });
});

const getAllPositions = catchAsync(async (req: CustomRequest, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'department', 'positionType', 'status']) as IPositionFilters;
  const paginationOptions = pick(req.query, paginationFields);

  const result = await PositionService.getAllPositions(filters, paginationOptions);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Positions retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getPositionById = catchAsync(async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const result = await PositionService.getPositionById(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Position retrieved successfully',
    data: result,
  });
});

const updatePosition = catchAsync(async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
  }

  const result = await PositionService.updatePosition(id, updateData, userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Position updated successfully',
    data: result,
  });
});

const closePosition = catchAsync(async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
  }

  const result = await PositionService.closePosition(id, userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Position closed successfully',
    data: result,
  });
});

export const PositionController = {
  createPosition,
  getAllPositions,
  getPositionById,
  updatePosition,
  closePosition,
};