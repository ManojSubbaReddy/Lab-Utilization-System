"use client";

import { useState } from "react";
import Navbar from "@/components/Navbart";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface Notification {
  _id: string;
  name: string;
  userId: string;
  type: "equipment-malfunction" | "resource-request";
  lab: string;
  machineNumber?: string; // Only for equipment malfunctions
  requestedBy?: "Faculty" | "Student"; // Only for resource requests
  requesterId?: string; // Only for resource requests
  requestedResources?: string[]; // Only for resource requests
  message: string;
}

// Hardcoded Technical Staff Notifications
const technicalStaffNotifications: Notification[] = [
  {
    _id: "1",
    name: "Aravind",
    userId: "TS001",
    type: "equipment-malfunction",
    lab: "IT Lab 1",
    machineNumber: "PC-23",
    message: "System PC-23 in IT Lab 1 is not booting.",
  },
  {
    _id: "2",
    name: "Karthikram",
    userId: "TS002",
    type: "equipment-malfunction",
    lab: "PG Lab",
    machineNumber: "PC-10",
    message: "Monitor flickering issue reported for PC-10 in PG Lab.",
  },
  {
    _id: "3",
    name: "Manoj",
    userId: "TS003",
    type: "resource-request",
    requestedBy: "Faculty",
    requesterId: "F001",
    lab: "IT Lab 3",
    requestedResources: ["Projector", "2 Speakers"],
    message: "Faculty F001 requests 1 Projector and 2 Speakers for IT Lab 3.",
  },
  {
    _id: "4",
    name: "Ram",
    userId: "TS004",
    type: "resource-request",
    requestedBy: "Student",
    requesterId: "S1023",
    lab: "IT Lab 2",
    requestedResources: ["Additional Keyboard", "Mouse"],
    message:
      "Student S1023 requests an additional keyboard and mouse for IT Lab 2.",
  },
];

export default function TechnicalStaffDashboard() {
  const [notifications] = useState(technicalStaffNotifications);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Technical Staff Dashboard</h1>

          {/* Loop through notifications */}
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            notifications.map((notif) => (
              <Card key={notif._id} className="mb-6 p-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {notif.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    <strong>User ID:</strong> {notif.userId}
                  </p>
                  <p className="text-gray-600">
                    <strong>Lab:</strong> {notif.lab}
                  </p>

                  {/* Show equipment malfunctions */}
                  {notif.type === "equipment-malfunction" && (
                    <p className="text-red-600">
                      <strong>Issue:</strong> {notif.message} <br />
                      <strong>Machine Number:</strong> {notif.machineNumber}
                    </p>
                  )}

                  {/* Show resource requests */}
                  {notif.type === "resource-request" && (
                    <>
                      <p className="text-blue-600">
                        <strong>Requested By:</strong> {notif.requestedBy} (
                        {notif.requesterId})
                      </p>
                      <p className="text-green-600">
                        <strong>Requested Resources:</strong>{" "}
                        {notif.requestedResources?.join(", ")}
                      </p>
                      <p>
                        <strong>Message:</strong> {notif.message}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
