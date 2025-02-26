// src/pages/api/auth/send-otp.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import { sendOtpEmail } from '@/utils/sendEmail';
import Otp from '@/models/Otp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time for OTP (e.g., 10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save the OTP to the database
    const otpRecord = new Otp({ email, otp, expiresAt });
    await otpRecord.save();

    // Send the OTP email
    await sendOtpEmail(email, otp);

    // For demonstration, return the OTP in the response.
    // In production, you wouldn't expose the OTP in the response.
    return res.status(200).json({ message: 'OTP sent successfully', otp });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
}
