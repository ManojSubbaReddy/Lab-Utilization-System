import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Lab from "@/models/Lab";
import ScheduledLab from "@/models/ScheduledLab";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  // Use provided date from query or default to today's date.
  const { date } = req.query;
  const targetDate = date ? new Date(date as string) : new Date();
  targetDate.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Get all labs (selecting only necessary fields)
    const labs: { _id: string; name: string; labId: string }[] = await Lab.find({}).select("name labId");
    // Get scheduled lab sessions for that date with status "scheduled"
    const sessions = await ScheduledLab.find({
      date: { $gte: targetDate, $lte: endOfDay },
      status: "scheduled",
    }).populate("lab", "name labId");

    // For each lab, filter sessions that belong to that lab
    const timetable = labs.map((lab) => {
      const labSessions = sessions.filter(
        (session: any) =>
          session.lab && session.lab._id.toString() === lab._id.toString()
      );
      return { lab, sessions: labSessions };
    });

    return res.status(200).json({ timetable });
  } catch (error: any) {
    console.error("Error fetching timetable:", error);
    return res.status(500).json({ message: error.message });
  }
}