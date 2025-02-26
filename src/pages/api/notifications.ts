// // src/pages/api/notifications.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/utils/dbConnect";
// import Notification from "@/models/Notification";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();

//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }

//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const token = authHeader.split(" ")[1];

//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     console.log("Decoded token:", decoded);
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return res.status(401).json({ message: "Invalid token" });
//   }

//   // Determine the correct user ID as a MongoDB ObjectId.
//   let userId: any;
//   if (decoded._id) {
//     userId = decoded._id;
//   } else if (decoded.userId) {
//     try {
//       const user = await User.findOne({ userId: decoded.userId });
//       if (!user) {
//         console.error("User not found for decoded.userId:", decoded.userId);
//         return res.status(404).json({ message: "User not found" });
//       }
//       userId = user._id;
//     } catch (err) {
//       console.error("Error finding user:", err);
//       return res.status(500).json({ message: "Error finding user" });
//     }
//   } else {
//     console.error("User id not found in token", decoded);
//     return res.status(400).json({ message: "User id not found in token" });
//   }

//   try {
//     const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
//     return res.status(200).json({ notifications });
//   } catch (error: any) {
//     console.error("Error fetching notifications:", error);
//     return res.status(500).json({ message: error.message });
//   }
// }


// src/pages/api/notifications.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

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
  
  // Resolve proper MongoDB ObjectId if the token only contains a custom userId.
  let userId: any;
  if (decoded.id) {
    userId = decoded.id;
  } else if (decoded.userId) {
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    userId = user._id;
  } else {
    return res.status(400).json({ message: "User id not found in token" });
  }

  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ notifications });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: error.message });
  }
}
