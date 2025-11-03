"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Fuel, Minus, Plus, SaveIcon, X } from "lucide-react";
import { Transaction } from "@/app/types/Transaction";
import { categories } from "./constants";
import { User } from "@/app/types/Users";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalculatorModal from "./Calculator";
import CategoryModal from "./CategoryModal";

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
  const [showCalculator, sestShowCalculator] = useState(false)
  const [loading, setLoading] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [formData, setFormData] = useState<Transaction>({
    name: "",
    category: "",
    amount: 0,
    type: "expense",
    date: new Date(),
  });

  const isExpenses = formData.type === "expense"

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        name: editingTransaction.name,
        category: editingTransaction.category,
        amount: Math.abs(editingTransaction.amount),
        type: editingTransaction.type,
        date: editingTransaction.date,
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
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
      setLoading(false)
      return;
    }
    if (!editingTransaction && user) {
      try {
        const payload = {
          ...formData,
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
            date: null,
          });
          alert(`Successfully added new item`);
          onSubmit();
          onClose();
          return;
        }
      } catch (error) {
        console.error("Error adding new item", error);
      } finally{
        setLoading(false)
      }
    } else {
      try {
        const payload = {
          ...formData,
          category_id: "category1010",
        };

        const res = await fetch(
          `/api/transactions/${editingTransaction!._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (res.ok) {
          setFormData({
            name: "",
            category: "",
            amount: 0,
            type: "expense",
            date: null,
          });
          alert(`Successfully edited item`);
          onSubmit();
          onClose();
          return;
        }
      } catch (error) {
        console.error("Error adding new item", error);
      } finally{
        setLoading(false)
      }
    }
  };

  // const handleCategoryChange = (categoryName: string) => {
  //   const cat = categories.find((c) => c.name === categoryName);
  //   if (cat && formData) {
  //     setFormData({
  //       ...formData,
  //       category: categoryName,
  //     });
  //   }
  // };

  const handleTransType = (type: string) => {
    setFormData({
      ...formData,
      type: type,
    });
  };

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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full text-xl py-2 outline-0 text-slate-800 font-medium"
                required
              />
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
                  className={`rounded-full ${isExpenses ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"}  text-white p-1 transition-colors flex-shrink-0`}
                  title="Transaction Type Icon"
                >
                 { isExpenses ?
                    <Minus size={20} /> :  <Plus size={20}/>
                 } 
                </button>
              </div>
            </div>
  
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData?.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-0"
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div> */}

            <div 
            onClick={() => setShowCategory(true)}
            className="flex flex-row items-center gap-4 cursor-pointer w-full">
                <div className="text-slate-900">
                  <Fuel size={22}/>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm">Car</p>
                  <p className="font-medium">Fuel</p>
                </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes<span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </label>
              <textarea 
              placeholder="Add a note about this transaction..."
              value={formData.note}
              onChange={((e) => setFormData({
                ...formData,
                note: e.target.value
              }))}
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
                disabled={loading}
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
          onSelect={(value) => setFormData({
            ...formData,
            amount: value
          }) }
          initialValue={formData?.amount || 0}
        />
      )}

      {showCategory && (
        // <CategoryModal onChange={(value) => setFormData({
        //   ...formData,
        //   category: value
        // }) }/>
      <CategoryModal />
      )}
    </>
  );
};

export default TransactionModal;
