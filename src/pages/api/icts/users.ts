// pages/api/icts/users.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../../utils/db'
import User from '../../../models/User'
// import { authenticateICTSHead } from '../../../middleware/auth' // If using custom middleware

// If using custom middleware:
// export default authenticateICTSHead(async function handler(req: NextApiRequest, res: NextApiResponse) {
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()

  try {
    switch (req.method) {
      case 'GET': {
        // Fetch all users
        const users = await User.find({})
        return res.status(200).json(users)
      }
      case 'PUT': {
        // Example: Deactivate or update user role
        // Expect userId, isActive, or newRole in req.body
        const { userId, isActive, newRole } = req.body
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { 
            ...(isActive !== undefined && { isActive }),
            ...(newRole && { role: newRole }),
          },
          { new: true }
        )
        return res.status(200).json(updatedUser)
      }
      default:
        return res.status(405).end() // Method Not Allowed
    }
  } catch (error) {
    console.error('Error in /api/icts/users:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
