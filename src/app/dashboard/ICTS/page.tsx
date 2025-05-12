"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbari";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Lab {
  _id: string;
  labId: string;
  name: string;
  location: string;
  capacity: number;
  lab_incharge: string;
}

interface User {
  _id: string;
  userId: string;
  email: string;
  status: "active" | "inactive";
  role: string;
  profile: {
    name: string;
  };
  lastLoggedIn: string; // new field containing the last login time as an ISO date string
}

// interface User {
//   _id: string;
//   userId: string;
//   email: string;
//   status: "active" | "inactive";
//   role: string;
//   profile: {
//     name: string;
//   };
// }

interface ScheduledLab {
  _id: string;
  lab: {
    _id: string;
    name: string;
    labId?: string; // if you want to display Lab ID in session card
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

export default function ICTSLabManagerDashboard() {
  const router = useRouter();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [scheduledLabs, setScheduledLabs] = useState<ScheduledLab[]>([]);
  const [userFilterRole, setUserFilterRole] = useState<string>("all");

  // ------------------ FETCH LABS ------------------
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
      setLabs(Array.isArray(data.labs) ? data.labs : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ FETCH USERS ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("/api/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        setUsers(data.users);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Error fetching users");
      });
  }, [router]);

  // ------------------ FETCH SCHEDULED LABS ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetch("/api/scheduled-labs/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch scheduled labs");
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

  // Initial fetch of labs
  useEffect(() => {
    fetchLabs();
  }, []);

  // ------------------ CRUD HANDLERS ------------------
  const handleCreateNewLab = () => {
    router.push("/dashboard/ICTS/new");
  };

  const handleEditLab = (labId: string) => {
    router.push(`/dashboard/ICTS/edit/${labId}`);
  };

  const filteredUsers = users.filter((user) => {
    if (userFilterRole !== "all" && user.role !== userFilterRole) {
      return false;
    }
    return true;
  });

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
      <div className="min-h-screen bg-gradient-to-r from-green-50 to-teal-50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-800">
              ICTS Lab Manager Dashboard
            </h1>
            <p className="text-gray-600">
              Manage Labs, Users, and Scheduled Lab Bookings
            </p>
          </header>

          {/* ------------------ LABS MANAGEMENT CARD ------------------
          <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex justify-between items-center bg-teal-600 rounded-t-lg px-6 py-4">
              <CardTitle className="text-2xl font-bold text-white">
                Labs Management
              </CardTitle>
              <Button onClick={handleCreateNewLab}>Create New Lab</Button>
            </CardHeader>
            <CardContent className="p-6">
              {labs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <span className="text-6xl">😢</span>
                  <p className="mt-4 text-gray-600 text-lg">
                    No labs available.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {labs.map((lab) => (
                    <div
                      key={lab._id}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-100 to-green-100 rounded-lg shadow-sm"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {lab.name}
                        </h3>
                        <p className="text-gray-700">
                          <strong>Lab ID:</strong> {lab.labId}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="default"
                          onClick={() => handleEditLab(lab._id)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card> */}

          <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex justify-between items-center bg-teal-600 rounded-t-lg px-6 py-4">
              <CardTitle className="text-2xl font-bold text-white">
                Labs Management
              </CardTitle>
              <Button onClick={handleCreateNewLab}>Create New Lab</Button>
            </CardHeader>
            <CardContent className="p-6 max-h-96 overflow-y-auto">
              {" "}
              {/* Added max-h and overflow */}
              {labs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <span className="text-6xl">😢</span>
                  <p className="mt-4 text-gray-600 text-lg">
                    No labs available.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {labs.map((lab) => (
                    <div
                      key={lab._id}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-100 to-green-100 rounded-lg shadow-sm"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {lab.name}
                        </h3>
                        <p className="text-gray-700">
                          <strong>Lab ID:</strong> {lab.labId}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="default"
                          onClick={() => handleEditLab(lab._id)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ------------------ REGISTERED USERS CARD ------------------ */}
          <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-teal-600 rounded-t-lg px-6 py-4">
              <CardTitle className="text-2xl font-bold text-white">
                Registered Users Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 max-h-96 overflow-y-auto">
              {" "}
              {/* Added max-h-96 and overflow-y-auto */}
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="block text-gray-700">Role:</label>
                  <select
                    value={userFilterRole}
                    onChange={(e) => setUserFilterRole(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="all">All</option>
                    <option value="faculty">Faculty</option>
                    <option value="student">Student</option>
                    <option value="ICTS-Lab Manager">ICTS-Lab Manager</option>
                    <option value="Technical Staff">Technical Staff</option>
                  </select>
                </div>
              </div>
              {/* Users Table */}
              {filteredUsers.length === 0 ? (
                <p className="text-gray-600">
                  No users found with selected filters.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        User-Id
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Role
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Days Inactive
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => {
                      // Calculate days inactive
                      const lastLogin = new Date(user.lastLoggedIn).getTime();
                      const now = Date.now();
                      const diffInDays = Math.floor(
                        (now - lastLogin) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <tr key={user._id}>
                          <td className="px-4 py-2">{user.profile.name}</td>
                          <td className="px-4 py-2">{user.userId}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2 capitalize">{user.role}</td>
                          <td className="px-4 py-2 capitalize">
                            {user.status}
                          </td>
                          <td className="px-4 py-2">
                            {isNaN(diffInDays) ? "N/A" : diffInDays}
                          </td>
                          <td className="px-4 py-2">
                            <Button
                              onClick={() =>
                                router.push(
                                  `/dashboard/icts-lab-manager/update-user/${user._id}`
                                )
                              }
                            >
                              Deactivate User
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-teal-600 rounded-t-lg px-6 py-4">
              <CardTitle className="text-2xl font-bold text-white">
                Registered Users Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Filters }
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="block text-gray-700">Role:</label>
                  <select
                    value={userFilterRole}
                    onChange={(e) => setUserFilterRole(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="all">All</option>
                    <option value="faculty">Faculty</option>
                    <option value="student">Student</option>
                    <option value="ICTS-Lab Manager">ICTS-Lab Manager</option>
                    <option value="Technical Staff">Technical Staff</option>
                  </select>
                </div>
              </div>
              {/* Users Table }
              {filteredUsers.length === 0 ? (
                <p className="text-gray-600">
                  No users found with selected filters.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        User-Id
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Role
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Days Inactive
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => {
                      // Calculate days inactive
                      const lastLogin = new Date(user.lastLoggedIn).getTime();
                      const now = Date.now();
                      const diffInDays = Math.floor(
                        (now - lastLogin) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <tr key={user._id}>
                          <td className="px-4 py-2">{user.profile.name}</td>
                          <td className="px-4 py-2">{user.userId}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2 capitalize">{user.role}</td>
                          <td className="px-4 py-2 capitalize">
                            {user.status}
                          </td>
                          <td className="px-4 py-2">
                            {isNaN(diffInDays) ? "N/A" : diffInDays}
                          </td>
                          <td className="px-4 py-2">
                            <Button
                              onClick={() =>
                                router.push(
                                  `/dashboard/icts-lab-manager/update-user/${user._id}`
                                )
                              }
                            >
                              Deactivate User
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card> */}

          {/* ------------------ SCHEDULED LAB BOOKINGS CARD ------------------ */}
          <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-teal-600 rounded-t-lg px-6 py-4">
              <CardTitle className="text-2xl font-bold text-white">
                Edit Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {scheduledLabs ? (
                scheduledLabs.filter((lab) => lab.status === "scheduled")
                  .length === 0 ? (
                  <p className="text-gray-600">No scheduled lab bookings.</p>
                ) : (
                  <div>
                    <p className="text-gray-800 mb-4">
                      You have{" "}
                      {
                        scheduledLabs.filter(
                          (lab) => lab.status === "scheduled"
                        ).length
                      }{" "}
                      scheduled booking(s).
                    </p>
                    <Button
                      onClick={() =>
                        router.push("/dashboard/ICTS/scheduled-labs")
                      }
                    >
                      Manage Bookings
                    </Button>
                  </div>
                )
              ) : (
                <p>Loading...</p>
              )}
            </CardContent>
          </Card>

          {/* ------------------ QUICK ACTIONS CARD ------------------ */}
          {/* <Card className="bg-white shadow-xl rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-teal-600 rounded-t-lg px-6 py-4">
              <CardTitle className="text-2xl font-bold text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 p-6">
              <Button
                onClick={() =>
                  router.push("/dashboard/icts-lab-manager/deactivate-accounts")
                }
              >
                Deactivate Inactive Accounts
              </Button>
              <Button
                onClick={() =>
                  router.push("/dashboard/icts-lab-manager/assign-update-roles")
                }
              >
                Assign/Update User Roles
              </Button>
              <Button
                onClick={() =>
                  router.push("/dashboard/icts-lab-manager/lab-access-requests")
                }
              >
                Approve/Reject Lab Access Requests
              </Button>
            </CardContent>
          </Card>*/}
        </div>
      </div>
    </>
  );
}
