import { Transaction } from "@/app/types/Transaction";
import React from "react";
import { Utensils } from "lucide-react";

interface Props {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: Props) => {
  if (transactions.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No transactions available
      </p>
    );
  }

  return (
    <div className="h-screen p-4 space-y-2">
      <section className="space-y-2">
        {/** Date and total spent */}
          <div className="flex flex-row items-center justify-between bg-gray-100 rounded-xl p-2">
            <p className="text-xs text-gray-500">Mon 20 October 2025</p>
            <p className="text-xs text-gray-500">-P1,512.00</p>
          </div>
        {/**List of transactions per day */}
          <div className="flex items-center gap-2 bg-white">
            <div className="p-2 bg-rose-500 rounded-full">
              <Utensils size={18} className="text-white" />
            </div>
    
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col">
                    <p className="font-medium text-sm">McDonald's</p>
                    <p className="text-xs text-gray-500">Dining out</p>
                </div>
    
                <div className="flex flex-col items-end">
                    <p className="text-sm text-rose-500 font-medium">-1,512</p>
                    <p className="text-xs text-gray-500">Balance: 600</p>
                </div>
            </div>
          </div>
      </section>
      
    </div>
  );
};

export default TransactionList;
