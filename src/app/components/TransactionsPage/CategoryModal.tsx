import { Search } from "lucide-react";
import React from "react";

const CategoryModal = () => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md max-h-[90%] p-2">
        <div className="relative flex itemse-center p-2 border border-slate-600 rounded-2xl">
          <Search
            size={18}
            className="absolute top-1/2 left-2 -translate-y-1/2"
          />
          <input
            type="Search"
            placeholder="Search"
            className="outline-0 pl-8 pr-4 w-full text-sm"
          />
          <button className="text-xs text-white font-medium bg-gradient-to-br from-emerald-600 to-teal-600 py-2 px-6 rounded-xl">
            New
          </button>
        </div>

        <div>
            
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
