// pages/api/equipment-requests/action.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Equipment from "@/models/Equipment";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import Notification from "@/models/Notification";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Validate token and extract user information.
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

  // Assume decoded.id contains the technical staff's ObjectId.
  const userId = decoded.id;

  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { equipmentId, requestId, action } = req.body;
  if (!equipmentId || !requestId || !action) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the equipment document that contains the request.
    const equipment = await Equipment.findOne({ _id: equipmentId, "requests._id": requestId });
    if (!equipment) {
      return res.status(404).json({ message: "Equipment or request not found" });
    }

    // Locate the specific request
    const requestDoc = equipment.requests.id(requestId);
    if (!requestDoc) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check that the current status is pending (you may add additional validations).
    if (requestDoc.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be updated" });
    }

    // Update the request based on the action.
    if (action === "approve") {
      requestDoc.status = "approved";
      // Create a notification to the requester.
      const newNotification = new Notification({
        user: requestDoc.user,
        message: `Your equipment request for "${equipment.name}" has been approved.`,
        type: "equipment-request",
        read: false,
      });
      await newNotification.save();
    } else if (action === "forward") {
      requestDoc.status = "forwarded";
      // Add extra information.
      requestDoc.forwardedBy = userId;
      requestDoc.forwardedAt = new Date();

      // Notify the requester.
      const notifToRequester = new Notification({
        user: requestDoc.user,
        message: `Your equipment request for "${equipment.name}" is being processed. It has been forwarded by technical staff.`,
        type: "equipment-request",
        read: false,
      });
      await notifToRequester.save();

      // Notify the ICTS head.
      // For example, assume ICTS head has a fixed userId or query by role.
      const ictsHead = await User.findOne({ role: "ICTS-Lab Manager" });
      if (ictsHead) {
        const notifToIctsHead = new Notification({
          user: ictsHead._id,
          message: `Equipment request for "${equipment.name}" has been forwarded by technical staff (User ID: ${userId}). Reason: ${requestDoc.reason}`,
          type: "equipment-request",
          read: false,
        });
        await notifToIctsHead.save();
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Save the equipment document after updating the subdocument.
    await equipment.save();

    return res.status(200).json({ message: `Request ${action}d successfully` });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
