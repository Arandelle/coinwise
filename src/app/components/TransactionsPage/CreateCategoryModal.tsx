"use client";

import { useState, useEffect } from "react";
import { categoryIcons } from "@/app/components/TransactionsPage/constants";
import { X } from "lucide-react";

type CategoryGroup = {
  _id: string;
  group_name: string;
};

type CreateCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function CreateCategoryModal({ isOpen, onClose, onSuccess }: CreateCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedType, setSelectedType] = useState<"income" | "expense">("expense");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCategoryGroups();
    }
  }, [isOpen]);

  const fetchCategoryGroups = async () => {
    try {
      const res = await fetch("/api/category-groups");
      if (!res.ok) throw new Error("Failed to fetch category groups");
      const data = await res.json();
      setCategoryGroups(data);
    } catch (err) {
      console.error("Error fetching category groups:", err);
      setError("Failed to load category groups");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    if (!selectedIcon) {
      setError("Please select an icon");
      return;
    }

    if (!selectedGroup) {
      setError("Please select a category group");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_id: selectedGroup,
          category_name: categoryName,
          type: selectedType,
          icon: selectedIcon,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      // Reset form
      setCategoryName("");
      setSelectedIcon("");
      setSelectedType("expense");
      setSelectedGroup("");
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-mono font-light">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Create Category</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Category Name */}
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium mb-1">
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
            />
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedType("expense")}
                className={`flex-1 py-2 px-4 rounded border transition ${
                  selectedType === "expense"
                    ? "bg-red-500 text-white border-red-600"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("income")}
                className={`flex-1 py-2 px-4 rounded border transition ${
                  selectedType === "income"
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Category Group */}
          <div>
            <label htmlFor="categoryGroup" className="block text-sm font-medium mb-1">
              Category Group
            </label>
            <select
              id="categoryGroup"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a group</option>
              {categoryGroups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.group_name}
                </option>
              ))}
            </select>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Icon</label>
            <div className="grid grid-cols-6 gap-2 p-3 border border-gray-300 rounded max-h-64 overflow-y-auto">
              {categoryIcons.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedIcon(name)}
                  className={`p-3 flex items-center justify-center rounded border transition hover:bg-gray-100 ${
                    selectedIcon === name
                      ? "bg-blue-500 text-white border-blue-600"
                      : "border-gray-300"
                  }`}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}