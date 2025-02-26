import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

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
  
  const { id } = req.query;
  
  // Ensure the user is valid.
  const user = await User.findOne({ userId: decoded.userId });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  if (req.method === 'GET') {
    try {
      const booking = await Booking.findById(id).populate('lab', 'name labId');
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      return res.status(200).json({ booking });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
      return res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedBooking = await Booking.findByIdAndDelete(id);
      if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
      return res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
