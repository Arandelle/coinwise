// components/UserProfile.tsx
"use client";

import MiniCalendar from "@/app/components/MiniCalendar";

export default function Dashboarad() {
  
  return (
    <div className="grid grid-cols-3 p-6 bg-slate-50 max-w-3xl mx-auto rounded-md">
      <div className="mx-auto col-span-3">
        <MiniCalendar />
      </div>
    </div>
  );
}
