import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEquipment extends Document {
  equipmentId: string;
  lab: mongoose.Types.ObjectId;
  name: string;
  specifications?: string;
  status: 'available' | 'maintenance' | 'unavailable';
  maintenanceHistory: {
    task: string;
    date: Date;
    performedBy?: mongoose.Types.ObjectId;
    notes?: string;
  }[];
  requests: {
    user: mongoose.Types.ObjectId;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: Date;
  }[];
  createdAt: Date;
}

const EquipmentSchema: Schema<IEquipment> = new mongoose.Schema({
  equipmentId: { type: String, unique: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  name: { type: String, required: true },
  specifications: { type: String },
  status: {
    type: String,
    enum: ['available', 'maintenance', 'unavailable'],
    default: 'available',
  },
  maintenanceHistory: [
    {
      task: String,
      date: Date,
      performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: String,
    },
  ],
  requests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: { type: String, required: true },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      requestedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Equipment: Model<IEquipment> =
  mongoose.models.Equipment || mongoose.model<IEquipment>('Equipment', EquipmentSchema);
export default Equipment;
