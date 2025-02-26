import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect"; // Ensure this function connects to your database
import ScheduledLab from "@/models/ScheduledLab"; // Adjust model import as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Ensure DB connection

  const { id } = req.query; // Get the session ID from the URL

  if (req.method === "PUT") {
    try {
      const updatedSession = await ScheduledLab.findByIdAndUpdate(
        id,
        { status: "cancelled" },
        { new: true }
      );

      if (!updatedSession) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.status(200).json(updatedSession);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
