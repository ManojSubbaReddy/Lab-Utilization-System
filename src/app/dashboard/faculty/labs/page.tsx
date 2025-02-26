"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Lab {
  _id: string;
  labId: string;
  name: string;
  location: string;
  capacity: number;
  lab_incharge: string;
}

export default function LabsPage() {
  const router = useRouter();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [location, setLocation] = useState<string>("");
  const [minCapacity, setMinCapacity] = useState<string>("");
  const [maxCapacity, setMaxCapacity] = useState<string>("");

  // Fetch labs with filter parameters
  const fetchLabs = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (location) params.append("location", location);
      if (minCapacity) params.append("minCapacity", minCapacity);
      if (maxCapacity) params.append("maxCapacity", maxCapacity);

      const res = await fetch(`/api/filter-lab?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch labs");
      }
      // Ensure that data.equipments is an array before setting labs.
      setLabs(Array.isArray(data.equipments) ? data.equipments : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLabs();
  }, []);

  const handleFilterSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchLabs();
  };

  if (loading) {
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
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold">Labs</h1>
            <p className="text-gray-600">Filter labs based on location, and capacity</p>
          </header>

          {/* Filter Form */}
          <form onSubmit={handleFilterSubmit} className="bg-white p-4 rounded shadow-md mb-8">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g. AB1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="minCapacity">Min Capacity</Label>
                <Input
                  id="minCapacity"
                  type="number"
                  placeholder="Min capacity"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="maxCapacity">Max Capacity</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  placeholder="Max capacity"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button type="submit">Apply Filters</Button>
            </div>
          </form>

          {error && <div className="text-center text-red-600">{error}</div>}
          {labs.length === 0 ? (
            <div className="text-center text-2xl text-gray-600">
              No labs found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {labs.map((lab) => (
                <Card
                  key={lab._id}
                  className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-indigo-700">{lab.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Lab ID:</strong> {lab.labId}</p>
                    <p><strong>Location:</strong> {lab.location}</p>
                    <p><strong>Capacity:</strong> {lab.capacity}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
