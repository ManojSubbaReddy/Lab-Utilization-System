import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBooking extends Document {
  lab: mongoose.Types.ObjectId;        // Reference to a Lab document
  user: mongoose.Types.ObjectId;       // The user (student or faculty) who booked
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'cancelled';
  // For faculty bookings (optional)
  assignedStudents?: mongoose.Types.ObjectId[];
  attendance?: { student: mongoose.Types.ObjectId; present: boolean }[];
  createdAt: Date;
}

const BookingSchema: Schema<IBooking> = new mongoose.Schema({
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendance: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    present: { type: Boolean, default: false },
  }],
  createdAt: { type: Date, default: Date.now },
});

const Booking: Model<IBooking> = 
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
