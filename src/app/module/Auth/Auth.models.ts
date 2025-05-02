import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'applicant' | 'evaluator';
  fullName?: string; // Only for applicants
  status?: 'active' | 'inactive'; // Account status
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
  address?: string;
  department?: string;
  positionType?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
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
      enum: ['admin', 'applicant', 'evaluator'] 
    },
    fullName: { type: String, required: function() { return this.role === 'applicant'; } },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date },
    phone: { type: String },
    address: { type: String },
    department: { type: String },
    positionType: { type: String },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date , select: false },
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