// src/models/ScheduledLab.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IScheduledLab extends Document {
  lab: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  bookedBy: mongoose.Types.ObjectId;
  status: 'scheduled' | 'cancelled';
  createdAt: Date;
}

const ScheduledLabSchema: Schema<IScheduledLab> = new mongoose.Schema({
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['scheduled', 'cancelled'], default: 'scheduled' },
  createdAt: { type: Date, default: Date.now },
});

// Static method to check for overlapping sessions
ScheduledLabSchema.statics.isLabAvailable = async function (
  labId: string,
  date: Date,
  startTime: string,
  endTime: string
) {
  const labObjectId = new mongoose.Types.ObjectId(labId);
  return await this.findOne({
    lab: labObjectId,
    date: date,
    status: 'scheduled',
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  });
};

const ScheduledLab: Model<IScheduledLab> =
  mongoose.models.ScheduledLab ||
  mongoose.model<IScheduledLab>('ScheduledLab', ScheduledLabSchema);

export default ScheduledLab;
