export interface IApplication {
    position: string;
    applicant: string;
    documents: {
      cv: string;
      coverLetter?: string;
      certificates?: string[];
    };
    status?: ApplicationStatus;
  }
  
  export enum ApplicationStatus {
    PENDING = 'pending',
    UNDER_REVIEW = 'under_review',
    SHORTLISTED = 'shortlisted',
    REJECTED = 'rejected',
    WITHDRAWN = 'withdrawn'
  }