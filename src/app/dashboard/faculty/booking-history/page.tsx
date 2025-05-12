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

interface Lab {
  _id: string;
  name: string;
  labId: string;
}

interface ScheduledLab {
  _id: string;
  lab: Lab; // Populated lab details from the ScheduledLab model
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "cancelled";
}

export default function LabBookingHistoryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ScheduledLab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch scheduled sessions");
        }
        // Expected response: { scheduledLabs: [...] }
        setSessions(data.scheduledLabs);
      } catch (err: any) {
        console.error("Error fetching scheduled sessions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold">My Booked Sessions</h1>
          </header>
          {sessions.length === 0 ? (
            <div className="text-center text-2xl text-gray-600">
              😢 No scheduled sessions found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sessions.map((session) => (
                <Card
                  key={session._id}
                  className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-indigo-700">
                      {session.lab.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Lab ID:</strong> {session.lab.labId}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(session.date).toLocaleDateString("en-US")}
                    </p>
                    <p>
                      <strong>Time:</strong> {session.startTime} -{" "}
                      {session.endTime}
                    </p>
                    <p>
                      <strong>Status:</strong> {session.status}
                    </p>
                  </CardContent>
                  {/* <CardFooter className="flex justify-end">
                    <Button onClick={() => router.push(`/dashboard/faculty/scheduled-sessions/${session._id}`)}>
                      View Details
                    </Button>
                  </CardFooter> */}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
