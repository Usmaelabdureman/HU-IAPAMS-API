import { Position } from './Position.models';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';
import { IPosition, IPositionFilters } from './Position.interfaces';
import * as paginationHelpers from '../../utils/paginationHelper';

const createPosition = async (positionData: IPosition, userId: string) => {
  // Add createdBy to the position data
  const positionWithCreator = {
    ...positionData,
    createdBy: userId
  };
  
  return await Position.create(positionWithCreator);
};

const getAllPositions = async (filters: IPositionFilters, paginationOptions: any) => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip } = paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  
  if (searchTerm) {
    andConditions.push({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value
      }))
    });
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const result = await Position.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Position.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total
    },
    data: result
  };
};

const getPositionById = async (id: string) => {
  return await Position.findById(id).populate('createdBy', 'username email');
};

const updatePosition = async (id: string, updateData: Partial<IPosition>, userId: string) => {
  const position = await Position.findById(id);
  
  if (!position) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Position not found');
  }

  if (position.createdBy.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this position');
  }

  Object.assign(position, updateData);
  await position.save();
  return position;
};

const closePosition = async (id: string, userId: string) => {
  const position = await Position.findById(id);
  
  if (!position) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Position not found');
  }

  if (position.createdBy.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to close this position');
  }

  position.status = 'closed';
  await position.save();
  return position;
};

export const PositionService = {
  createPosition,
  getAllPositions,
  getPositionById,
  updatePosition,
  closePosition
};