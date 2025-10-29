"use client"

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Transaction } from "./types";
import { categories } from "./constants";
import { User } from "@/app/types/Users";

interface TransactionModalProps {
  editingTransaction: Transaction | null;
  onClose: () => void;
  onSubmit: () => void;
  user: User | null;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  editingTransaction,
  onClose,
  onSubmit,
  user,
}) => {
  const [formData, setFormData] = useState<Transaction>({
    name: "",
    category: "",
    amount: 0,
    type: "expense",
    created_at: "2025-10-29T00:00:00",
    date: "",
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        name: editingTransaction.name,
        category: editingTransaction.category,
        amount: Math.abs(editingTransaction.amount),
        type: editingTransaction.type,
        created_at: editingTransaction.created_at,
        date: editingTransaction.date,
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      const id: string = editingTransaction?._id || `transaction_${Date.now()}`;
      const txData = {
        id,
        ...formData,
        amount: -Math.abs(formData?.amount ? formData.amount : 0),
      };

      localStorage.setItem(id, JSON.stringify(txData));
      onSubmit();
      alert("Success not authenticated");
      return;
    }
    if (!editingTransaction && user) {
      try {
        const payload = {
          ...formData,
          user_id: user._id,
          category_id: "category1010",
        };

        const res = await fetch("/api/transactions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setFormData({
            name: "",
            category: "",
            amount: 0,
            type: "expense",
            created_at: "2025-10-29T00:00:00",
            date: "",
          });
          alert(`Successfully added new item ${user._id}`);
          onSubmit();
          onClose();
          return;
        }
      } catch (error) {
        console.error("Error adding new item", error);
      }
    } else {
      try {
        const payload = {
          ...formData,
          user_id: user._id,
          category_id: "category1010",
        };

        const res = await fetch(`/api/transactions/${editingTransaction!._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setFormData({
            name: "",
            category: "",
            amount: 0,
            type: "expense",
            created_at: "2025-10-29T00:00:00",
            date: "",
          });
          alert(`Successfully edited item ${user._id}`);
          onSubmit();
          onClose();
          return;
        }
      } catch (error) {
        console.error("Error adding new item", error);
      }
    }
  };

  const handleCategoryChange = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    if (cat && formData) {
      setFormData({
        ...formData,
        category: categoryName,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData?.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData?.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₱)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData?.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData?.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              {editingTransaction ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
