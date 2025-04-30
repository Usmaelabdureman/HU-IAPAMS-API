import { Schema, model } from 'mongoose';

const evaluationSchema = new Schema({
  application: { 
    type: Schema.Types.ObjectId, 
    ref: 'Application', 
    required: true 
  },
  evaluator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  scores: {
    experience: { type: Number, min: 0, max: 10 },
    education: { type: Number, min: 0, max: 10 },
    skills: { type: Number, min: 0, max: 10 }
  },
  comments: String,
  decision: {
    type: String,
    enum: ['recommended', 'not_recommended', 'pending'],
    default: 'pending'
  },
  evaluatedAt: { type: Date, default: Date.now }
});

export const Evaluation = model('Evaluation', evaluationSchema);