
// import mongoose, { Document, Model, Schema } from 'mongoose';

// export interface IEquipment extends Document {
//   equipmentId: string;
//   lab: mongoose.Types.ObjectId;
//   name: string;
//   specifications?: string;
//   status: 'available' | 'maintenance' | 'unavailable';
//   maintenanceHistory: {
//     task: string;
//     date: Date;
//     performedBy?: mongoose.Types.ObjectId;
//     notes?: string;
//   }[];
//   requests: {
//     user: mongoose.Types.ObjectId;
//     reason: string;
//     status: 'pending' | 'approved' | 'rejected' | 'forwarded'; // Added forwarded status
//     requestedAt: Date;
//     forwardedBy?: mongoose.Types.ObjectId; // Optional: who forwarded the request
//     forwardedAt?: Date; // Optional: when the request was forwarded
//   }[];
//   createdAt: Date;
// }

// const EquipmentSchema: Schema<IEquipment> = new mongoose.Schema({
//   equipmentId: { type: String, unique: true },
//   lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
//   name: { type: String, required: true },
//   specifications: { type: String },
//   status: {
//     type: String,
//     enum: ['available', 'maintenance', 'unavailable'],
//     default: 'available',
//   },
//   maintenanceHistory: [
//     {
//       task: String,
//       date: Date,
//       performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       notes: String,
//     },
//   ],
//   requests: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       reason: { type: String, required: true },
//       status: { type: String, enum: ['pending', 'approved', 'rejected', 'forwarded'], default: 'pending' },
//       requestedAt: { type: Date, default: Date.now },
//       forwardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional
//       forwardedAt: { type: Date }, // Optional
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
// });

// const Equipment: Model<IEquipment> =
//   mongoose.models.Equipment || mongoose.model<IEquipment>('Equipment', EquipmentSchema);
// export default Equipment;


import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the Equipment interface
export interface IEquipment extends Document {
  equipmentId: string;
  lab: mongoose.Types.ObjectId;
  name: string;
  availableCount:number;
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
    status: 'pending' | 'approved' | 'rejected' | 'forwarded'; // Added forwarded status
    requestedAt: Date;
    forwardedBy?: mongoose.Types.ObjectId; // Optional: who forwarded the request
    forwardedAt?: Date; // Optional: when the request was forwarded
  }[];
  createdAt: Date;
}

// Define the Equipment schema
const EquipmentSchema: Schema<IEquipment> = new mongoose.Schema(
  {
    equipmentId: { type: String/*, unique: true, required: true */},
    lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
    name: { type: String, required: true },
    availableCount:{type:Number,required:true},
    specifications: { type: String },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'unavailable'],
      default: 'available',
    },
    maintenanceHistory: [
      {
        task: { type: String, required: true },
        date: { type: Date, required: true },
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notes: { type: String },
      },
    ],
    requests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reason: { type: String, required: true },
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected', 'forwarded'],
          default: 'pending',
        },
        requestedAt: { type: Date, default: Date.now },
        forwardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional
        forwardedAt: { type: Date }, // Optional
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Define the Equipment model, populating the lab reference when queried
const Equipment: Model<IEquipment> =
  mongoose.models.Equipment || mongoose.model<IEquipment>('Equipment', EquipmentSchema);

export default Equipment;
