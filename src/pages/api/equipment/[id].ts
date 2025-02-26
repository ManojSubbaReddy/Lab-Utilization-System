import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Equipment from '@/models/Equipment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const equipment = await Equipment.findById(id);
      if (!equipment) return res.status(404).json({ message: "Equipment not found" });
      return res.status(200).json({ equipment });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      // For update, do not update equipmentId; it remains as created.
      const updatedEquipment = await Equipment.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedEquipment) return res.status(404).json({ message: "Equipment not found" });
      return res.status(200).json({ message: "Equipment updated successfully", equipment: updatedEquipment });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedEquipment = await Equipment.findByIdAndDelete(id);
      if (!deletedEquipment) return res.status(404).json({ message: "Equipment not found" });
      return res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
