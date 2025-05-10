import mongoose, { Schema, Document, mongo } from 'mongoose';

export interface IPosition extends Document {
  title: string;
  description: string;
  department: string;
  positionType: string;
  requirements: string[];
  deadline: Date;
  status: 'open' | 'closed' | 'filled';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  evaluators: mongoose.Types.ObjectId[];

}

const positionSchema = new Schema<IPosition>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  positionType: { type: String, required: true },
  requirements: { type: [String], required: true },
  deadline: { type: Date, required: true },
  evaluators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['open', 'closed', 'filled'], default: 'open' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Position = mongoose.model<IPosition>('Position', positionSchema);