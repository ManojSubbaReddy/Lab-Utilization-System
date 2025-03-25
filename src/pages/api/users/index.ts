import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };

    // Restrict access: Only allow ICTS-Lab Manager or admin (if applicable) to retrieve all users
    if (decoded.role !== 'ICTS-Lab Manager') {
      return res.status(403).json({ message: 'Access denied: Not authorized' });
    }

    // Fetch all users with role in the allowed set: student, faculty, and ICTS-Lab Manager
    const users = await User.find({
      role: { $in: ['student', 'faculty', 'ICTS-Lab Manager'] }
    });

    return res.status(200).json({ users });
  } catch (error: any) {
    console.error('Error verifying token or fetching users:', error);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
}
