import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Lab from '@/models/Lab';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  // Retrieve query parameters: date, time, type (here, type can be matched against lab name or location)
  const { date, time, type } = req.query;

  try {
    // Create a query object. (Customize this as needed.)
    const query: any = {};
    if (date) {
      query['schedule.date'] = new Date(date as string);
    }
    if (time) {
      // Assuming you want labs available at a given time – implement your own logic.
      query['schedule.startTime'] = { $lte: time };
      query['schedule.endTime'] = { $gte: time };
    }
    if (type) {
      // Search by lab name (or location) case-insensitively
      query.$or = [
        { name: { $regex: new RegExp(type as string, 'i') } },
        { location: { $regex: new RegExp(type as string, 'i') } },
      ];
    }

    const labs = await Lab.find(query);
    return res.status(200).json({ labs });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
