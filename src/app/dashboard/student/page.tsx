"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StudentNav from "@/components/StudentNav";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Student {
  _id: string; // MongoDB _id (returned from API)
  userId: string;
  email: string;
  department: string;
  profile: {
    name: string;
  };
  academicDetails?: {
    courses?: string[];
  };
}

interface LabSession {
  _id: string;
  lab: {
    _id: string;
    name: string;
    labId: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface Notification {
  id: string;
  message: string;
  date: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [labSessions, setLabSessions] = useState<LabSession[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch student details
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
        console.log("Student API response:", data);
        if (data && data.student) {
          setStudentData(data.student);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching student details:", error);
        router.push("/auth/login");
      });
  }, [router]);

  // Fetch scheduled labs (upcoming bookings)
  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      try {
        const res = await fetch("/api/scheduled-labs/me", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch scheduled labs");
        }
        const data = await res.json();
        console.log("Scheduled labs:", data);
        setLabSessions(data.scheduledLabs);
      } catch (err) {
        console.error("Error fetching lab sessions:", err);
        setLabSessions([]);
      }
    };

    fetchSessions();
  }, [router]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      try {
        const res = await fetch("/api/notifications", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch notifications");
        }
        console.log("Fetched notifications:", data.notifications);
        setNotifications(data.notifications);
      } catch (err: any) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
      }
    };

    fetchNotifications();
  }, [router]);

  if (loading || !studentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <StudentNav />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Welcome, {studentData.profile.name}!
            </h1>
            <p className="text-gray-600">
              Student Dashboard — {studentData.department} Department
            </p>
          </header>

          {/* Grid Layout for Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Card */}
            <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-transform duration-300">
              <CardHeader className="bg-blue-600 rounded-t-lg px-6 py-4">
                <CardTitle className="text-2xl font-bold text-white">Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-28">Name:</span>
                  <span className="text-gray-900">{studentData.profile.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-28">User ID:</span>
                  <span className="text-gray-900">{studentData.userId}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-28">Email:</span>
                  <span className="text-gray-900">{studentData.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-28">Dept:</span>
                  <span className="text-gray-900">{studentData.department}</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Bookings Card */}
            <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-transform duration-300">
              <CardHeader className="bg-green-600 rounded-t-lg px-6 py-4">
                <CardTitle className="text-2xl font-bold text-white">Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-64 p-6">
                {labSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <span className="text-6xl">😢</span>
                    <p className="mt-4 text-gray-600 text-lg">No upcoming bookings found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {labSessions.map((session) => (
                      <Card
                        key={session._id}
                        className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-4 shadow-md"
                      >
                        <CardHeader>
                          <CardTitle className="text-xl font-bold text-gray-800">
                            {session.lab.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-gray-700">
                            <strong>Lab ID:</strong> {session.lab.labId}
                          </p>
                          <p className="text-gray-700">
                            <strong>Date:</strong> {new Date(session.date).toLocaleDateString("en-US")}
                          </p>
                          <p className="text-gray-700">
                            <strong>Time:</strong> {session.startTime} - {session.endTime}
                          </p>
                          <p className="text-gray-700">
                            <strong>Status:</strong> {session.status}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications Card (Full width on medium screens) */}
            <Card className="bg-white shadow-xl rounded-lg border border-gray-200 md:col-span-2 hover:shadow-2xl transition-transform duration-300">
              <CardHeader className="bg-red-600 rounded-t-lg px-6 py-4">
                <CardTitle className="text-2xl font-bold text-white">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {notifications.length === 0 ? (
                  <p className="text-gray-600">No notifications at this time.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <li key={notification.id} className="py-2">
                        <p>{notification.message}</p>
                        <p className="text-sm text-gray-500">{notification.date}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions Card (Full width on medium screens) */}
            <Card className="bg-white shadow-xl rounded-lg border border-gray-200 md:col-span-2 hover:shadow-2xl transition-transform duration-300">
              <CardHeader className="bg-purple-600 rounded-t-lg px-6 py-4">
                <CardTitle className="text-2xl font-bold text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 p-6">
                <Button onClick={() => router.push("/dashboard/student/schedule-lab")}>
                  Book Lab
                </Button>
                <Button onClick={() => router.push("/dashboard/student/booking-history")}>
                  Booking History
                </Button>
                <Button onClick={() => router.push("/dashboard/student/notifications")}>
                  View Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
