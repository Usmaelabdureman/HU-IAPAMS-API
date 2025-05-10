// import mongoose, { Schema, Document } from 'mongoose';
// import bcrypt from 'bcrypt';
// import config from '../../config';

// export interface IUser extends Document {
//   username: string;
//   email: string;
//   password: string;
//   role: 'admin' | 'staff' | 'evaluator';
//   fullName?: string; 
//   status?: 'active' | 'inactive'; // Account status
//   lastLogin?: Date;
//   createdAt: Date;
//   updatedAt: Date;
//   phone?: string;
//   address?: string;
//   department?: string;
//   positionType?: string;
//   resetPasswordToken?: string;
//   resetPasswordExpires?: Date;
//   comparePassword(candidatePassword: string): Promise<boolean>;

// }

// const userSchema = new Schema<IUser>(
//   {
//     username: { type: String, required: true, unique: true, trim: true },
//     email: { type: String, required: true, unique: true, trim: true },
//     password: { type: String, required: true, select: false },
//     role: { 
//       type: String, 
//       required: true, 
//       enum: ['admin', 'staff', 'evaluator'] 
//     },
//     fullName: { type: String, required: function() { return this.role === 'staff'; } },
//     status: { type: String, enum: ['active', 'inactive'], default: 'active' },
//     lastLogin: { type: Date },
//     phone: { type: String },
//     address: { type: String },
//     department: { type: String },
//     positionType: { type: String },
//     resetPasswordToken: { type: String, select: false },
//     resetPasswordExpires: { type: Date , select: false },
//   },
//   { timestamps: true }
// );

// // Hash password before saving
// userSchema.pre<IUser>('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.salt_rounds)
//   );
//   next();
// });

// // Method to compare passwords
// userSchema.methods.comparePassword = async function(
//   candidatePassword: string
// ): Promise<boolean> {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// export const User = mongoose.model<IUser>('User', userSchema);

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';

// Sub-schemas
const educationSchema = new Schema({
  institution: { type: String },
  degree: { type: String },
  fieldOfStudy: { type: String },
  startYear: { type: Number },
  endYear: { type: Number },
  description: { type: String }
}, { _id: false });

const experienceSchema = new Schema({
  company: { type: String },
  position: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String }
}, { _id: false });

const skillSchema = new Schema({
  name: { type: String },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
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
      validate: {
        validator: function(value: any) {
          // Allow empty object, or object with linkedIn, twitter, github properties
          if (typeof value !== 'object' || value === null) return false;
          if (Array.isArray(value)) return false;
          return true;
        },
        message: 'Social media must be an object'
      }
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