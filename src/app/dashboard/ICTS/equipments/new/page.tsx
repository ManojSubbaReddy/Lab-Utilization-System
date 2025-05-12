"use client";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import Navbar from "@/components/Navbari";
// // import {
// //   Card,
// //   CardHeader,
// //   CardContent,
// //   CardFooter,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";

// // interface LabOption {
// //   _id: string;
// //   name: string;
// // }

// // export default function CreateEquipmentPage() {
// //   const router = useRouter();
// //   const [name, setName] = useState("");
// //   const [specifications, setSpecifications] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [availableCount, setAvailableCount] = useState<number>(0);
// //   const [lab, setLab] = useState("");
// //   const [labOptions, setLabOptions] = useState<LabOption[]>([]);
// //   const [error, setError] = useState<string | null>(null);

// //   const fetchLabs = async () => {
// //     setLoading(true);
// //     const token = localStorage.getItem("token");
// //     console.log("Token:", token);
// //     if (!token) {
// //       router.push("/auth/login");
// //       return;
// //     }
// //     try {
// //       const res = await fetch(`/api/labs`, {
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });
// //       const data = await res.json();
// //       if (!res.ok) {
// //         throw new Error(data.message || "Failed to fetch labs");
// //       }
// //       // Assuming the API returns the labs in data.labs
// //       setLabOptions(Array.isArray(data.labs) ? data.labs : []);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchLabs();
// //   }, []);
// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     setError(null);

// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       router.push("/auth/login");
// //       return;
// //     }

// //     try {
// //       const res = await fetch("/api/equipment", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           name,
// //           specifications,
// //           availableCount,
// //           labId: lab,
// //         }),
// //       });

// //       const data = await res.json();
// //       if (!res.ok) {
// //         throw new Error(data.message || "Failed to create equipment");
// //       }

// //       router.push("/dashboard/equipments");
// //     } catch (err: any) {
// //       setError(err.message);
// //     }
// //   };

// //   return (
// //     <>
// //       <Navbar />
// //       <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
// //         <div className="max-w-3xl mx-auto">
// //           <h1 className="text-4xl font-bold mb-8">Add New Equipment</h1>
// //           {error && <p className="mb-4 text-red-600">{error}</p>}
// //           <Card className="bg-white shadow-lg">
// //             <CardHeader>
// //               <CardTitle className="text-2xl font-bold">
// //                 Equipment Details
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <form onSubmit={handleSubmit} className="space-y-4">
// //                 <div>
// //                   <Label htmlFor="name">Equipment Name</Label>
// //                   <Input
// //                     id="name"
// //                     type="text"
// //                     value={name}
// //                     onChange={(e) => setName(e.target.value)}
// //                     required
// //                     className="mt-1"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="specifications">Specifications</Label>
// //                   <Input
// //                     id="specifications"
// //                     type="text"
// //                     value={specifications}
// //                     onChange={(e) => setSpecifications(e.target.value)}
// //                     className="mt-1"
// //                   />
// //                 </div>
// //                 <div>
// //                   <Label htmlFor="availableCount">Available Count</Label>
// //                   <Input
// //                     id="availableCount"
// //                     type="number"
// //                     value={availableCount}
// //                     onChange={(e) => setAvailableCount(Number(e.target.value))}
// //                     required
// //                     className="mt-1"
// //                   />
// //                 </div>

// //                 <div>
// //                   {loading && <p>Loading labs...</p>}
// //                   {error && <p>Error: {error}</p>}
// //                   <div>
// //                     <Label htmlFor="lab">Assign to Lab</Label>
// //                     <select
// //                       id="lab"
// //                       value={lab}
// //                       onChange={(e) => setLab(e.target.value)}
// //                       className="w-full p-2 mt-1 border rounded"
// //                       required
// //                     >
// //                       <option value="">Select Lab</option>
// //                       {labOptions.map((option) => (
// //                         <option key={option._id} value={option._id}>
// //                           {option.name}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                 </div>
// //                 <Button type="submit">Add Equipment</Button>
// //               </form>
// //             </CardContent>
// //             <CardFooter>
// //               <Button
// //                 variant="outline"
// //                 onClick={() => router.push("/dashboard/equipments")}
// //               >
// //                 Back to Equipment List
// //               </Button>
// //             </CardFooter>
// //           </Card>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

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
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface LabOption {
//   _id: string;
//   name: string;
// }

// export default function CreateEquipmentPage() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [specifications, setSpecifications] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [availableCount, setAvailableCount] = useState<number>(0);
//   const [lab, setLab] = useState("");
//   const [labOptions, setLabOptions] = useState<LabOption[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const fetchLabs = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     console.log("Token:", token);
//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }
//     try {
//       const res = await fetch(`/api/labs`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch labs");
//       }
//       // Assuming the API returns the labs in data.labs
//       setLabOptions(Array.isArray(data.labs) ? data.labs : []);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLabs();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);

//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/auth/login");
//       return;
//     }

//     try {
//       const res = await fetch("/api/equipment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         // Change labId to lab so that backend receives the field it expects.
//         body: JSON.stringify({
//           name,
//           specifications,
//           availableCount,
//           lab, // backend expects "lab"
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to create equipment");
//       }

//       router.push("/dashboard/ICTS/equipments");
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
//         <div className="max-w-3xl mx-auto">
//           <h1 className="text-4xl font-bold mb-8">Add New Equipment</h1>
//           {error && <p className="mb-4 text-red-600">{error}</p>}
//           <Card className="bg-white shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold">
//                 Equipment Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <Label htmlFor="name">Equipment Name</Label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                     className="mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="specifications">Specifications</Label>
//                   <Input
//                     id="specifications"
//                     type="text"
//                     value={specifications}
//                     onChange={(e) => setSpecifications(e.target.value)}
//                     className="mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="availableCount">Available Count</Label>
//                   <Input
//                     id="availableCount"
//                     type="number"
//                     value={availableCount}
//                     onChange={(e) => setAvailableCount(Number(e.target.value))}
//                     required
//                     className="mt-1"
//                   />
//                 </div>

//                 <div>
//                   {loading && <p>Loading labs...</p>}
//                   {error && <p>Error: {error}</p>}
//                   <div>
//                     <Label htmlFor="lab">Assign to Lab</Label>
//                     <select
//                       id="lab"
//                       value={lab}
//                       onChange={(e) => setLab(e.target.value)}
//                       className="w-full p-2 mt-1 border rounded"
//                       required
//                     >
//                       <option value="">Select Lab</option>
//                       {labOptions.map((option) => (
//                         <option key={option._id} value={option._id}>
//                           {option.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <Button type="submit">Add Equipment</Button>
//               </form>
//             </CardContent>
//             <CardFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => router.push("/dashboard/ICTS/equipments")}
//               >
//                 Back to Equipment List
//               </Button>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LabOption {
  _id: string;
  name: string;
}

export default function CreateEquipmentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableCount, setAvailableCount] = useState<number>(0);
  const [lab, setLab] = useState("");
  const [labOptions, setLabOptions] = useState<LabOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLabs = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      router.push("/auth/login");
      return;
    }
    try {
      const res = await fetch(`/api/labs`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch labs");
      }
      // Assuming the API returns the labs in data.labs
      setLabOptions(Array.isArray(data.labs) ? data.labs : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Change labId to lab so that backend receives the field it expects.
        body: JSON.stringify({
          name,
          specifications,
          availableCount,
          lab, // backend expects "lab"
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create equipment");
      }

      router.push("/dashboard/ICTS/equipments");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Add New Equipment</h1>
          {error && <p className="mb-4 text-red-600">{error}</p>}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Equipment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Equipment Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="specifications">Specifications</Label>
                  <Input
                    id="specifications"
                    type="text"
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="availableCount">Available Count</Label>
                  <Input
                    id="availableCount"
                    type="number"
                    value={availableCount}
                    onChange={(e) => setAvailableCount(Number(e.target.value))}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  {loading && <p>Loading labs...</p>}
                  {error && <p>Error: {error}</p>}
                  <div>
                    <Label htmlFor="lab">Assign to Lab</Label>
                    <select
                      id="lab"
                      value={lab}
                      onChange={(e) => setLab(e.target.value)}
                      className="w-full p-2 mt-1 border rounded"
                      required
                    >
                      <option value="">Select Lab</option>
                      {labOptions.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button type="submit">Add Equipment</Button>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/ICTS/equipments")}
              >
                Back to Equipment List
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
