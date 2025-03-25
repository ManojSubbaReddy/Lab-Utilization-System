// pages/api/icts/bookings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../../../utils/db'
import Booking from '../../../../models/Booking'
// import { authenticateICTSHead } from '../../../../middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect()

  try {
    switch (req.method) {
      case 'GET': {
        // Optionally filter by status if passed in query
        const { status } = req.query
        const query: any = {}
        if (status) query.status = status

        const bookings = await Booking.find(query)
        return res.status(200).json(bookings)
      }
      case 'POST': {
        // Create a new booking (rare for the ICTS Head, but possible)
        const newBooking = new Booking(req.body)
        await newBooking.save()
        return res.status(201).json(newBooking)
      }
      default:
        return res.status(405).end()
    }
  } catch (error) {
    console.error('Error in /api/icts/bookings:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
