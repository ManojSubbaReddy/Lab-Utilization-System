// "use client";

// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbarf";
// import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface Notification {
//   _id: string;
//   message: string;
//   type: "lab-booking" | "equipment-request";
//   createdAt: string;
//   read: boolean;
// }

// export default function NotificationsPage() {
//   const router = useRouter();

//   // Hardcoded notifications
//   const notifications: Notification[] = [
//     {
//       _id: "1",
//       message:
//         "Technical staff has requested 15 chairs for lab reorganization as the current count exceeds 10.",
//       type: "equipment-request",
//       createdAt: new Date().toISOString(),
//       read: false,
//     },
//     {
//       _id: "2",
//       message:
//         "Request for 12 monitors has been submitted to replace outdated displays in the lab.",
//       type: "equipment-request",
//       createdAt: new Date().toISOString(),
//       read: false,
//     },
//     {
//       _id: "3",
//       message:
//         "Technical staff requested 11 CPUs and 11 keyboards to upgrade lab systems due to increased usage.",
//       type: "equipment-request",
//       createdAt: new Date().toISOString(),
//       read: false,
//     },
//     {
//       _id: "4",
//       message:
//         "A request for 13 projectors and 14 speakers has been made to enhance lab presentations and audio support.",
//       type: "equipment-request",
//       createdAt: new Date().toISOString(),
//       read: false,
//     },
//   ];

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
//         <div className="max-w-7xl mx-auto space-y-8">
//           <header className="text-center mb-8">
//             <h1 className="text-4xl font-bold">Notifications</h1>
//           </header>

//           {notifications.length === 0 ? (
//             <div className="text-center text-2xl text-gray-600">
//               😢 No notifications at this time.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {notifications.map((notif) => (
//                 <Card
//                   key={notif._id}
//                   className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300"
//                 >
//                   <CardHeader>
//                     <CardTitle className="text-2xl font-bold text-indigo-700">
//                       {notif.type === "lab-booking"
//                         ? "Lab Booking"
//                         : "Equipment Request"}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-gray-800">{notif.message}</p>
//                     <p className="text-gray-500 text-sm">
//                       {new Date(notif.createdAt).toLocaleDateString("en-US")}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           <div className="flex justify-center mt-8">
//             <Button onClick={() => router.push("/dashboard/faculty")}>
//               Back to Dashboard
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbari";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Notification {
  _id: string;
  staffName: string;
  reason: string;
  equipment: string;
  type: "lab-booking" | "equipment-request";
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();

  // Hardcoded notifications with separate fields for reason and equipment need
  const notifications: Notification[] = [
    {
      _id: "1",
      staffName: "Aravind",
      equipment: "15 chairs",
      reason: "Lab reorganization due to overcrowding",
      type: "equipment-request",
      read: false,
    },
    {
      _id: "2",
      staffName: "Karthikram",
      equipment: "12 monitors",
      reason: "Replacing outdated displays",
      type: "equipment-request",
      read: false,
    },
    {
      _id: "3",
      staffName: "Manoj",
      equipment: "14 mouses and 11 keyboards",
      reason: "Replacing malfunctioning devices",
      type: "equipment-request",
      read: false,
    },
    {
      _id: "4",
      staffName: "Ram",
      equipment: "13 projectors and 14 speakers",
      reason: "AEEE Workshop presentations and audio support",
      type: "equipment-request",
      read: false,
    },
  ];

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
                      {notif.type === "lab-booking"
                        ? "Lab Booking"
                        : "Equipment Request"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-800">
                      <strong>Requested by:</strong> {notif.staffName}
                    </p>
                    <p className="text-gray-800 mt-2">
                      <strong>Equipment Needed:</strong> {notif.equipment}
                    </p>
                    <p className="text-gray-800 mt-2">
                      <strong>Reason:</strong> {notif.reason}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Button onClick={() => router.push("/dashboard/ICTS")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
