"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
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

interface Lab {
  _id: string;
  labId: string;
  name: string;
  location: string;
  capacity: number;
  labIncharge: string;
  createdAt: string;
}

interface LabInchargeOption {
  _id: string;
  profile: {
    name: string;
  };
}

export default function EditLabPage() {
  const router = useRouter();
  const params = useParams();
  const labId = params?.id; // dynamic route parameter

  const [lab, setLab] = useState<Lab | null>(null);
  const [labInchargeOptions, setLabInchargeOptions] = useState<
    LabInchargeOption[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("AB1");
  const [capacity, setCapacity] = useState<number>(0);
  const [labIncharge, setLabIncharge] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Fetch lab details
    fetch(`/api/labs/${labId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch lab details");
        }
        return res.json();
      })
      .then((data) => {
        setLab(data.lab);
        // Pre-fill form fields
        setName(data.lab.name);
        setLocation(data.lab.location);
        setCapacity(data.lab.capacity);
        setLabIncharge(data.lab.labIncharge);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [labId, router]);

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

  const handleUpdateLab = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`/api/labs/${labId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, location, capacity, labIncharge }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update lab");
      }
      router.push("/dashboard/ICTS");
    } catch (err: any) {
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
      <div className="flex items-center justify-center min-h-screen">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold mb-8">Edit Lab</h1>
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Lab Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateLab} className="space-y-4">
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
                <Button type="submit">Update Lab</Button>
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
