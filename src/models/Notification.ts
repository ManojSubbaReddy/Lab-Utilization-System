import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  type: "lab-booking" | "equipment-request";
  createdAt: Date;
  read: boolean;
}

const NotificationSchema: Schema<INotification> = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["lab-booking", "equipment-request"], required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
