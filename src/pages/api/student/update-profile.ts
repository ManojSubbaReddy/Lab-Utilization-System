import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };

    // Only allow student access
    if (decoded.role !== 'student') {
      return res.status(403).json({ message: 'Access denied: Not a student user' });
    }

    // Expecting the request body to contain updated profile, academicDetails, and department.
    // For example:
    // {
    //   profile: { name: "New Name", designation: "Student" },
    //   department: "CSE",
    //   academicDetails: { courses: ["CS101", "CS102"], year: "3", cgpa: "9" }
    // }
    const { profile, academicDetails, department } = req.body;

    const updatedStudent = await User.findOneAndUpdate(
      { userId: decoded.userId, role: 'student' },
      {
        $set: {
          'profile.name': profile.name,
          department: department,
          'academicDetails.courses': academicDetails.courses,
          'academicDetails.year': Number(academicDetails.year),
          'academicDetails.cgpa': Number(academicDetails.cgpa)
        },
      },
      { new: true, runValidators: true }
    );

    console.log("Updated student:", updatedStudent);

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ message: 'Profile updated successfully', student: updatedStudent });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
}
