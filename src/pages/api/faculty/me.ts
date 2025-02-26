import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };

    // Only allow faculty access
    if (decoded.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied: Not a faculty user' });
    }

    const faculty = await User.findOne({ userId: decoded.userId, role: 'faculty' });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    return res.status(200).json({ faculty });
  } catch (error: any) {
    console.error("Error verifying token or fetching faculty:", error);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
}
