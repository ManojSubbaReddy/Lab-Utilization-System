"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Faculty {
  userId: string;
  email: string;
  department: string;
  profile: {
    name: string;
    designation?: string;
  };
  academicDetails?: {
    courses?: string[];
  };
}

export default function FacultyProfilePage() {
  const router = useRouter();
  const [facultyData, setFacultyData] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Form fields for editing profile
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [newCourse, setNewCourse] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch current faculty details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetch("/api/faculty/me", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch faculty details");
        }
        return res.json();
      })
      .then(data => {
        if (data && data.faculty) {
          setFacultyData(data.faculty);
          // Pre-fill form fields
          setName(data.faculty.profile.name);
          setDesignation(data.faculty.profile.designation || "");
          setCourses(data.faculty.academicDetails?.courses || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching faculty details:", err);
        router.push("/auth/login");
      });
  }, [router]);

  // Handler to add a new course
  const handleAddCourse = () => {
    if (newCourse.trim() !== "") {
      setCourses(prev => [...prev, newCourse.trim()]);
      setNewCourse("");
    }
  };

  // Handler to remove a course
  const handleRemoveCourse = (index: number) => {
    setCourses(prev => prev.filter((_, i) => i !== index));
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
      const res = await fetch("/api/faculty/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          profile: {
            name,
            designation,
          },
          academicDetails: {
            courses,
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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (!facultyData) {
    return <div className="flex items-center justify-center min-h-screen">Profile not found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <header className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">Edit Profile</h1>
            <p className="text-gray-600">Update your personal and academic details</p>
          </header>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Profile Details</CardTitle>
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
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g., Professor, Associate Professor"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="courses">Courses</Label>
                  <div className="space-y-2 mt-1">
                    {courses.map((course, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="flex-1">{course}</span>
                        <Button variant="outline" size="sm" onClick={() => handleRemoveCourse(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={newCourse}
                        onChange={(e) => setNewCourse(e.target.value)}
                        placeholder="Add new course"
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddCourse}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => router.push("/dashboard/faculty")}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}