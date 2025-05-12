// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbari";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface Equipment {
//   _id: string;
//   name: string;
//   specifications: string;
//   availableCount: number;
//   labId: string;
// }

// export default function EquipmentsListPage() {
//   const router = useRouter();
//   const [equipments, setEquipments] = useState<Equipment[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchEquipments = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }
//     try {
//       const res = await fetch("/api/equipment", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch equipments");
//       }
//       // Assuming the API returns the equipments in data.equipments
//       setEquipments(Array.isArray(data.equipments) ? data.equipments : []);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEquipments();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold mb-8">Equipments List</h1>
//           {loading && <p>Loading equipments...</p>}
//           {error && <p className="mb-4 text-red-600">{error}</p>}
//           {equipments.length === 0 && !loading ? (
//             <p>No equipments found.</p>
//           ) : (
//             <Card className="mb-8">
//               <CardHeader>
//                 <CardTitle className="text-2xl">Equipments</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <table className="min-w-full table-auto">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="px-4 py-2 text-left">Name</th>
//                       <th className="px-4 py-2 text-left">Specifications</th>
//                       <th className="px-4 py-2 text-left">Available Count</th>
//                       <th className="px-4 py-2 text-left">Lab ID</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {equipments.map((equipment) => (
//                       <tr key={equipment._id} className="border-b">
//                         <td className="px-4 py-2">{equipment.name}</td>
//                         <td className="px-4 py-2">
//                           {equipment.specifications}
//                         </td>
//                         <td className="px-4 py-2">
//                           {equipment.availableCount}
//                         </td>
//                         <td className="px-4 py-2">{equipment.labId}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </CardContent>
//               <CardFooter className="flex justify-end">
//                 <Button
//                   variant="outline"
//                   onClick={() => router.push("/dashboard/ICTS/equipments/new")}
//                 >
//                   Add Equipment
//                 </Button>
//               </CardFooter>
//             </Card>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbari";
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
  name: string;
  availableCount: number;
  labId: string;
  labName: string;
}

export default function EquipmentsListPage() {
  const router = useRouter();

  // Hardcoded equipment data for the labs
  const equipments: Equipment[] = [
    {
      _id: "1",
      name: "System",
      availableCount: 70,
      labId: "LAB-1742328708118",
      labName: "IT Lab 3",
    },
    {
      _id: "2",
      name: "System",
      availableCount: 60,
      labId: "LAB-1742328708119",
      labName: "IT Lab 2",
    },
    {
      _id: "3",
      name: "Speaker",
      availableCount: 1,
      labId: "LAB-1742328708120",
      labName: "IT Lab 4",
    },
    {
      _id: "4",
      name: "Projector",
      availableCount: 1,
      labId: "LAB-1742365290831",
      labName: "IT Lab 1",
    },
    {
      _id: "5",
      name: "System",
      availableCount: 80,
      labId: "LAB-1742467482720",
      labName: "PG Lab",
    },
    {
      _id: "6",
      name: "System",
      availableCount: 70,
      labId: "LAB-1742467482720",
      labName: "IT Lab 4",
    },
    {
      _id: "7",
      name: "System",
      availableCount: 60,
      labId: "LAB-1742467482720",
      labName: "IT Lab 1",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Equipments List</h1>

          {equipments.length === 0 ? (
            <p>No equipments found.</p>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Equipments</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Available Count</th>
                      <th className="px-4 py-2 text-left">Lab ID</th>
                      <th className="px-4 py-2 text-left">Lab Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipments.map((equipment) => (
                      <tr key={equipment._id} className="border-b">
                        <td className="px-4 py-2">{equipment.name}</td>
                        <td className="px-4 py-2">
                          {equipment.availableCount}
                        </td>
                        <td className="px-4 py-2">{equipment.labId}</td>
                        <td className="px-4 py-2">{equipment.labName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/ICTS/equipments/new")}
                >
                  Add Equipment
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
