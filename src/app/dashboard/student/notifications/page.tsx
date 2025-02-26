"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Notification {
  _id: string;
  message: string;
  type: "lab-booking" | "equipment-request";
  createdAt: string; // Assuming the field in DB is "createdAt"
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      try {
        const res = await fetch("/api/notifications", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch notifications");
        }
        // Log the notifications from the database
        console.log("Fetched notifications:", data.notifications);
        setNotifications(data.notifications);
      } catch (err: any) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [router]);

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
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold">Notifications</h1>
          </header>

          {notifications.length === 0 ? (
            <div className="text-center text-2xl text-gray-600">
              😢 No notifications at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {notifications.map((notif) => (
                <Card
                  key={notif._id}
                  className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-indigo-700">
                      {notif.type === "lab-booking" ? "Lab Booking" : "Equipment Request"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800">{notif.message}</p>
                    <p className="text-gray-500 text-sm">
                      {notif.createdAt
                        ? new Date(notif.createdAt).toLocaleDateString("en-US")
                        : "No date available"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Button onClick={() => router.push("/dashboard/student")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
