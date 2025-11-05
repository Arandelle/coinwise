import { Category } from "@/app/types/Transaction";
import {Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getLucideIcon } from "./InsightsSidebar";
import { CreateCategoryModal } from "./CreateCategoryModal";

interface GroupWithCategories {
  _id?: string;
  group_name: string;
  type: string;
  created_at: string;
  categories: Category[];
}

interface CategoryModalProps {
  onSelect: (category: Category) => void,
  onCancel: () => void
}

const CategoryModal = ({onSelect,  onCancel} : CategoryModalProps) => {
  const [categories, setCategories] = useState<GroupWithCategories[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [createCategory, setCreateCategory] = useState(false);

   async function fetchCategories() {
      try {
        const res = await fetch("/api/category");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: GroupWithCategories[] = await res.json();
        setCategories(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occured!");
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    fetchCategories();
  }, []);


  // call or fetch the category to show the new created category
  const handleCategoryCreated = () => {
    fetchCategories();
  }

  // Filter categories based on search
  const filteredCategories = categories.map((group) => ({
    ...group,
    categories: group.categories.filter((cat) =>
      cat.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-pulse text-gray-600">
            Loading categories...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md max-h-[90%] rounded-2xl flex flex-col">
        {/** Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Select Category
          </h2>
          <div className="relative flex items-center gap-2 p-3 border border-gray-300 rounded-xl focus:focus-within:border-emerald-500 focus-within:ring-emerald-100 transition-all">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none flex-1 text-sm text-slate-900 placeholder:text-gray-400"
            />
            <button 
            onClick={() => setCreateCategory(true)}
            className="flex items-center gap-1.5 text-xs text-white font-medium bg-gradient-to-br from-emerald-600 to-teal-600 py-2 px-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-sm">
              <Plus size={14} />
              New
            </button>
          </div>
        </div>

        {/** Categories list - Scrollable */}
        <div>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search size={48} className="mx-auto mb-3 opacity-30" />
              No Categories found!
            </div>
          ) : (
            <div className="space-y-6 p-4">
              {filteredCategories.map((group, index) => (
                <div key={index}>
                  {/** Group title */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <h3 className={`${group.type === "expense" ? "text-rose-500" : "text-emerald-500"} text-sm text-center tracking-wide`}>
                      {group.group_name}
                    </h3>
                  </div>

                  {/** Categories in grid */}
                  <div className="grid grid-cols-3 md:grid-cols-4 items-center">
                    {group.categories.length === 0 ? (
                      <div className="col-span-4 items-center text-center text-xs font-light text-slate-500 capitalize p-4">
                        No categories found
                      </div>
                    ) : (
                      group.categories.map((cat, catIndex) => {
                        const Icon = getLucideIcon(cat.icon)
                        return (
                          <button
                            key={catIndex}
                            onClick={() => onSelect({
                              ...cat,
                              category_group: group.group_name
                            })}
                            className="flex flex-col space-y-2 items-center justify-center p-4"
                          >
                            <div className="bg-rose-500 p-1 text-white rounded-full">
                              <Icon size={25} />
                            </div>
                            <span className="text-xs font-light text-slate-500 capitalize">
                              {cat.category_name}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
          onClick={onCancel}
          className="w-full py-3 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">
            Cancel
          </button>
        </div>
      </div>

      {createCategory && (
        <CreateCategoryModal
          isOpen={createCategory}
          onClose={() => setCreateCategory(false)}
          onSuccess={handleCategoryCreated}
        />
      )}
    </div>
  );
};

export default CategoryModal;
