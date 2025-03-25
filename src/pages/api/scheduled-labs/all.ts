"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ScheduledLab {
  _id: string;
  lab: {
    _id: string;
    name: string;
    labId?: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  bookedBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: "scheduled" | "cancelled";
  createdAt: string;
}

export default function ScheduledLabsComponent() {
  const router = useRouter();
  const [scheduledLabs, setScheduledLabs] = useState<ScheduledLab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
  
    // Retrieve user details (ensure these are stored during login)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
  
    // Choose endpoint based on the user role
    const endpoint =
      user.role === "ICTS" ? "/api/scheduled-labs/all" : "/api/scheduled-labs";
  
    fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(`Failed to fetch scheduled labs: ${res.status} - ${errorMessage}`);
        }
        const data = await res.json();
        setScheduledLabs(data.scheduledLabs);
      })
      .catch((err) => {
        console.error("Error fetching scheduled labs:", err);
        setError("Error fetching scheduled labs");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

}