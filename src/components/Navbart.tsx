"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold">Lab Utilisation System</div>
      <div className="space-x-4 flex items-center">
        <Link href="/dashboard/ts" className="text-sm hover:underline">
          Dashboard
        </Link>
        {/* <Link href="/dashboard/ts/profile" className="text-sm hover:underline">
          Profile
        </Link> */}

        <Link
          href="/dashboard/ts/notifications"
          className="text-sm hover:underline"
        >
          Notifications
        </Link>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="text-white border-white hover:bg-white hover:text-indigo-600"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
