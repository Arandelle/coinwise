import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Transaction } from "@/app/types/Transaction";
import { getLucideIcon } from "./InsightsSidebar";

interface TransactionItemProps {
  transaction: Transaction;
  balance: number;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  balance,
  onEdit,
  onDelete,
}) => {
  // const Icon = iconMap[transaction.icon];

  const handleClick = () => {
    if (window.innerWidth < 768) {
      onEdit(transaction);
    }
  };

  const Icon = getLucideIcon(transaction.category_details?.icon);

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg transition-all group"
    >
      <div
        className={`p-1 ${
          transaction.type === "expense" ? "bg-rose-500" : "bg-emerald-500"
        } rounded-full shadow-xl`}
      >
        <Icon size={18} className="text-white" />
      </div>

      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex-1">
          <p className="font-medium">{transaction.name}</p>
          <p className="text-sm text-gray-500">
            {transaction.category_details?.group_name} •{" "}
            {transaction.category_details?.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <p
              className={`font-semibold ${
                transaction.type === "expense"
                  ? "text-rose-500"
                  : "text-green-600"
              }`}
            >
              {transaction.type === "expense" ? "-" : "+"}${transaction.amount}
            </p>
            <p className="text-xs text-gray-500">
              Balance: ₱{balance.toLocaleString()}
            </p>
          </div>
          <div className="hidden md:flex gap-1 transition-opacity">
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <Edit2 size={14} className="text-teal-600" />
            </button>
            <button
              onClick={() => onDelete(transaction._id!)}
              className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <Trash2 size={14} className="text-rose-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
