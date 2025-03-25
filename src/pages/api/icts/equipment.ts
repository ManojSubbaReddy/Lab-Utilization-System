// pages/api/icts/equipment.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../../utils/db'
import Equipment from '../../../models/Equipment'
// import { authenticateICTSHead } from '../../../middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()

  try {
    switch (req.method) {
      case 'GET': {
        // Fetch all equipment
        const equipment = await Equipment.find({})
        return res.status(200).json(equipment)
      }
      case 'POST': {
        // Create new equipment record
        const newItem = new Equipment(req.body)
        await newItem.save()
        return res.status(201).json(newItem)
      }
      case 'PUT': {
        // Example: Mark equipment as under maintenance or update status
        const { equipmentId, status } = req.body
        const updatedItem = await Equipment.findByIdAndUpdate(
          equipmentId,
          { status },
          { new: true }
        )
        return res.status(200).json(updatedItem)
      }
      default:
        return res.status(405).end()
    }
  } catch (error) {
    console.error('Error in /api/icts/equipment:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
