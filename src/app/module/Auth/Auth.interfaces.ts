export interface ILoginRequest {
    username: string;
    password: string;
  }
  
  export interface IRegisterRequest {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'staff' | 'evaluator';
    fullName?: string;
    department?: string;
    positionType?: string;
    status?: 'active' | 'inactive';

    phone?: string;
    address?: string;

    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
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
    email:string;
  }

  export interface JwtPayload {
    userId:string;
  }
  export interface IUpdateUserRequest {
    role: boolean;
    username?: string;
    email?: string;
    fullName?: string;
    department?: string;
    positionType?: string;
    status?: 'active' | 'inactive';
  }
  