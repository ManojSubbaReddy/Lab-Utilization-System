// components/DashboardLayout.tsx
import React from "react";
import Link from "next/link";

const DashboardLayout: React.FC = ({ children }) => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <Link href="/dashboard">
                <a>Dashboard Home</a>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/users">
                <a>User Management</a>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/bookings">
                <a>Lab Bookings</a>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/equipment">
                <a>Equipment</a>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/notifications">
                <a>Notifications</a>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/reports">
                <a>Reports</a>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="content">{children}</main>
      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
        }
        .sidebar {
          width: 220px;
          background: #f4f4f4;
          padding: 1rem;
        }
        .content {
          flex: 1;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
