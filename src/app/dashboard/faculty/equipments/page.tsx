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

interface Equipment {
  _id: string;
  equipmentId: string;
  lab: string; // either lab name or an ID as a string
  name: string;
  specifications?: string;
  status: "available" | "maintenance" | "unavailable";
  createdAt: string;
}

export default function EquipmentListPage() {
  const router = useRouter();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all equipment from the backend.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("/api/equipment", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.message || "Failed to fetch equipments");
        }
        return res.json();
      })
      .then((data) => {
        // Expected response: { equipments: [...] }
        setEquipments(data.equipments);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching equipments:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  // Delete an equipment entry.
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      const res = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Failed to delete equipment");
      }
      setEquipments((prev) => prev.filter((eq) => eq._id !== id));
    } catch (err: any) {
      console.error("Error deleting equipment:", err);
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
          {/* Header with Add New Equipment button */}
          <header className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Equipments</h1>
            <Button
              onClick={() => router.push("/dashboard/faculty/equipments/new")}
            >
              Add New Equipment
            </Button>
          </header>

          {equipments.length === 0 ? (
            <div className="text-center text-2xl text-gray-600">
              No equipment found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {equipments.map((eq) => (
                <Card
                  key={eq._id}
                  className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-indigo-700">
                      {eq.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Equipment ID:</strong> {eq.equipmentId}
                    </p>
                    <p>
                      <strong>Lab:</strong> {eq.lab}
                    </p>
                    {eq.specifications && (
                      <p>
                        <strong>Specs:</strong> {eq.specifications}
                      </p>
                    )}
                    <p>
                      <strong>Status:</strong> {eq.status}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/faculty/equipments/edit/${eq._id}`
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(eq._id)}
                    >
                      Delete
                    </Button>
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
