// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbari";
// import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface EquipmentRequest {
//   _id: string;
//   requestedBy: {
//     name: string;
//     email: string;
//     role: string;
//   };
//   equipment: string;
//   reason: string;
//   status: "pending" | "approved" | "forwarded" | "rejected";
// }

// interface FreeSlot {
//   _id: string;
//   labId: string;
//   labName: string;
//   date: string;
//   startTime: string;
//   endTime: string;
// }

// export default function TechnicalStaffDashboard() {
//   const router = useRouter();
//   const [equipmentRequests, setEquipmentRequests] = useState<
//     EquipmentRequest[]
//   >([]);
//   const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // ------------------ FETCH EQUIPMENT REQUESTS ------------------
//   const fetchEquipmentRequests = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }
//     try {
//       const res = await fetch("/api/equipment-requests", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch equipment requests");
//       }
//       setEquipmentRequests(Array.isArray(data.requests) ? data.requests : []);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ------------------ FETCH FREE SLOTS FOR MAINTENANCE ------------------
//   const fetchFreeSlots = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }
//     try {
//       const res = await fetch("/api/free-slots", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch free slots");
//       }
//       setFreeSlots(Array.isArray(data.freeSlots) ? data.freeSlots : []);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ------------------ APPROVE EQUIPMENT REQUEST ------------------
//   const handleApproveRequest = async (requestId: string) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`/api/equipment-requests/${requestId}/approve`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) {
//         throw new Error("Failed to approve request");
//       }
//       setEquipmentRequests(
//         equipmentRequests.map((req) =>
//           req._id === requestId ? { ...req, status: "approved" } : req
//         )
//       );
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ------------------ FORWARD REQUEST TO ICTS HEAD ------------------
//   const handleForwardRequest = async (requestId: string) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`/api/equipment-requests/${requestId}/forward`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!res.ok) {
//         throw new Error("Failed to forward request");
//       }
//       setEquipmentRequests(
//         equipmentRequests.map((req) =>
//           req._id === requestId ? { ...req, status: "forwarded" } : req
//         )
//       );
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ------------------ SCHEDULE MAINTENANCE REQUEST ------------------
//   const handleScheduleMaintenance = async (slotId: string) => {
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(`/api/maintenance-requests`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ slotId }),
//       });
//       if (!res.ok) {
//         throw new Error("Failed to schedule maintenance");
//       }
//       alert("Maintenance request sent to ICTS head");
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ------------------ INITIAL DATA FETCH ------------------
//   useEffect(() => {
//     fetchEquipmentRequests();
//     fetchFreeSlots();
//     setLoading(false);
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-8">
//         <div className="max-w-7xl mx-auto space-y-8">
//           <header className="mb-8 text-center">
//             <h1 className="text-4xl font-extrabold text-gray-800">
//               Technical Staff Dashboard
//             </h1>
//             <p className="text-gray-600">
//               Manage Equipment Requests and Schedule Lab Maintenance
//             </p>
//           </header>

//           {/* ------------------ EQUIPMENT REQUESTS CARD ------------------ */}
//           <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
//             <CardHeader className="bg-blue-600 rounded-t-lg px-6 py-4">
//               <CardTitle className="text-2xl font-bold text-white">
//                 Equipment Requests
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               {equipmentRequests.length === 0 ? (
//                 <p className="text-gray-600">
//                   No equipment requests available.
//                 </p>
//               ) : (
//                 <div className="space-y-4">
//                   {equipmentRequests.map((req) => (
//                     <div
//                       key={req._id}
//                       className="p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-sm"
//                     >
//                       <p>
//                         <strong>Requested By:</strong> {req.requestedBy.name} (
//                         {req.requestedBy.role})
//                       </p>
//                       <p>
//                         <strong>Equipment:</strong> {req.equipment}
//                       </p>
//                       <p>
//                         <strong>Reason:</strong> {req.reason}
//                       </p>
//                       <p>
//                         <strong>Status:</strong> {req.status}
//                       </p>
//                       {req.status === "pending" && (
//                         <div className="space-x-2 mt-2">
//                           <Button onClick={() => handleApproveRequest(req._id)}>
//                             Approve
//                           </Button>
//                           <Button
//                             variant="outline"
//                             onClick={() => handleForwardRequest(req._id)}
//                           >
//                             Forward to ICTS Head
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* ------------------ MAINTENANCE SCHEDULING CARD ------------------ */}
//           <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
//             <CardHeader className="bg-blue-600 rounded-t-lg px-6 py-4">
//               <CardTitle className="text-2xl font-bold text-white">
//                 Maintenance Scheduling
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               {freeSlots.length === 0 ? (
//                 <p className="text-gray-600">
//                   No free slots available for maintenance.
//                 </p>
//               ) : (
//                 <div className="space-y-4">
//                   {freeSlots.map((slot) => (
//                     <div
//                       key={slot._id}
//                       className="p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg shadow-sm flex justify-between items-center"
//                     >
//                       <div>
//                         <p>
//                           <strong>Lab:</strong> {slot.labName} (ID: {slot.labId}
//                           )
//                         </p>
//                         <p>
//                           <strong>Date:</strong> {slot.date}
//                         </p>
//                         <p>
//                           <strong>Time:</strong> {slot.startTime} -{" "}
//                           {slot.endTime}
//                         </p>
//                       </div>
//                       <Button
//                         onClick={() => handleScheduleMaintenance(slot._id)}
//                       >
//                         Request Maintenance
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbart";
// import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface EquipmentRequest {
//   _id: string;
//   equipmentId: string;
//   equipmentName: string;
//   reason: string;
//   status: "pending" | "approved" | "rejected" | "forwarded";
//   requestedAt: string;
// }

// interface FreeSlot {
//   _id: string;
//   labId: string;
//   labName: string;
//   date: string;
//   startTime: string;
//   endTime: string;
// }

// export default function TechnicalStaffDashboard() {
//   const router = useRouter();
//   const [equipmentRequests, setEquipmentRequests] = useState<
//     EquipmentRequest[]
//   >([]);
//   const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // ------------------ FETCH EQUIPMENT REQUESTS ------------------
//   const fetchEquipmentRequests = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }
//     try {
//       const res = await fetch("/api/equipment-requests", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch equipment requests");
//       }
//       // Adjust the response structure if needed.
//       setEquipmentRequests(Array.isArray(data) ? data : []);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ------------------ FETCH FREE SLOTS FOR MAINTENANCE ------------------
//   const fetchFreeSlots = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }
//     try {
//       const res = await fetch("/api/scheduled-labs", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch free slots");
//       }
//       setFreeSlots(Array.isArray(data.freeSlots) ? data.freeSlots : []);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ------------------ ACTION: APPROVE / FORWARD EQUIPMENT REQUEST ------------------
//   const handleEquipmentAction = async (
//     equipmentId: string,
//     requestId: string,
//     action: "approve" | "forward"
//   ) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }
//     try {
//       const res = await fetch("/api/equipment-requests/action", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ equipmentId, requestId, action }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || `Failed to ${action} request`);
//       }
//       // Refresh the equipment requests list.
//       fetchEquipmentRequests();
//       alert(`Request ${action}d successfully`);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ------------------ SCHEDULE MAINTENANCE ------------------
//   const handleScheduleMaintenance = async (slot: FreeSlot) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }
//     try {
//       const res = await fetch("/api/maintenancesched", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           labId: slot.labId,
//           freeSlotId: slot._id,
//           freeSlotDetails: {
//             date: slot.date,
//             startTime: slot.startTime,
//             endTime: slot.endTime,
//           },
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to schedule maintenance");
//       }
//       alert("Maintenance scheduling request sent successfully");
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   // ------------------ INITIAL DATA FETCH ------------------
//   useEffect(() => {
//     fetchEquipmentRequests();
//     fetchFreeSlots();
//     setLoading(false);
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-8">
//         <div className="max-w-7xl mx-auto space-y-8">
//           <header className="mb-8 text-center">
//             <h1 className="text-4xl font-extrabold text-gray-800">
//               Technical Staff Dashboard
//             </h1>
//             <p className="text-gray-600">
//               Manage Equipment Requests and Schedule Lab Maintenance
//             </p>
//           </header>

//           {/* ------------------ EQUIPMENT REQUESTS CARD ------------------ */}
//           <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
//             <CardHeader className="bg-blue-600 rounded-t-lg px-6 py-4">
//               <CardTitle className="text-2xl font-bold text-white">
//                 Equipment Requests
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               {equipmentRequests.length === 0 ? (
//                 <p className="text-gray-600">
//                   No equipment requests available.
//                 </p>
//               ) : (
//                 <div className="space-y-4">
//                   {equipmentRequests.map((req) => (
//                     <div
//                       key={req._id}
//                       className="p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-sm"
//                     >
//                       <p>
//                         <strong>Equipment:</strong> {req.equipmentName}
//                       </p>
//                       <p>
//                         <strong>Reason:</strong> {req.reason}
//                       </p>
//                       <p>
//                         <strong>Status:</strong> {req.status}
//                       </p>
//                       <p>
//                         <strong>Requested At:</strong>{" "}
//                         {new Date(req.requestedAt).toLocaleString()}
//                       </p>
//                       {req.status === "pending" && (
//                         <div className="space-x-2 mt-2">
//                           <Button
//                             onClick={() =>
//                               handleEquipmentAction(
//                                 req.equipmentId,
//                                 req._id,
//                                 "approve"
//                               )
//                             }
//                           >
//                             Approve
//                           </Button>
//                           <Button
//                             variant="outline"
//                             onClick={() =>
//                               handleEquipmentAction(
//                                 req.equipmentId,
//                                 req._id,
//                                 "forward"
//                               )
//                             }
//                           >
//                             Forward to ICTS Head
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* ------------------ MAINTENANCE SCHEDULING CARD ------------------ */}
//           <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
//             <CardHeader className="bg-blue-600 rounded-t-lg px-6 py-4">
//               <CardTitle className="text-2xl font-bold text-white">
//                 Maintenance Scheduling
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               {freeSlots.length === 0 ? (
//                 <p className="text-gray-600">
//                   No free slots available for maintenance.
//                 </p>
//               ) : (
//                 <div className="space-y-4">
//                   {freeSlots.map((slot) => (
//                     <div
//                       key={slot._id}
//                       className="p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg shadow-sm flex justify-between items-center"
//                     >
//                       <div>
//                         <p>
//                           <strong>Lab:</strong> {slot.labName} (ID: {slot.labId}
//                           )
//                         </p>
//                         <p>
//                           <strong>Date:</strong> {slot.date}
//                         </p>
//                         <p>
//                           <strong>Time:</strong> {slot.startTime} -{" "}
//                           {slot.endTime}
//                         </p>
//                       </div>
//                       <Button onClick={() => handleScheduleMaintenance(slot)}>
//                         Request Maintenance
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import Navbar from "@/components/Navbart";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EquipmentRequest {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "forwarded";
  requestedAt: string;
}

interface FreeSlot {
  _id: string;
  labId: string;
  labName: string;
  date: string;
  startTime: string;
  endTime: string;
}

const equipmentRequests: EquipmentRequest[] = [
  {
    _id: "1",
    equipmentId: "EQ-001",
    equipmentName: "Projector",
    reason: "Faculty needs a projector for an upcoming workshop in IT Lab 3.",
    status: "pending",
    requestedAt: "2025-04-02T10:00:00Z",
  },
  {
    _id: "2",
    equipmentId: "EQ-002",
    equipmentName: "Speakers",
    reason: "Faculty requested 2 speakers for IT Lab 3 audio setup.",
    status: "approved",
    requestedAt: "2025-04-01T12:30:00Z",
  },
  {
    _id: "3",
    equipmentId: "EQ-003",
    equipmentName: "Keyboard & Mouse",
    reason: "Student requested an additional keyboard and mouse for IT Lab 2.",
    status: "pending",
    requestedAt: "2025-04-01T15:00:00Z",
  },
];

const freeSlots: FreeSlot[] = [
  {
    _id: "101",
    labId: "LAB-001",
    labName: "IT Lab 1",
    date: "2025-04-05",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
  },
  {
    _id: "102",
    labId: "LAB-002",
    labName: "PG Lab",
    date: "2025-04-06",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
  },
];

export default function TechnicalStaffDashboard() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center">
            Technical Staff Dashboard
          </h1>

          {/* Equipment Requests */}
          <Card className="bg-white shadow-xl rounded-lg border border-gray-200">
            <CardHeader className="bg-blue-600 rounded-t-lg px-6 py-4">
              <CardTitle className="text-2xl font-bold text-white">
                Equipment Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {equipmentRequests.length === 0 ? (
                <p className="text-gray-600">
                  No equipment requests available.
                </p>
              ) : (
                equipmentRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-sm mb-4"
                  >
                    <p>
                      <strong>Equipment:</strong> {req.equipmentName}
                    </p>
                    <p>
                      <strong>Reason:</strong> {req.reason}
                    </p>
                    <p>
                      <strong>Status:</strong> {req.status}
                    </p>
                    <p>
                      <strong>Requested At:</strong>{" "}
                      {new Date(req.requestedAt).toLocaleString()}
                    </p>
                    {req.status === "pending" && (
                      <div className="space-x-2 mt-2">
                        <Button>Approve</Button>
                        <Button variant="outline">Forward to ICTS Head</Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Free Slots for Maintenance */}
          <Card className="bg-white shadow-xl rounded-lg border border-gray-200">
            <CardHeader className="bg-blue-600 rounded-t-lg px-6 py-4">
              <CardTitle className="text-2xl font-bold text-white">
                Maintenance Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {freeSlots.length === 0 ? (
                <p className="text-gray-600">
                  No free slots available for maintenance.
                </p>
              ) : (
                freeSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className="p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg shadow-sm mb-4 flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <strong>Lab:</strong> {slot.labName} (ID: {slot.labId})
                      </p>
                      <p>
                        <strong>Date:</strong> {slot.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                    <Button>Request Maintenance</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
