export interface ILoginRequest {
    username: string;
    password: string;
  }
  
  export interface IRegisterRequest {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'applicant' | 'evaluator';
    fullName?: string;
  }
  
  export interface IAuthResponse {
    user: {
      _id: string;
      username: string;
      email: string;
      role: string;
      fullName?: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
  
  export interface ITokenPayload {
    userId: string;
    role: string;
  }