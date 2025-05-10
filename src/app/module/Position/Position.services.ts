import { Position } from './Position.models';
import ApiError from '../../error/ApiError';
import httpStatus from 'http-status';
import { IPosition, IPositionFilters } from './Position.interfaces';
import * as paginationHelpers from '../../utils/paginationHelper';
import { User } from '../Auth/Auth.models';

// const createPosition = async (positionData: IPosition, userId: string) => {
//   // Add createdBy to the position data
//   const positionWithCreator = {
//     ...positionData,
//     createdBy: userId
//   };
  
//   return await Position.create(positionWithCreator);
// };
const createPosition = async (positionData: IPosition, userId: string) => {
  if (positionData.evaluators && positionData.evaluators.length > 0) {
    const evaluators = await User.find({
      _id: { $in: positionData.evaluators },
      role: 'evaluator'
    });
    
    if (evaluators.length !== positionData.evaluators.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'One or more evaluators are invalid');
    }
  }

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

// const updatePosition = async (id: string, updateData: Partial<IPosition>, userId: string) => {
//   const position = await Position.findById(id);
  
//   if (!position) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Position not found');
//   }

//   if (position.createdBy.toString() !== userId) {
//     throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this position');
//   }

//   Object.assign(position, updateData);
//   await position.save();
//   return position;
// };


const updatePosition = async (id: string, updateData: Partial<IPosition>, userId: string) => {
  const position = await Position.findById(id);
  if (!position) throw new ApiError(httpStatus.NOT_FOUND, 'Position not found');
  if (position.createdBy.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this position');
  }

  // Validate evaluators if being updated
  if (updateData.evaluators) {
    const evaluators = await User.find({
      _id: { $in: updateData.evaluators },
      role: 'evaluator'
    });
    
    if (evaluators.length !== updateData.evaluators.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'One or more evaluators are invalid');
    }
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