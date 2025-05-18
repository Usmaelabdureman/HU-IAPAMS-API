import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
const educationSchema = new Schema({
  institution: { type: String, default: null },
  degree: { type: String, default: null },
  fieldOfStudy: { type: String, default: null },
  startYear: { type: Number, default: null, min: 1900, max: new Date().getFullYear() },
  endYear: { 
    type: Number, 
    default: null,
    min: 1900,
    max: new Date().getFullYear(),
    validate: {
      validator: function(value: number): boolean {
        return !(this as any).startYear || value >= (this as any).startYear;
      },
      message: 'End year must be greater than or equal to start year'
    }
  },
  description: { type: String, default: null }
}, { _id: false });

const experienceSchema = new Schema({
  company: { type: String, default: null },
  position: { type: String, default: null },
  startDate: { type: Date, default: null },
  endDate: { 
    type: Date, 
    default: null,
    validate: {
      validator: function(this: any, value: Date): boolean {
        const parent = this.parent();
        return !parent.startDate || !value || value >= parent.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  current: { type: Boolean, default: false },
  description: { type: String, default: null }
}, { _id: false });

const skillSchema = new Schema({
  name: { type: String, default: null },
  level: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  }
}, { _id: false });
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'evaluator';
  fullName?: string;
  status?: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
  address?: string;
  department?: string;
  positionType?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // New fields
  profilePhoto?: string;
  bio?: string;
  education?: typeof educationSchema[];
  experience?: typeof experienceSchema[];
  skills?: typeof skillSchema[];
  socialMedia?: {
    linkedIn?: string;
    twitter?: string;
    github?: string;
  };
  website?: string;
  
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { 
      type: String, 
      required: true, 
      enum: ['admin', 'staff', 'evaluator'] 
    },
    fullName: { type: String, required: function() { return this.role === 'staff'; } },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date },
    phone: { type: String },
    address: { type: String },
    department: { type: String },
    positionType: { type: String },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    
    // New fields
    profilePhoto: { type: String },
    bio: { type: String },
    education: [educationSchema],
    experience: [experienceSchema],
    skills: [skillSchema],
      socialMedia: {
      type: Schema.Types.Mixed,
      default: {},
      linkedIn: { type: String },
      twitter: { type: String },
      github: { type: String }

    },
    website: { type: String }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(
    this.password,
    Number(config.salt_rounds)
  );
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);