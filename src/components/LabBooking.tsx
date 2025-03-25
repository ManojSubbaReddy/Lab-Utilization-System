// components/LabBooking.tsx
import React, { useEffect, useState } from "react";

interface Booking {
  _id: string;
  lab: string;
  requester: string;
  date: string;
  status: string;
}

const LabBooking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading lab bookings...</div>;

  return (
    <div>
      <h2>Lab Booking Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Lab</th>
            <th>Requester</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.lab}</td>
              <td>{booking.requester}</td>
              <td>{new Date(booking.date).toLocaleDateString()}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabBooking;
