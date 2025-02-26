import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    // List all faculty users as lab incharge options
    const labIncharges = await User.find({ role: "faculty" }).select("userId email profile");
    return res.status(200).json({ labIncharges });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
