// import type { NextApiRequest, NextApiResponse } from "next";
// import dbConnect from "@/utils/dbConnect";
// import Equipment from "@/models/Equipment";
// import jwt from "jsonwebtoken";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();

//   // Verify token
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const token = authHeader.split(" ")[1];
//   let decoded: any;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
//   const userId = decoded.id;

//   if (req.method === "GET") {
//     try {
//       // Find equipment documents that include requests made by this user.
//       const equipments = await Equipment.find({ "requests.user": userId }).lean();
//       let requests: any[] = [];
//       equipments.forEach((eq) => {
//         if (eq.requests && Array.isArray(eq.requests)) {
//           // Filter requests belonging to the current user.
//           const userRequests = eq.requests.filter((r: any) => r.user.toString() === userId);
//           // Attach the equipment name to each request.
//           userRequests.forEach((r: any) => {
//             requests.push({
//               _id: r._id,
//               equipmentName: eq.name,
//               reason: r.reason,
//               status: r.status,
//               requestedAt: r.requestedAt,
//             });
//           });
//         }
//       });
//       // Return the requests as an array.
//       return res.status(200).json(requests);
//     } catch (error: any) {
//       return res.status(500).json({ message: error.message });
//     }
//   } else if (req.method === "POST") {
//     try {
//       const { equipmentId, reason } = req.body;
//       if (!equipmentId || !reason) {
//         return res.status(400).json({ message: "Missing equipmentId or reason" });
//       }
//       // Find the equipment by its ID.
//       const equipment = await Equipment.findById(equipmentId);
//       if (!equipment) {
//         return res.status(404).json({ message: "Equipment not found" });
//       }
//       const newRequest = {
//         user: userId,
//         reason,
//         status: "pending", // Status enum now includes pending, approved, rejected, forwarded.
//         requestedAt: new Date(),
//       };

//       // Add the new request as a subdocument.
//       equipment.requests.push(newRequest);
//       await equipment.save();

//       // Retrieve the newly created request (assumed at the end).
//       const createdRequest = equipment.requests[equipment.requests.length - 1];

//       // Return a clean response object.
//       return res.status(201).json({
//         request: {
//           _id: createdRequest._id,
//           equipmentName: equipment.name, // Attached separately for display
//           reason: createdRequest.reason,
//           status: createdRequest.status,
//           requestedAt: createdRequest.requestedAt,
//         },
//         message: "Request submitted successfully",
//       });
//     } catch (error: any) {
//       return res.status(500).json({ message: error.message });
//     }
//   } else {
//     res.setHeader("Allow", ["GET", "POST"]);
//     return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }
// }

























import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Equipment from "@/models/Equipment";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Verify token
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
  const userId = decoded.id;

  if (req.method === "GET") {
    try {
      // Find equipment documents that include requests made by this user, and populate lab data
      const equipments = await Equipment.find({ "requests.user": userId })
        .populate("lab", "name") // Populate lab name
        .lean();

      const requests: any[] = [];
      equipments.forEach((eq) => {
        if (eq.requests && Array.isArray(eq.requests)) {
          // Filter requests belonging to the current user
          const userRequests = eq.requests.filter((r: any) => r.user.toString() === userId);
          // Attach the equipment name and lab name to each request
          userRequests.forEach((r: any) => {
            requests.push({
              _id: r._id,
              equipmentName: eq.name,
              labName: eq.lab ? eq.lab : "No Lab", // Include the lab name
              reason: r.reason,
              status: r.status,
              requestedAt: r.requestedAt,
            });
          });
        }
      });
      // Return the requests as an array
      return res.status(200).json(requests);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { equipmentId, reason } = req.body;
      if (!equipmentId || !reason) {
        return res.status(400).json({ message: "Missing equipmentId or reason" });
      }
      // Find the equipment by its ID and populate lab data
      const equipment = await Equipment.findById(equipmentId).populate("lab", "name");
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      const newRequest = {
        user: userId,
        reason,
        status: "pending", // Status enum now includes pending, approved, rejected, forwarded
        requestedAt: new Date(),
      };

      // Add the new request as a subdocument
      equipment.requests.push(newRequest);
      await equipment.save();

      // Retrieve the newly created request (assumed at the end)
      const createdRequest = equipment.requests[equipment.requests.length - 1];

      // Return a clean response object with lab name
      return res.status(201).json({
        request: {
          _id: createdRequest._id,
          equipmentName: equipment.name, // Attached separately for display
          labName: equipment.lab ? equipment.lab : "No Lab", // Attach the lab name
          reason: createdRequest.reason,
          status: createdRequest.status,
          requestedAt: createdRequest.requestedAt,
        },
        message: "Request submitted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
