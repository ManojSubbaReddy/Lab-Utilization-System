// import type { NextApiRequest, NextApiResponse } from 'next';
// import dbConnect from '@/utils/dbConnect';
// import Equipment from '@/models/Equipment';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();

//   if (req.method === 'GET') {
//     try {
//       const equipments = await Equipment.find({});
//       return res.status(200).json({ equipments });
//     } catch (error: any) {
//       return res.status(500).json({ message: error.message });
//     }
//   } else if (req.method === 'POST') {
//     try {
//       const { lab, name, specifications, status } = req.body;
//       // lab and name are required.
//       if (!lab || !name) {
//         return res.status(400).json({ message: "Missing required fields (lab, name)" });
//       }

//       // Create a new equipment document. Do not require equipmentId from the client.
//       const newEquipment = new Equipment({
//         lab,
//         name,
//         specifications: specifications || undefined,
//         status: status || "available",
//       });

//       // Save the new equipment
//       await newEquipment.save();

//       // Optionally, update the equipmentId field to be the document's _id string
//       newEquipment.equipmentId = (newEquipment._id as string).toString();
//       await newEquipment.save();

//       return res.status(201).json({ message: "Equipment created successfully", equipment: newEquipment });
//     } catch (error: any) {
//       return res.status(500).json({ message: error.message });
//     }
//   } else {
//     res.setHeader("Allow", ["GET", "POST"]);
//     return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }
// }
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Equipment from '@/models/Equipment';
import Lab from '@/models/Lab';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Fetch equipment and populate lab details
      const equipments = await Equipment.find({})
        .populate("lab", "name location")
        .exec();

      return res.status(200).json({ equipments });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const { name, specifications, availableCount,labname } = req.body;

      // Ensure required fields
      // if (!labname || !name ||!specifications|| availableCount === undefined) {
      //   return res.status(400).json({ 
      //     message: "Missing required fields (labname, name, specifications, availableCount)", 
      //     labname, 
      //     name, 
      //     specifications, 
      //     availableCount 
      //   });
      
      //}
      const missingFields = [];
      if (!labname) missingFields.push("labname");
      if (!name) missingFields.push("name");
      if (!specifications) missingFields.push("specifications");
      if (availableCount === undefined) missingFields.push("availableCount");
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          missingFields,
          labname, 
          name, 
          specifications, 
          availableCount 
        });
      }

      // Check if the lab exists
      const labExists = await Lab.findById(labname);
      if (!labExists) {
        return res.status(404).json({ message: "Lab not found" });
      }

      // Create new equipment
      const newEquipment = new Equipment({
        name,
        specifications: specifications || "",
        availableCount,
        labname
      });

      await newEquipment.save();

      return res.status(201).json({ message: "Equipment created successfully", equipment: newEquipment });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } 
  
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
