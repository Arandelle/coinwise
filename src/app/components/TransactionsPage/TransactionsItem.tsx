import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Transaction, iconMap } from "./types";

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
  const Icon = iconMap[transaction.icon];

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg transition-all group">
      <div className={`p-2.5 ${transaction.color} rounded-full`}>
        <Icon size={18} className="text-white" />
      </div>

      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex flex-col">
          <p className="font-medium text-sm text-gray-900">
            {transaction.name}
          </p>
          <p className="text-xs text-gray-500">{transaction.category}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <p className="text-sm text-rose-500 font-semibold">
              ₱{transaction.amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              Balance: ₱{balance.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(transaction)}
              className="p-1.5 hover:bg-teal-100 rounded-lg transition-colors"
            >
              <Edit2 size={14} className="text-teal-600" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
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