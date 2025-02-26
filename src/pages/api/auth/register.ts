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

    // Ensure academicDetails is structured properly for students
    const isStudent = role === "student";
    const userAcademicDetails = isStudent
      ? {
          year: academicDetails?.year ?? 1, // Default to 1 if missing
          cgpa: academicDetails?.cgpa ?? 0, // Default to 0 if missing
          courses: academicDetails?.courses ?? [], // Default to empty array
        }
      : undefined; // If not a student, academicDetails is undefined

    // Create a profile object that ensures the name is included
    const userProfile = { ...(profile || {}), name };

    console.log("Registering user...");

    const newUser: Partial<IUser> = {
      email,
      password: hashedPassword,
      role,
      department,
      academicDetails: userAcademicDetails, // Ensured proper structure
      profile: userProfile,
    };

    console.log("Creating user object...", newUser);

    const user = new User(newUser);

    console.log("Saving user to database...", user);
    await user.save();

    console.log("User registered successfully");

    // Send registration email with the user's details
    await sendRegistrationEmail(user);

    // Return the complete user object including generated userId and name
    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
