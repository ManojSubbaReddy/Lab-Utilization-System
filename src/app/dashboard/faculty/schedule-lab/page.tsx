"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LabOption {
  _id: string;
  name: string;
}

export default function ScheduleLabPage() {
  const router = useRouter();
  const [labs, setLabs] = useState<LabOption[]>([]);
  const [selectedLab, setSelectedLab] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch labs to populate the dropdown.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("/api/labs", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch labs");
        }
        return res.json();
      })
      .then((data) => {
        // Assume data.labs is an array of lab documents.
        const labOptions = data.labs.map((lab: any) => ({
          _id: lab._id,
          name: lab.name,
        }));
        setLabs(labOptions);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    if (!selectedLab || !date || !startTime || !endTime) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch("/api/scheduled-labs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          lab: selectedLab,
          date,
          startTime,
          endTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to schedule lab session");
      }
      setMessage("Lab session scheduled successfully!");
      // Optionally, clear the form fields and redirect after a delay.
      setTimeout(() => {
        router.push("/dashboard/faculty/scheduled-sessions");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Schedule Lab Session</h1>
          {error && <p className="text-red-600">{error}</p>}
          {message && <p className="text-green-600">{message}</p>}
          <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">New Session Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="lab">Select Lab</Label>
                  <select
                    id="lab"
                    value={selectedLab}
                    onChange={(e) => setSelectedLab(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                  >
                    <option value="">Select a lab</option>
                    {labs.map((lab) => (
                      <option key={lab._id} value={lab._id}>
                        {lab.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <Button type="submit">Schedule Session</Button>
              </form>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push("/dashboard/faculty/scheduled-sessions")}>
                Back to Scheduled Sessions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
