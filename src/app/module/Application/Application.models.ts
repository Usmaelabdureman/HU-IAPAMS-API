import { Schema, model } from 'mongoose';
import { ApplicationStatus } from './Application.interfaces';

const applicationSchema = new Schema({
  position: { 
    type: Schema.Types.ObjectId, 
    ref: 'Position', 
    required: true 
  },
  applicant: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  documents: {
    cv: { type: String, required: true },
    coverLetter: { type: String },
    certificates: [{ type: String }]
  },
  status: { 
    type: String, 
    enum: Object.values(ApplicationStatus), 
    default: ApplicationStatus.PENDING 
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: Date
});

export const Application = model('Application', applicationSchema);