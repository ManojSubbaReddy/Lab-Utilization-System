import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Equipment from "@/models/Equipment";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import Notification from "@/models/Notification";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Check for a valid Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  // Verify token using custom JWT authentication
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Decoded token:", decoded);
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }

  // Resolve the correct MongoDB ObjectId for the user.
  let userId: any;
  if (decoded.id) {
    // Token already contains MongoDB _id.
    userId = decoded.id;
  } else if (decoded.userId) {
    // Token contains a custom user id (e.g., "FTCSE01"). Look up the user.
    try {
      const user = await User.findOne({ userId: decoded.userId });
      if (!user) {
        console.error("User not found for decoded.userId:", decoded.userId);
        return res.status(404).json({ message: "User not found" });
      }
      userId = user._id;
    } catch (err) {
      console.error("Error finding user:", err);
      return res.status(500).json({ message: "Error finding user" });
    }
  } else {
    return res.status(400).json({ message: "User id not found in token" });
  }

  if (req.method === "GET") {
    try {
      // Find equipment that has a request with this user.
      const equipmentWithRequests = await Equipment.find({ "requests.user": userId })
        .select("name requests")
        .populate("requests.user", "name email");
      // Flatten the requests into a single array
      const requests = equipmentWithRequests.reduce((acc: any[], eq) => {
        const eqRequests = eq.requests.map((req: any) => ({
          _id: req._id,
          equipmentName: eq.name,
          reason: req.reason,
          status: req.status,
          requestedAt: req.requestedAt,
        }));
        return [...acc, ...eqRequests];
      }, []);
      return res.status(200).json(requests);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { equipmentId, reason } = req.body;
      if (!equipmentId || !reason) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Find the equipment by its ID.
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      // Add a new request using the proper ObjectId for user.
      equipment.requests.push({
        user: userId,
        reason,
        status: "pending",
        requestedAt: new Date(),
      });

      await equipment.save();

      // Create a notification for this equipment request.
      const newNotification = new Notification({
        user: userId,
        message: `Your request for equipment "${equipment.name}" has been submitted.`,
        type: "equipment-request",
        read: false,
      });
      await newNotification.save();

      // Get the newly added request details.
      const newRequest = equipment.requests[equipment.requests.length - 1];
      const responseObject = {
        _id: newRequest._id,
        equipmentName: equipment.name,
        reason: newRequest.reason,
        status: newRequest.status,
        requestedAt: newRequest.requestedAt,
      };

      return res.status(201).json(responseObject);
    } catch (error: any) {
      console.error("Error submitting request:", error);
      return res.status(500).json({ message: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
