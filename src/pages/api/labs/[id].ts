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

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const lab = await Lab.findById(id);
      if (!lab) return res.status(404).json({ message: 'Lab not found' });
      return res.status(200).json({ lab });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'PUT') {
    try {
      // Department is not part of the update since it's removed from the form.
      const updatedLab = await Lab.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedLab) return res.status(404).json({ message: 'Lab not found' });
      return res.status(200).json({ message: 'Lab updated successfully', lab: updatedLab });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedLab = await Lab.findByIdAndDelete(id);
      if (!deletedLab) return res.status(404).json({ message: 'Lab not found' });
      return res.status(200).json({ message: 'Lab deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
