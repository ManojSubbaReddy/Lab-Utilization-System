import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Booking from '@/models/Booking';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Look up user (for both students and faculty)
  const user = await User.findOne({ userId: decoded.userId });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (req.method === 'GET') {
    try {
      const bookings = await Booking.find({ user: user._id }).populate('lab', 'name labId');
      return res.status(200).json({ bookings });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { lab, date, startTime, endTime, assignedStudents } = req.body;
      // For student bookings, assignedStudents will be empty. For faculty bookings, they may add IDs.
      const newBooking = new Booking({
        lab,
        user: user._id,
        date: new Date(date),
        startTime,
        endTime,
        assignedStudents: assignedStudents || [],
      });
      await newBooking.save();
      return res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
