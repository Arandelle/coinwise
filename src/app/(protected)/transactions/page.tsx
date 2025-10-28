"use client";

import React, { useState, useEffect } from "react";
import {
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Zap,
  TrendingUp,
  Target,
  Brain,
  User,
  Wallet,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";

const iconMap = {
  Utensils,
  ShoppingBag,
  Car,
  Home,
  Zap,
};
type IconKey = keyof typeof iconMap;

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: IconKey;
  color: string;
}

interface Category {
  name: string;
  icon: keyof typeof iconMap;
  color: string;
}

const TransactionList = () => {
  const {user, loading, refreshUser} = useAuth();

  useEffect(() => {
    refreshUser()
  }, []);

  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Dining out",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "Utensils",
    color: "bg-rose-500",
  });

  const categories: Category[] = [
    { name: "Dining out", icon: "Utensils", color: "bg-rose-500" },
    { name: "Shopping", icon: "ShoppingBag", color: "bg-purple-500" },
    { name: "Transportation", icon: "Car", color: "bg-yellow-500" },
    { name: "Utilities", icon: "Home", color: "bg-blue-500" },
    { name: "Entertainment", icon: "Zap", color: "bg-pink-500" },
  ];

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const stored: Record<string, Transaction> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("transaction_")) {
        try {
          stored[key] = JSON.parse(localStorage.getItem(key) || "");
        } catch (e) {
          console.error("Error loading transaction:", e);
        }
      }
    }

    const txList = Object.values(stored);
    txList.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(txList);
  };

  const groupTransactionsByDate = () => {
    const grouped: Record<string, Transaction[]> = {};
    transactions.forEach((tx) => {
      const dateKey = new Date(tx.date).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(tx);
    });
    return grouped;
  };

  const calculateBalance = (index: number) => {
    const totalSpent = transactions
      .slice(0, index + 1)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    return 25000 - totalSpent;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id: string = editingTransaction?.id || `transaction_${Date.now()}`;
    const txData = {
      id,
      ...formData,
      amount: -Math.abs(parseFloat(formData.amount)),
    };

    localStorage.setItem(id, JSON.stringify(txData));
    loadTransactions();
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      name: "",
      category: "Dining out",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      icon: "Utensils",
      color: "bg-rose-500",
    });
  };

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setFormData({
      name: tx.name,
      category: tx.category,
      amount: Math.abs(tx.amount).toString(),
      date: tx.date,
      icon: tx.icon,
      color: tx.color,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this transaction?")) {
      localStorage.removeItem(id);
      loadTransactions();
    }
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

  const groupedTransactions = groupTransactionsByDate();
  const totalSpent = transactions.reduce(
    (sum, tx) => sum + Math.abs(tx.amount),
    0
  );
  const remaining = 25000 - totalSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 text-8xl">📊</div>
       <div className="absolute top-32 right-14 text-6xl">💰</div>
       <div className="absolute bottom-44 right-20 text-7xl">✍</div>
       <div className="absolute bottom-32 left-12 text-5xl">✨</div>
       <Image 
       src={"/CoinwiseLogo_v7.png"}
       alt="coinwise_logo"
       width={300}
       height={300}
       className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
       />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <User className="text-white" size={32} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {user ? `Welcome ${user.username}` : "Guest mode"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Track your finances
                </p>

                <div className="w-full space-y-3 mt-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Monthly Budget
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ₱25,000
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-red-50 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Spent this month
                    </span>
                    <span className="text-sm font-semibold text-rose-500">
                      ₱{totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="text-sm font-semibold text-emerald-600">
                      ₱{remaining.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spending Forecast */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={24} className="text-teal-600" />
                <h3 className="font-semibold text-lg text-gray-900">
                  Forecast
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {`At your current rate, you'll spend:`}
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                ₱{Math.round(totalSpent * 1.5).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">by end of month</p>
            </div>
          </div>

          {/* Main Content - Transactions */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-md">
              {/* Tabs and Add Button */}
              <div className="border-b px-4 flex items-center justify-between">
                <div className="flex gap-6">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`py-4 border-b-2 transition-colors ${
                      activeTab === "all"
                        ? "border-teal-600 text-teal-600 font-semibold"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    All Transactions
                  </button>
                  <button
                    onClick={() => setActiveTab("expenses")}
                    className={`py-4 border-b-2 transition-colors ${
                      activeTab === "expenses"
                        ? "border-teal-600 text-teal-600 font-semibold"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Expenses
                  </button>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white p-2 rounded-full hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Transaction List */}
              <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {Object.keys(groupedTransactions).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No transactions yet. Click + to add one!
                  </p>
                ) : (
                  Object.entries(groupedTransactions).map(
                    ([date, txs], idx) => (
                      <section key={idx} className="space-y-2">
                        <div className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-600 font-medium">
                            {date}
                          </p>
                          <p className="text-xs text-rose-600 font-semibold">
                            ₱
                            {txs
                              .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
                              .toLocaleString()}
                          </p>
                        </div>

                        {txs.map((transaction, tidx) => {
                          const Icon = iconMap[transaction.icon];
                          const txIndex = transactions.findIndex(
                            (t) => t.id === transaction.id
                          );
                          return (
                            <div
                              key={tidx}
                              className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg transition-all group"
                            >
                              <div
                                className={`p-2.5 ${transaction.color} rounded-full`}
                              >
                                <Icon size={18} className="text-white" />
                              </div>

                              <div className="flex flex-row justify-between w-full items-center">
                                <div className="flex flex-col">
                                  <p className="font-medium text-sm text-gray-900">
                                    {transaction.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {transaction.category}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col items-end">
                                    <p className="text-sm text-rose-500 font-semibold">
                                      ₱{transaction.amount.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Balance: ₱
                                      {calculateBalance(
                                        txIndex
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleEdit(transaction)}
                                      className="p-1.5 hover:bg-teal-100 rounded-lg transition-colors"
                                    >
                                      <Edit2
                                        size={14}
                                        className="text-teal-600"
                                      />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDelete(transaction.id)
                                      }
                                      className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors"
                                    >
                                      <Trash2
                                        size={14}
                                        className="text-rose-600"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </section>
                    )
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - AI Insights & Challenges */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Insights */}
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-xl p-6 shadow-md text-white">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={24} />
                <h3 className="font-semibold text-lg">AI Insights</h3>
              </div>
              <p className="text-sm text-emerald-50 mb-4">
                Your spending pattern looks healthy! Keep tracking to maintain
                your budget goals.
              </p>
              <button className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View detailed analysis
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Weekly Challenges */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Target size={24} className="text-emerald-600" />
                <h3 className="font-semibold text-lg text-gray-900">
                  Weekly Challenges
                </h3>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-emerald-500 pl-4 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    No dining out for 3 days
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                        style={{ width: "66%" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">2/3</span>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    Save ₱500 this week
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">₱200/₱500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                Top Categories
              </h3>
              <div className="space-y-3">
                {categories.slice(0, 3).map((cat, idx) => {
                  const Icon = iconMap[cat.icon];
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`p-2 ${cat.color} rounded-lg`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {cat.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTransaction ? "Edit Transaction" : "Add Transaction"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingTransaction(null);
                }}
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
                  onClick={() => {
                    setShowModal(false);
                    setEditingTransaction(null);
                  }}
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
      )}
    </div>
  );
};

export default TransactionList;
