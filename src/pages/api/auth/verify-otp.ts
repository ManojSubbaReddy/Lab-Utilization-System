// src/pages/api/auth/verify-otp.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Otp from '@/models/Otp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    // Find the OTP record that matches the email and otp code.
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if the OTP has expired
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // OTP is valid; you can now proceed with resetting the password
    // Optionally, delete the OTP record after successful verification.
    await otpRecord.deleteOne();

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
