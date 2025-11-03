"use client";

import { useState } from "react";
import { categoryIcons } from "@/app/components/TransactionsPage/constants";

type IconPickerProps = {
  value?: string;
  onChange: (iconName: string) => void;
};

export function IconsModal({ value, onChange }: IconPickerProps) {
  const [selected, setSelected] = useState(value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-mono font-light">
      <div className="bg-white grid grid-cols-6 gap-3 p-2 z-50 w-full max-w-md nax-h-[90vh]">
        {categoryIcons.map(({ name, icon: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => {setSelected(name); onChange(name)}}
            className={`p-2 flex items-center justify-center rounded-full border transition hover:bg-gray-100 ${
              selected === name && "bg-blue-500 border-blue-600"
            }`}
          >
            <Icon size={20}/>
          </button>
        ))}
      </div>
    </div>
  );
}
