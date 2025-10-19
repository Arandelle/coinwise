"use client"

import React from "react";
import MiniCalendar from "../../components/MiniCalendar";

const Dashboard = () => {
  const events = [
    { id: 1, date: "2025-10-20", title: "Payday", color: "#10B981" },
    { id: 2, date: "2025-10-22", title: "Loan due", color: "#EF4444" },
  ];
  const [selected, setSelected] = React.useState<Date | undefined>(new Date());

  return (
    <div className="p-6">
      <MiniCalendar
        value={selected}
        onChange={(d) => setSelected(d)}
        events={events}
        startWeekOnMonday={false}
      />
      <div className="mt-4">
        Selected: {selected ? selected.toDateString() : "none"}
      </div>
    </div>
  );
};

export default Dashboard;
