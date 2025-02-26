import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import ScheduledLab from '@/models/ScheduledLab';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Notification from "@/models/Notification"; // Make sure to import this at top

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  // Verify JWT token from the Authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Only allow faculty and department head to schedule lab sessions.
  // if (decoded.role !== 'faculty' && decoded.role !== 'departmentHead') {
  //   return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  // }

  // Expect lab, date, startTime, endTime in the request body.
  const { lab, date, startTime, endTime } = req.body;
  if (!lab || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields: lab, date, startTime, endTime' });
  }

  try {
    // Look up the actual User document using the custom userId (e.g., "FTCSE01")
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // (Optional) Check if the lab is already booked during the requested time slot.
    // This assumes ScheduledLab has a static method "isLabAvailable" (see below).
    const overlappingSession = await (ScheduledLab as any).isLabAvailable(lab, new Date(date), startTime, endTime);
    if (overlappingSession) {
      return res.status(400).json({ message: 'Lab is busy during the selected time slot' });
    }

    // Create a new scheduled session.
    const scheduledSession = new ScheduledLab({
      lab: new mongoose.Types.ObjectId(lab), // convert lab id string to ObjectId
      date: new Date(date),
      startTime,
      endTime,
      bookedBy: user._id, // Use the user's actual ObjectId here
    });
    // After successfully saving the scheduled session:
    await scheduledSession.save();

    // Ensure that the session date is a valid Date:
    const sessionDate = new Date(scheduledSession.date);
    if (isNaN(sessionDate.getTime())) {
      console.error("Invalid session date:", scheduledSession.date);
    } else {
      const formattedDate = sessionDate.toLocaleDateString("en-GB"); // e.g., "28/02/2025"
      // If scheduledSession.lab is populated, use its name; otherwise, use its ID:
      const labName = scheduledSession.lab.name || scheduledSession.lab.toString();
      const notificationMessage = `Your lab session for lab ${labName} on ${formattedDate} has been booked.`;

      // Create a notification (example using Mongoose Notification model)
      const newNotification = new Notification({
        user: user._id,
        message: notificationMessage,
        type: "lab-booking",
      });
      await newNotification.save();
    }

    return res.status(201).json({ message: "Lab session scheduled successfully", scheduledSession });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
