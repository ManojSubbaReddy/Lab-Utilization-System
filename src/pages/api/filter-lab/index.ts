import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Lab from "@/models/Lab";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { location, minCapacity, maxCapacity } = req.query;
      const filter: any = {};

      // Filter labs by location (case-insensitive)
      if (location) {
        filter.location = { $regex: new RegExp(String(location), "i") };
      }

      // Filter labs by capacity range
      if (minCapacity || maxCapacity) {
        filter.capacity = {};
        if (minCapacity) {
          filter.capacity.$gte = Number(minCapacity);
        }
        if (maxCapacity) {
          filter.capacity.$lte = Number(maxCapacity);
        }
      }

      const equipments = await Lab.find(filter).sort({ name: 1 });
      return res.status(200).json({ equipments });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}