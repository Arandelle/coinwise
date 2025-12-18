"use client";

import { useState } from "react";
import { categoryIcons } from "../constants";
import { X } from "lucide-react";
import { useCategoryGroups, useCreateCategory } from "@/app/hooks/useApi";
import { Category } from "@/app/types/Category";

type CreateCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function CreateCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCategoryModalProps) {
  // use react
  const { data: categoryGroups, isLoading: isLoadingGroups } =
    useCategoryGroups();
  const createCategoryMutation = useCreateCategory();
  const [categoryDetails, setCategoryDetails] = useState<Category>({
    _id: "",
    category_name: "",
    type: "expense",
    icon: "",
    group_id: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryDetails.category_name.trim()) {
      setError("Category name is required");
      return;
    }

    if (!categoryDetails.icon) {
      setError("Please select an icon");
      return;
    }

    if (!categoryDetails.group_id) {
      setError("Please select a category group");
      return;
    }

    createCategoryMutation.mutate(
      {
        group_id: categoryDetails.group_id,
        category_name: categoryDetails.category_name,
        type: categoryDetails.type,
        icon: categoryDetails.icon,
      },
      {
        onSuccess: () => {
          // Reset Form
          setCategoryDetails({
            _id: "",
            category_name: "",
            type: "expense",
            icon: "",
            group_id: "",
          });
          onSuccess?.();
          onClose();
        },
        onError: (err) => {
          console.error("Error creating category:", err);
          setError(
            err instanceof Error ? err.message : "Failed to create category"
          );
        },
      }
    );
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
            <label
              htmlFor="categoryName"
              className="block text-sm font-medium mb-1"
            >
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              value={categoryDetails.category_name}
              onChange={(e) => setCategoryDetails({
                ...categoryDetails,
                category_name: e.target.value
              })}
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
                onClick={() => setCategoryDetails({
                  ...categoryDetails,
                  type: "expense"
                })}
                className={`flex-1 py-2 px-4 rounded border transition ${
                  categoryDetails.type === "expense"
                    ? "bg-red-500 text-white border-red-600"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setCategoryDetails({
                  ...categoryDetails,
                  type: "income"
                })}
                className={`flex-1 py-2 px-4 rounded border transition ${
                  categoryDetails.type === "income"
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
            <label
              htmlFor="categoryGroup"
              className="block text-sm font-medium mb-1"
            >
              Category Group
            </label>
            <select
              id="categoryGroup"
              value={categoryDetails.group_id}
              onChange={(e) => setCategoryDetails({
                ...categoryDetails,
                group_id: e.target.value
              })}
              disabled={isLoadingGroups}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {isLoadingGroups ? "Loading Groups" : "Select Group"}
              </option>
              {categoryGroups
                ?.filter((cat) => cat.type === categoryDetails.type)
                .map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.group_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Icon
            </label>
            <div className="grid grid-cols-6 gap-2 p-3 border border-gray-300 rounded max-h-64 overflow-y-auto">
              {categoryIcons.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCategoryDetails({
                    ...categoryDetails,
                    icon: name
                  })}
                  className={`p-3 flex items-center justify-center rounded border transition hover:bg-gray-100 ${
                    categoryDetails.icon === name
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
              disabled={createCategoryMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCategoryMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createCategoryMutation.isPending
                ? "Creating..."
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
