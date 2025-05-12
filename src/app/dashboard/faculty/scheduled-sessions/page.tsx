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

interface LabSession {
  _id: string;
  lab: Lab; // Populated lab details
  date: string;
  startTime: string;
  endTime: string;
  status: string; // "scheduled" or "cancelled"
}

export default function ScheduledSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch scheduled sessions for the current user.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("/api/scheduled-labs/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch scheduled sessions");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Scheduled sessions:", data);
        setSessions(data.scheduledLabs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  const handleCancelSession = async (sessionId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const apiUrl = `/api/scheduled-labs/${sessionId}`;
    console.log("Cancelling session at:", apiUrl);

    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel session");
      }

      setSessions((prev) =>
        prev.map((session) =>
          session._id === sessionId
            ? { ...session, status: "cancelled" }
            : session
        )
      );
    } catch (err: any) {
      console.error("Error cancelling session:", err);
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
          {/* Dashboard Header with new button */}
          <header className="mb-8 flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-4xl font-bold">My Scheduled Sessions</h1>
            <Button
              onClick={() => router.push("/dashboard/faculty/schedule-lab")}
              className="mt-4 md:mt-0"
            >
              Schedule New Session
            </Button>
          </header>

          {sessions.length === 0 ? (
            <div className="text-center text-3xl">
              😢 No scheduled sessions.
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
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {session.startTime} -{" "}
                      {session.endTime}
                    </p>
                    <p>
                      <strong>Status:</strong> {session.status}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    {session.status === "scheduled" && (
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelSession(session._id)}
                      >
                        Cancel Session
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
