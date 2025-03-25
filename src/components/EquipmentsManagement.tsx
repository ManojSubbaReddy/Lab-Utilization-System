// components/EquipmentManagement.tsx
import React, { useEffect, useState } from "react";

interface Equipment {
  _id: string;
  name: string;
  status: string;
}

const EquipmentManagement: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/equipment")
      .then((res) => res.json())
      .then((data) => {
        setEquipment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading equipment data...</div>;

  return (
    <div>
      <h2>Equipment &amp; Resource Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((eq) => (
            <tr key={eq._id}>
              <td>{eq.name}</td>
              <td>{eq.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentManagement;
