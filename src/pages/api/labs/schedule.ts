import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Lab from '@/models/Lab';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (req.method === 'GET') {
    try {
      const labs = await Lab.find({});
      return res.status(200).json({ labs });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, location, capacity, labIncharge } = req.body;
      // Auto-generate a labId if needed
      const labId = `LAB-${Date.now()}`;
      const newLab = new Lab({
        labId,
        name,
        location,
        capacity,
        labIncharge,
      });
      await newLab.save();
      return res.status(201).json({ message: 'Lab created successfully', lab: newLab });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
