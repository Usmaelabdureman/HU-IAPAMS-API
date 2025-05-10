import mongoose, { Document } from 'mongoose';

export interface IPosition extends Document {
  title: string;
  description: string;
  department: string;
  positionType: string;
  requirements: string[];
  deadline: Date;
  status: 'open' | 'closed' | 'filled';
  createdBy: string;
  evaluators: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPositionFilters {
  searchTerm?: string;
  department?: string;
  positionType?: string;
  status?: string;
}

export interface IPositionCreate {
  title: string;
  description: string;
  department: string;
  positionType: string;
  requirements: string[];
  deadline: Date;
}

export interface IPositionUpdate {
  title?: string;
  description?: string;
  department?: string;
  positionType?: string;
  requirements?: string[];
  deadline?: Date;
  status?: 'open' | 'closed' | 'filled';
}

export interface IPositionResponse {
  success: boolean;
  message: string;
  data?: any;
}