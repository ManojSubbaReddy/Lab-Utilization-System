"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Equipment {
  _id: string;
  name: string;
}

interface EquipmentRequest {
  _id: string;
  equipmentName: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
}

export default function FacultyRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Fetch available equipment to populate the dropdown
    fetch("/api/equipment", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.message || "Failed to fetch equipment");
        }
        return res.json();
      })
      .then((data) => {
        // Assumes API returns { equipments: [...] }
        setEquipmentList(data.equipments);
      })
      .catch((err) => {
        console.error("Error fetching equipment:", err);
        setError(err.message);
      });

    // Fetch user's equipment requests
    fetch("/api/equipment/request", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.message || "Failed to fetch requests");
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching requests:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  const handleRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (!selectedEquipment || !reason.trim()) {
      setError("Please select equipment and provide a reason.");
      return;
    }

    try {
      const res = await fetch("/api/equipment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ equipmentId: selectedEquipment, reason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit request.");

      setRequests([...requests, data]);
      setReason("");
      setSelectedEquipment("");
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6">Request Equipment</h1>

        {error && <div className="text-center text-red-600 mb-4">{error}</div>}

        <div className="mb-8 space-y-4">
          <div>
            <Label htmlFor="equipmentSelect">Select Equipment</Label>
            <select
              id="equipmentSelect"
              className="w-full p-2 border rounded"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              required
            >
              <option value="">Select Equipment</option>
              {equipmentList.map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Request</Label>
            <textarea
              id="reason"
              placeholder="Enter the reason for the request"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <Button onClick={handleRequest} disabled={!selectedEquipment || !reason.trim()}>
            Submit Request
          </Button>
        </div>

        <h2 className="text-2xl font-bold mb-4">My Requests</h2>
        {requests.length === 0 ? (
          <div className="text-center text-gray-600">No requests found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <Card key={request._id} className="shadow-md p-4">
                <CardHeader>
                  <CardTitle>{request.equipmentName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {request.status}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
