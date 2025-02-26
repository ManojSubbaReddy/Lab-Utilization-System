"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

interface LabOption {
  _id: string;
  name: string;
}

export default function NewEquipmentPage() {
  const router = useRouter();
  const [labsList, setLabsList] = useState<LabOption[]>([]);
  const [selectedLab, setSelectedLab] = useState("");
  const [name, setName] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [status, setStatus] = useState("available");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch labs from the database to populate the dropdown.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("/api/labs", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.message || "Failed to fetch labs");
        }
        return res.json();
      })
      .then((data) => {
        // Assumes API returns an object like { labs: [ ... ] }
        setLabsList(data.labs);
      })
      .catch((err) => {
        console.error("Error fetching labs:", err);
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

    if (!selectedLab || !name.trim()) {
      setError("Please select a lab and enter the equipment name.");
      return;
    }

    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          lab: selectedLab,
          name: name.trim(),
          specifications: specifications.trim() || undefined,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create equipment");
      }
      setMessage("Equipment created successfully!");
      setTimeout(() => router.push("/dashboard/faculty/equipments"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center">Add New Equipment</h1>
          {error && <p className="text-red-600 text-center">{error}</p>}
          {message && <p className="text-green-600 text-center">{message}</p>}
          <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <Label htmlFor="lab">Lab <span className="text-red-600">*</span></Label>
                <select
                  id="lab"
                  value={selectedLab}
                  onChange={(e) => setSelectedLab(e.target.value)}
                  required
                  className="w-full p-2 mt-1 border rounded"
                >
                  <option value="">Select a Lab</option>
                  {labsList.map((lab) => (
                    <option key={lab._id} value={lab._id}>
                      {lab.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="name">Equipment Name <span className="text-red-600">*</span></Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter equipment name"
                />
              </div>
              <div>
                <Label htmlFor="specifications">Specifications</Label>
                <Input
                  id="specifications"
                  type="text"
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="Enter specifications (optional)"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full p-2 border rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <Button type="submit">Create Equipment</Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
