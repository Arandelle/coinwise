import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Transaction } from "@/app/types/Transaction";
import TransactionItem from "./TransactionsItem";

interface TransactionsSectionProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  transactions,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  const [activeTab, setActiveTab] = useState("all");

  const groupTransactionsByDate = () => {
    const grouped: Record<string, Transaction[]> = {};
    transactions.forEach((tx) => {
      const dateKey = new Date(tx.date as Date).toLocaleDateString("en-US", {
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

  const calculateBalance = (transaction: Transaction) => {
    // Find all transactions up to and including this transaction's date
    const totalSpent = transactions
      .filter(
        (tx) => new Date(tx.date as Date) <= new Date(transaction.date as Date)
      )
      .reduce((total, tx) => {
        if (tx.type === "expense") {
          return total - Math.abs(tx.amount);
        } else {
          return total + Math.abs(tx.amount);
        }
      }, 0);

    return 25000 - totalSpent;
  };

  const groupedTransactions = groupTransactionsByDate();

  return (
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
            onClick={onAddClick}
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
            Object.entries(groupedTransactions).map(([date, txs], idx) => {
              const dailyTotal = txs.reduce((total, tx) => {
                if (tx.type === "expense"){
                  return total - Math.abs(tx.amount);
                } else{
                  return total + Math.abs(tx.amount);
                }
              }, 0);

              return (
                  <section key={idx} className="space-y-2">
                <div className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600 font-medium">{date}</p>
                  <p className={`${dailyTotal > 0 ? "text-emerald-600" : "text-rose-600"} text-xs font-semibold`}>
                    ₱ {dailyTotal.toLocaleString()}
                  </p>
                </div>

                {txs.map((transaction, tidx) => {
                  return (
                    <TransactionItem
                      key={tidx}
                      transaction={transaction}
                      balance={calculateBalance(transaction)}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  );
                })}
              </section>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsSection;
