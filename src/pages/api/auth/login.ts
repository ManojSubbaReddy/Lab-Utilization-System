import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Use userId instead of email for login
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ message: 'Missing userID or password' });
  }

  try {
    // Find the user by userID
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Prepare the payload for the JWT token
    const payload = {
      userId: user.userId,
      role: user.role,
      department: user.department,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // Return token along with the full user details
    return res.status(200).json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}