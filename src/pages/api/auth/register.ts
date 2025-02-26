// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import User, { IUser } from "@/models/User";
import bcrypt from "bcryptjs";
import { sendRegistrationEmail } from "@/utils/sendEmail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, password, role, department, academicDetails, profile } = req.body;
  if (!name || !email || !password || !role || !department) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a profile object that ensures the name is included
    const userProfile = { ...(profile || {}), name };

    const newUser: Partial<IUser> = {
      email,
      password: hashedPassword,
      role,
      department,
      academicDetails,
      profile: userProfile,
    };

    const user = new User(newUser);
    await user.save();

    // Send registration email with the user's details
    await sendRegistrationEmail(user);

    // Return the complete user object including generated userId and name
    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
