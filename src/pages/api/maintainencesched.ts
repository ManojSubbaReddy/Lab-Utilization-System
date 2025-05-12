// pages/api/maintenance-scheduling.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import jwt from "jsonwebtoken";
import MaintenanceRequest from "@/models/MaintenanceRequest"; // Create this new model or adjust accordingly
import User from "@/models/User";
import Notification from "@/models/Notification";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const technicianId = decoded.id;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { labId, freeSlotId, freeSlotDetails } = req.body;
  if (!labId || !freeSlotId || !freeSlotDetails) {
    return res.status(400).json({ message: "Missing required fields (labId, freeSlotId, freeSlotDetails)" });
  }

  try {
    // Create a new maintenance scheduling request.
    // If you do not have a MaintenanceRequest model yet, you can create one with fields:
    // labId, freeSlotId, freeSlotDetails, technician, status (pending, approved, etc.), createdAt.
    const newRequest = new MaintenanceRequest({
      lab: labId,
      freeSlotId,
      freeSlotDetails,
      technician: technicianId,
      status: "pending",
      createdAt: new Date(),
    });
    await newRequest.save();

    // Notify the ICTS head about the new maintenance scheduling request.
    const ictsHead = await User.findOne({ role: "ICTS-Lab Manager" });
    if (ictsHead) {
      const notifToIctsHead = new Notification({
        user: ictsHead._id,
        message: `New maintenance scheduling request for Lab ID ${labId} by technician ${technicianId}. Slot details: ${freeSlotDetails.startTime} - ${freeSlotDetails.endTime} on ${freeSlotDetails.date}`,
        type: "maintenance-scheduling",
        read: false,
      });
      await notifToIctsHead.save();
    }

    return res.status(201).json({ message: "Maintenance scheduling request created successfully", request: newRequest });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
