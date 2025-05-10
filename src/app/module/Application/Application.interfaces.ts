import { Types } from "mongoose";

// export interface IApplication {
//     position: string;
//     applicant: string;
//     documents: {
//       cv: string;
//       coverLetter?: string;
//       certificates?: string[];
//     };
//     status?: ApplicationStatus;

//   }
  
export interface IApplication extends Document {
  position: Types.ObjectId;
  applicant: Types.ObjectId;
  documents: {
    cv: string;
    coverLetter?: string;
    certificates?: string[];
  };
  evaluations: Evaluation[];
  status: string;
  averageScore?: number;
  appliedAt: Date;
}

 export interface EvaluationScores {
  experience: number;
  education: number;
  skills: number;
}

export interface Evaluation {
  evaluator: Types.ObjectId;
  scores: EvaluationScores;
  comments: string;
  submittedAt: Date;
}
  export enum ApplicationStatus {
    PENDING = 'pending',
    UNDER_REVIEW = 'under_review',
    SHORTLISTED = 'shortlisted',
    REJECTED = 'rejected',
    WITHDRAWN = 'withdrawn',
    ACCEPTED = 'accepted',
  }