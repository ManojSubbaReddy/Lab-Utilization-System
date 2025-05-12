// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";

// export default function Navbar() {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     router.push("/auth/login");
//   };

//   return (
//     <nav className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
//       <div className="text-2xl font-bold">Lab Utilisation System</div>
//       <div className="space-x-4 flex items-center">
//         <Link href="/dashboard/ICTS" className="text-sm hover:underline">
//           Dashboard
//         </Link>
//         <Link
//           href="/dashboard/ICTS/profile"
//           className="text-sm hover:underline"
//         >
//           Profile
//         </Link>

//         <Link
//           href="/dashboard/ICTS/notifications"
//           className="text-sm hover:underline"
//         >
//           Notifications
//         </Link>
//         {/* <Link
//           href="/dashboard/faculty/booking-history"
//           className="text-sm hover:underline"
//         >
//           Booking History
//         </Link> */}
//         <Button
//           variant="outline"
//           onClick={handleLogout}
//           className="text-white border-white hover:bg-white hover:text-indigo-600"
//         >
//           Logout
//         </Button>
//       </div>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-bold">Lab Utilisation System</div>
      <div className="space-x-4 flex items-center relative">
        <Link href="/dashboard/ICTS" className="text-sm hover:underline">
          Dashboard
        </Link>
        {/* <Link
          href="/dashboard/ICTS/profile"
          className="text-sm hover:underline"
        >
          Profile
        </Link> */}
        <Link
          href="/dashboard/ICTS/notifications"
          className="text-sm hover:underline"
        >
          Notifications
        </Link>
        {/* New dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-sm hover:underline focus:outline-none"
          >
            New ▾
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
              <Link
                href="/dashboard/ICTS/new"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Labs
              </Link>
              <Link
                href="/dashboard/ICTS/equipments/new"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Equipment
              </Link>
            </div>
          )}
        </div>
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
