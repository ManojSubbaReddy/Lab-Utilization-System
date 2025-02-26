// src/models/Lab.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILab extends Document {
  labId: string;
  name: string;
  location: string;    // Allowed values: AB1, AB2, AB3
  labIncharge: mongoose.Types.ObjectId; // Reference to a User
  capacity: number;
  assignedClasses: [{ type: String }];
  equipment: mongoose.Types.ObjectId[];
  schedule: {
    date: Date;
    startTime: string;
    endTime: string;
    booked?: boolean;
    bookingRef?: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
}

const LabSchema: Schema<ILab> = new mongoose.Schema({
  labId: { type: String, unique: true },
  name: { type: String, required: true },
  location: { type: String, enum: ['AB1', 'AB2', 'AB3'], required: true },
  labIncharge: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  capacity: { type: Number, required: true },
  equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }],
  schedule: [
    {
      date: Date,
      startTime: String,
      endTime: String,
      booked: { type: Boolean, default: false },
      bookingRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Lab: Model<ILab> =
  mongoose.models.Lab || mongoose.model<ILab>('Lab', LabSchema);
export default Lab;
