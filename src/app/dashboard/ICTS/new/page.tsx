"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbari";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LabInchargeOption {
  _id: string;
  profile: {
    name: string;
  };
}

export default function CreateLabPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("AB1");
  const [capacity, setCapacity] = useState<number>(0);
  const [labIncharge, setLabIncharge] = useState("");
  const [labInchargeOptions, setLabInchargeOptions] = useState<
    LabInchargeOption[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch lab incharge options
  useEffect(() => {
    fetch("/api/lab-incharges", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch lab incharges");
        }
        return res.json();
      })
      .then((data) => {
        setLabInchargeOptions(data.labIncharges);
      })
      .catch((err) => {
        console.error("Error fetching lab incharges:", err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      // Note: We are not sending department since it is removed.
      const res = await fetch("/api/labs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, location, capacity, labIncharge }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create lab");
      }
      router.push("/dashboard/ICTS");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Create New Lab</h1>
          {error && <p className="mb-4 text-red-600">{error}</p>}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                New Lab Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Lab Name</Label>
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
                  <Label htmlFor="location">Location</Label>
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                  >
                    <option value="AB1">AB1</option>
                    <option value="AB2">AB2</option>
                    <option value="AB3">AB3</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="labIncharge">Lab Incharge</Label>
                  <select
                    id="labIncharge"
                    value={labIncharge}
                    onChange={(e) => setLabIncharge(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                  >
                    <option value="">Select Lab Incharge</option>
                    {labInchargeOptions.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.profile.name} ({option._id})
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit">Create Lab</Button>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/ICTS")}
              >
                Back to Lab List
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
