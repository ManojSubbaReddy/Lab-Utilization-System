// src/models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'ICTS-Lab Manager' | 'Technical Staff';
  department: string;
  lastLoggedIn: {
    type: Date,
    default: null, // or Date.now if you want to initialize it
  },
  academicDetails?: {
    year?: number;
    courses?: string[];
    subjects?: string[];
    cgpa?: number;
  };
  profile: {
    name: string;        // now required for all users
    designation?: string; // optional field for faculty
  };
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  userId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "faculty", "ICTS-Lab Manager", "Technical Staff"],
    required: true,
  },
  department: { type: String, required: true },
  academicDetails: {
    year: {
      type: Number,
      required: function (this: IUser) {
        return this.role === 'student';
      },
    },
    courses: [String],
    cgpa: {
      type: Number,
      required: function (this: IUser) {
        return this.role === 'student';
      },
    },
  },
  profile: {
    name: { type: String, required: true },
    designation: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to generate a custom userId (e.g., FTCSE01 for a faculty member)
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.userId) {
    const prefixMap: Record<string, string> = {
      "student": "ST",
      "faculty": "FT",
      "ICTS-Lab Manager": "ILM",
      "Technical Staff": "TS",
    };
    
   
    const prefix = prefixMap[this.role];
    const deptCode = this.department.toUpperCase();
    // Count existing users with the same role and department
    const count = await this.constructor.countDocuments({
      role: this.role,
      department: this.department,
    });
    const counter = (count + 1).toString().padStart(2, '0');
    this.userId = `${prefix}${deptCode}${counter}`;
  }
  next();
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
