"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calculator, Minus, Plus, SaveIcon, X } from "lucide-react";
import { Transaction } from "@/app/types/Transaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalculatorModal from "./Calculator";
import CategoryModal from "./CategoryModal";
import LoadingCoin from "../Loading";
import { getLucideIcon } from "../ReusableComponent/Lucidecon";
import { useUpsertTransaction } from "@/app/hooks/useTransactions";

interface TransactionModalProps {
  transactions: Transaction[];
  editingTransaction: Transaction | null;
  onClose: () => void;
  onSubmit: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transactions,
  editingTransaction,
  onClose,
  onSubmit,
}) => {
  const upsertMutation = useUpsertTransaction();
  const [showCalculator, sestShowCalculator] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState<Transaction>({
    name: "",
    category_id: "",
    amount: 0,
    type: "expense",
    date: new Date(),

    category_details: {
      name: "Others",
      icon: "",
      type: "expense",
      group_name: "Others",
    },
  });

  const isExpenses = formData.type === "expense";

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        name: editingTransaction.name,
        category_id: editingTransaction.category_id,
        amount: Math.abs(editingTransaction.amount),
        type: editingTransaction.type,
        date: editingTransaction.date,
        category_details: {
          name: editingTransaction.category_details?.name || "",
          icon: editingTransaction.category_details?.icon || "",
          type: editingTransaction.category_details?.type || "expense",
          group_name: editingTransaction.category_details?.group_name || "",
        },
      });
    }
  }, [editingTransaction]);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.category_id || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Prepare transaction data
      const transactionData: Transaction = {
        ...formData,
        ...(editingTransaction?._id && {_id: editingTransaction._id}),
        amount: formData.type === 'expense' 
          ? -Math.abs(formData.amount || 0) 
          : Math.abs(formData.amount || 0),
      } as Transaction;

      // Submit using unified mutation
      await upsertMutation.mutateAsync({
        transaction: transactionData,
        isEditing: !!editingTransaction,
      });

      // Success handling
      const message = editingTransaction 
        ? "Transaction updated successfully!" 
        : "Transaction added successfully!";
      
      alert(message);

      // Reset form
      setFormData({
        name: "",
        category_id: "",
        amount: 0,
        type: "expense",
        date: null,
      });

      // Callbacks
      onSubmit();
      onClose();

    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("Error saving transaction. Please try again.");
    }
  };

  const handleTransType = (type: string) => {
    setFormData({
      ...formData,
      type: type,
    });
  };

  // GEt unique transaction name with their most recent data
  const getTransactionTemplates = useMemo(() => {
    const template = new Map<string, Transaction>();

    // sort by the date
    const sortedTransactions = [...transactions].sort(
      (a, b) =>
        new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
    );

    // store the most recent transaction for each unique name
    sortedTransactions.forEach((tx) => {
      const name = tx.name.trim();

      if (name && !template.has(name.toLowerCase())) {
        template.set(name.toLowerCase(), tx);
      }
    });

    return template;
  }, [transactions]);

  const allSuggestions = useMemo(() => {
    const suggestions: Array<{
      name: string;
      data: Partial<Transaction>;
    }> = [];

    getTransactionTemplates.forEach((tx) => {
      suggestions.push({
        name: tx.name || "",
        data: {
          name: tx.name,
          category_id: tx.category_id,
          amount: tx.amount,
          category_details: {
            icon: tx.category_details?.icon || "",
            group_name: tx.category_details?.group_name || "",
            name: tx.category_details?.name || "",
            type: tx.category_details?.type || "",
          },
          note: tx.note,
          type: tx.type,
        },
      });
    });

    return suggestions;
  }, [getTransactionTemplates]);

  const filteredSuggestions = useMemo(() => {
    if (!formData.name || formData.name.trim().length === 0) {
      // show recent transactions names when input is empty
      return allSuggestions.slice(0, 6);
    }

    const query = formData.name.toLowerCase().trim();

    return allSuggestions
      .filter((suggestion) => suggestion.name.toLowerCase().includes(query))
      .slice(0, 6);
  }, [formData.name, allSuggestions]);

  const handleSuggestClick = (suggestion: (typeof allSuggestions)[0]) => {
    setFormData({
      ...formData,
      ...suggestion.data,
    });

    setShowSuggestions(false);
  };

  const Icon = getLucideIcon(formData.category_details?.icon);

  if (upsertMutation.isPending) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-mono font-light">
        <div className="bg-white p-4 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto rounded-lg">
          <LoadingCoin />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 font-mono font-light">
        <div className="bg-white p-4 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto rounded-lg">
          <h3 className="text-center text-sm text-gray-900 font-medium">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </h3>

          <button
            onClick={onClose}
            className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={15} />
          </button>

          <form onSubmit={handleSubmit} className="space-y-4 my-4 mx-2">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Transaction Name"
                value={formData?.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full text-xl py-2 outline-0 text-slate-800 font-medium"
                required
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 m-auto mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-slate-700 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">
                            {suggestion.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                            {suggestion.data.amount && (
                              <>
                                <span>•</span>
                                <span>
                                  ₱
                                  {Math.abs(
                                    suggestion.data.amount
                                  ).toLocaleString()}
                                </span>
                              </>
                            )}
                            <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded">
                              Recent
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <DatePicker
                selected={formData?.date}
                onChange={(date) => setFormData({ ...formData, date: date })}
                dateFormat="d MMMM yyyy"
                className="text-slate-500 text-sm outline-0 cursor-pointer "
                placeholderText="Select date"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₱)
              </label>
              <div className="flex flex-row items-center gap-2">
                <div className="relative w-full">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData?.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 pr-10 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-0"
                    required
                  />
                  <button
                    onClick={() => sestShowCalculator(true)}
                    type="button"
                    title="Open Calculator"
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 hover:bg-gray-200 rounded text-teal-600 transition-colors"
                  >
                    <Calculator size={18} />
                  </button>
                </div>
                <button
                  type="button"
                  className={`rounded-full ${
                    isExpenses
                      ? "bg-rose-500 hover:bg-rose-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }  text-white p-1 transition-colors flex-shrink-0`}
                  title="Transaction Type Icon"
                >
                  {isExpenses ? <Minus size={20} /> : <Plus size={20} />}
                </button>
              </div>
            </div>
          {/*** Category */}
            <div
              onClick={() => setShowCategory(true)}
              className="flex flex-row items-center gap-4 cursor-pointer w-full"
            >
              <div
                className={`p-2 rounded-full text-white ${
                  formData.category_details?.type === "expense"
                    ? "bg-rose-500"
                    : "bg-emerald-500"
                }`}
              >
                <Icon size={18} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm">
                  {formData.category_details?.group_name}
                </p>
                <p className="font-medium">{formData.category_details?.name}</p>
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes
                <span className="text-gray-400 text-xs font-normal">
                  (Optional)
                </span>
              </label>
              <textarea
                placeholder="Add a note about this transaction..."
                value={formData.note}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    note: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-0 resize-none text-sm"
                rows={3}
              />
            </div>

            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md gap-2 p-1">
              <button
                type="button"
                onClick={() => handleTransType("income")}
                className={`${
                  formData.type === "income"
                    ? "text-white bg-emerald-600"
                    : "text-emerald-600 bg-tranparent"
                } text-xs md:text-sm font-light rounded-xl py-2 px-8 uppercase cursor-pointer w-full transition-all`}
              >
                Income
              </button>

              <button
                type="button"
                onClick={() => handleTransType("expense")}
                className={`${
                  isExpenses
                    ? "text-white bg-rose-600"
                    : "text-rose-600 bg-tranparent"
                } text-xs md:text-sm font-light rounded-xl py-2 px-8 uppercase cursor-pointer w-full transition-all`}
              >
                Expense
              </button>

              <button
                type="submit"
                disabled={upsertMutation.isPending}
                className="bg-emerald-600 text-white p-4 rounded-md font-bold cursor-pointer hover:shadow-lg transition-all"
              >
                <SaveIcon size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCalculator && (
        <CalculatorModal
          onClose={() => sestShowCalculator(false)}
          onSelect={(value) =>
            setFormData({
              ...formData,
              amount: value,
            })
          }
          initialValue={formData?.amount || 0}
        />
      )}

      {showCategory && (
        <CategoryModal
          onSelect={(category) => {
            setFormData({
              ...formData,
              category_id: category._id,
              category_details: {
                name: category.category_name,
                icon: category.icon,
                type: category.type,
                group_name: category.category_group || "",
              },
            });
            setShowCategory(false);
          }}
          onCancel={() => setShowCategory(false)}
          categoryType={formData.type}
        />
      )}
    </>
  );
};

export default TransactionModal;
