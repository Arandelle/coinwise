import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Transaction } from "./types";
import { categories } from "./constants";

interface TransactionModalProps {
  editingTransaction: Transaction | null;
  onClose: () => void;
  onSubmit: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  editingTransaction,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Dining out",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "Utensils",
    color: "bg-rose-500",
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        name: editingTransaction.name,
        category: editingTransaction.category,
        amount: Math.abs(editingTransaction.amount).toString(),
        date: editingTransaction.date,
        icon: editingTransaction.icon,
        color: editingTransaction.color,
      });
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id: string = editingTransaction?.id || `transaction_${Date.now()}`;
    const txData = {
      id,
      ...formData,
      amount: -Math.abs(parseFloat(formData.amount)),
    };

    localStorage.setItem(id, JSON.stringify(txData));
    onSubmit();
  };

  const handleCategoryChange = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    if (cat) {
      setFormData({
        ...formData,
        category: categoryName,
        icon: cat.icon,
        color: cat.color,
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
              value={formData.name}
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
              value={formData.category}
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
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
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
              value={formData.date}
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