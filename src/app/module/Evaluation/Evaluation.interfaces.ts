export interface IEvaluation {
    application: string;
    evaluator: string;
    scores?: {
      experience: number;
      education: number;
      skills: number;
    };
    comments?: string;
    decision?: EvaluationDecision;
  }
  
  export enum EvaluationDecision {
    RECOMMENDED = 'recommended',
    NOT_RECOMMENDED = 'not_recommended',
    PENDING = 'pending'
  }