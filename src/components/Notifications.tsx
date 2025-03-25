// components/Notifications.tsx
import React, { useEffect, useState } from "react";

interface Notification {
  _id: string;
  message: string;
  type: string;
  date: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div>
      <h2>Notifications &amp; Communication</h2>
      <ul>
        {notifications.map((note) => (
          <li key={note._id}>
            {note.message} - {new Date(note.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
