"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbarf";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Lab {
  _id: string;
  name: string;
  labId: string;
}

interface LabSession {
  _id: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface TimetableEntry {
  lab: Lab;
  sessions: LabSession[];
}

export default function TimetablePage() {
  const router = useRouter();
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format YYYY-MM-DD
  });
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetable = async (selectedDate: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      const res = await fetch(`/api/labs/timetable?date=${selectedDate}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch timetable");
      }
      setTimetable(data.timetable);
    } catch (err: any) {
      console.error("Error fetching timetable:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable(date);
  }, [date, router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="text-center">
            <h1 className="text-4xl font-bold">Lab Timetable</h1>
            <div className="mt-4">
              <Label htmlFor="timetableDate" className="mr-2">
                Select Date:
              </Label>
              <Input
                id="timetableDate"
                type="date"
                value={date}
                onChange={(e) => {
                  setLoading(true);
                  setDate(e.target.value);
                }}
                className="inline-block"
              />
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              Loading...
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <>
              {timetable.length === 0 ? (
                <div className="text-center text-2xl text-gray-600">
                  No labs scheduled on{" "}
                  {new Date(date).toLocaleDateString("en-US")}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {timetable.map((entry) => (
                    <Card
                      key={entry.lab._id}
                      className="bg-white shadow-lg rounded-lg p-4"
                    >
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-indigo-700">
                          {entry.lab.name} (ID: {entry.lab.labId})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {entry.sessions.length === 0 ? (
                          <p className="text-green-600 font-semibold">
                            Free all day!
                          </p>
                        ) : (
                          <ul className="divide-y divide-gray-200">
                            {entry.sessions.map((session) => (
                              <li key={session._id} className="py-2">
                                <p>
                                  <strong>Time:</strong> {session.startTime} -{" "}
                                  {session.endTime}
                                </p>
                                <p>
                                  <strong>Status:</strong> {session.status}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex justify-center mt-8">
            <Button onClick={() => router.push("/dashboard/faculty")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
