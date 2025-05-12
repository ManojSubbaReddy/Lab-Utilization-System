"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbarf";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Faculty {
  _id: string;
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

interface Notification {
  _id: string;
  message: string;
  createdAt: string; // using createdAt as the date field from DB
  type: "lab-booking" | "equipment-request";
  read: boolean;
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

export default function FacultyDashboard() {
  const router = useRouter();
  const [facultyData, setFacultyData] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [labSessions, setLabSessions] = useState<LabSession[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch faculty details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to login.");
      router.push("/auth/login");
      return;
    }
    fetch("/api/faculty/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch faculty details");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Faculty API response:", data);
        if (data && data.faculty) {
          setFacultyData(data.faculty);
        } else {
          console.error("Faculty data not found in API response:", data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching faculty details:", error);
        router.push("/auth/login");
      });
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
            Authorization: `Bearer ${token}`,
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

  // Fetch scheduled lab sessions
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
            Authorization: `Bearer ${token}`,
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

  if (loading || !facultyData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Welcome, {facultyData.profile.name}!
            </h1>
            <p className="text-gray-600">
              Faculty Dashboard — {facultyData.department} Department
            </p>
          </header>

          {/* Row 1: Profile Card - centered with increased width */}
          <div className="flex justify-center">
            <Card className="w-full max-w-lg bg-gradient-to-br from-white to-indigo-50 shadow-2xl rounded-xl border border-gray-300 hover:scale-105 transition-transform duration-300">
              <CardHeader className="bg-indigo-600 rounded-t-xl px-6 py-4">
                <CardTitle className="text-2xl font-bold text-white">
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-900">
                    {facultyData.profile.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">User ID:</span>
                  <span className="text-gray-900">{facultyData.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-900">{facultyData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Dept:</span>
                  <span className="text-gray-900">
                    {facultyData.department}
                  </span>
                </div>
                {facultyData.profile.designation && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Designation:
                    </span>
                    <span className="text-gray-900">
                      {facultyData.profile.designation}
                    </span>
                  </div>
                )}
                {facultyData.academicDetails?.courses && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">
                      Courses:
                    </span>
                    <span className="text-gray-900">
                      {facultyData.academicDetails.courses.join(", ")}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Scheduled Labs and Notifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upcoming Lab Sessions Card */}
            <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-indigo-700">
                  Upcoming Lab Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-64">
                {labSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <span className="text-6xl">😢</span>
                    <p className="mt-4 text-gray-600 text-lg">
                      No scheduled lab sessions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
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
                            <strong>Date:</strong>{" "}
                            {new Date(session.date).toLocaleDateString("en-US")}
                          </p>
                          <p className="text-gray-700">
                            <strong>Time:</strong> {session.startTime} -{" "}
                            {session.endTime}
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

            {/* Notifications Card */}
            <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-indigo-700">
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-64">
                {notifications.length === 0 ? (
                  <p className="text-gray-600">
                    No notifications at this time.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <li key={notification._id} className="py-2">
                        <p>{notification.message}</p>
                        <p className="text-sm text-gray-500">
                          {notification.createdAt
                            ? new Date(
                                notification.createdAt
                              ).toLocaleDateString("en-US")
                            : "No date available"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Quick Actions Card */}
          <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-indigo-700">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 p-6">
              <Button
                onClick={() =>
                  router.push("/dashboard/faculty/scheduled-sessions")
                }
              >
                View Scheduled Sessions
              </Button>
              <Button
                onClick={() => router.push("/dashboard/faculty/schedule-lab")}
              >
                Schedule Lab Session
              </Button>
              <Button
                onClick={() => router.push("/dashboard/faculty/requests")}
              >
                Request Resources
              </Button>
              <Button
                onClick={() => router.push("/dashboard/faculty/notifications")}
              >
                View Notifications
              </Button>
              {/* New Timetable Option */}
              <Button
                onClick={() => router.push("/dashboard/faculty/timetable")}
              >
                View Timetable
              </Button>
              <Button
                onClick={() =>
                  router.push("/dashboard/faculty/booking-history")
                }
              >
                Booking History
              </Button>
              <Button onClick={() => router.push("/dashboard/faculty/labs")}>
                View Labs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
