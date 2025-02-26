"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Student {
  userId: string;
  email: string;
  department: string;
  profile: {
    name: string;
    designation?: string;
  };
  academicDetails?: {
    year?: number;
    courses?: string[];
    cgpa?: number;
  };
}

export default function StudentProfilePage() {
  const router = useRouter();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Form fields for editing profile
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState<string>("");
  const [cgpa, setCgpa] = useState<string>("");
  const [courses, setCourses] = useState<string[]>([]);
  const [newCourse, setNewCourse] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch current student details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetch("/api/student/me", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch student details");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.student) {
          setStudentData(data.student);
          // Pre-fill form fields
          setName(data.student.profile.name);
          setDesignation(data.student.profile.designation || "");
          setDepartment(data.student.department);
          setCourses(data.student.academicDetails?.courses || []);
          setYear(
            data.student.academicDetails?.year
              ? data.student.academicDetails.year.toString()
              : ""
          );
          setCgpa(
            data.student.academicDetails?.cgpa
              ? data.student.academicDetails.cgpa.toString()
              : ""
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student details:", err);
        router.push("/auth/login");
      });
  }, [router]);

  // Handler to add a new course
  const handleAddCourse = () => {
    if (newCourse.trim() !== "") {
      setCourses((prev) => [...prev, newCourse.trim()]);
      setNewCourse("");
    }
  };

  // Handler to remove a course
  const handleRemoveCourse = (index: number) => {
    setCourses((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler to update profile
  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/student/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile: {
            name,
            designation,
          },
          department,
          academicDetails: {
            courses,
            year: Number(year),
            cgpa: Number(cgpa),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }
      setMessage("Profile updated successfully!");
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  if (!studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Profile not found.
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <header className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">Edit Profile</h1>
            <p className="text-gray-600">
              Update your personal and academic details
            </p>
          </header>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {message && <p className="mb-4 text-green-600">{message}</p>}
              {error && <p className="mb-4 text-red-600">{error}</p>}
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => router.push("/dashboard/student")}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
