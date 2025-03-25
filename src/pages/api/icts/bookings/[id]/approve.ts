// pages/api/icts/bookings/[id]/approve.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../../../../utils/db'
import Booking from '../../../../../models/Booking'
// import { authenticateICTSHead } from '../../../../../middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()

  const { id } = req.query
  if (req.method === 'POST') {
    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { status: 'Approved' },
        { new: true }
      )
      if (!updatedBooking) {
        return res.status(404).json({ message: 'Booking not found' })
      }
      return res.status(200).json(updatedBooking)
    } catch (error) {
      console.error('Error approving booking:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).end()
  }
}
