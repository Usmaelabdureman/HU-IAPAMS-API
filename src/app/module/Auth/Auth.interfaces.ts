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
      status?: 'active' | 'inactive';
      lastLogin?: Date;
      phone?: string;
      address?: string;
      department?: string;
      positionType?: string;
      profilePhoto?: string;
      bio?: string;
      education?: IEducation[];
      experience?: IExperience[];
      skills?: ISkill[];
      socialMedia?: ISocialMedia;
      website?: string;
      
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

  
  export interface IEducation {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startYear: number;
    endYear?: number;
    description?: string;
  }
  
  export interface IExperience {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current?: boolean;
    description?: string;
  }
  
  export interface ISkill {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }
  
  export interface ISocialMedia {
    linkedIn?: string;
    twitter?: string;
    github?: string;
  }
  
  export interface IUpdateUserRequest {
    username?: string;
    email?: string;
    fullName?: string;
    phone?: string;
    address?: string;
    department?: string;
    positionType?: string;
    bio?: string;
    education?: IEducation[];
    experience?: IExperience[];
    skills?: ISkill[];
    socialMedia?: ISocialMedia;
    website?: string;
    role?: 'admin' | 'staff' | 'evaluator';
    status?: 'active' | 'inactive';
    profilePhoto?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;

  }