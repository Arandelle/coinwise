import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  Transaction,
  TransactionFilters,
  TransactionsResponse,
} from "@/app/types/Transaction";
import TransactionItem from "./TransactionsItem";
import { useWallet } from "@/app/hooks/useAccount";

interface TransactionsSectionProps {
  transactions: Transaction[];
  pagination?: TransactionsResponse["pagination"];
  filters?: TransactionFilters; // Make optional
  onFilterChange?: (filters: TransactionFilters) => void; // Make optional
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  transactions,
  pagination,
  filters: externalFilters,
  onFilterChange: externalOnFilterChange,
  onEdit,
  onDelete,
  onAddClick,
}) => {
  const { data: account } = useWallet();

  // Internal filter state (only used when external filters are not provided)
  const [internalFilters, setInternalFilters] = useState<TransactionFilters>({
    page: 1,
    type: undefined,
    limit: 20, // Default items per page
  });

  // Use external filters if provided, otherwise use internal
  const filters = externalFilters || internalFilters;
  const setFilters = externalOnFilterChange || setInternalFilters;

  const handleFilterChange = (newFilters: Partial<TransactionFilters>) => {
    setFilters({
      ...filters,
      ...newFilters,
    });
  };

  // Filter transactions based on type (for calendar view without API filtering)
  const filteredTransactions = filters.type
    ? transactions.filter((tx) => tx.type === filters.type)
    : transactions;

  // Client-side pagination when no external pagination is provided
  const clientPagination = !pagination
    ? (() => {
        const limit = filters.limit || 10;
        const page = filters.page || 1;
        const total = filteredTransactions.length;
        const total_pages = Math.ceil(total / limit);

        return {
          page,
          limit,
          total,
          total_pages,
          has_next: page < total_pages,
          has_prev: page > 1,
        };
      })()
    : null;

  // Paginate filtered transactions for client-side pagination
  const paginatedTransactions =
    !pagination && clientPagination
      ? (() => {
          const startIndex = (clientPagination.page - 1) * clientPagination.limit;
          const endIndex = startIndex + clientPagination.limit;
          return filteredTransactions.slice(startIndex, endIndex);
        })()
      : filteredTransactions;

  // Use either server-side or client-side pagination
  const activePagination = pagination || clientPagination;

  const groupTransactionsByDate = () => {
    const grouped: Record<string, Transaction[]> = {};
    paginatedTransactions.forEach((tx) => {
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

    return (account?.[0]?.balance ?? 0) + totalSpent;
  };

  const groupedTransactions = groupTransactionsByDate();

  const tabButtons = [
    { label: "All Transactions", data: { type: undefined, page: 1 } },
    { label: "Expenses", data: { type: "expense", page: 1 } },
    { label: "Income", data: { type: "income", page: 1 } },
  ] as const;

  const {
    has_next = false,
    has_prev = false,
    page = 1,
    limit = 1,
    total_pages = 1,
    total = 0,
  } = activePagination || {};

  return (
    <div className="lg:col-span-6 order-1 md:order-2">
      <div className="bg-white rounded-xl shadow-md">
        {/* Tabs and Add Button */}
        <div className="border-b px-4 flex items-center justify-between">
          <div className="flex gap-6">
            {tabButtons.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterChange({ ...tab.data })}
                className={`py-4 px-2 font-medium text-sm border-b-2 cursor-pointer ${
                  filters.type === tab.data.type
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={onAddClick}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-2 rounded-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <Plus size={16} />
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
                if (tx.type === "expense") {
                  return total - Math.abs(tx.amount);
                } else {
                  return total + Math.abs(tx.amount);
                }
              }, 0);

              return (
                <section key={idx} className="space-y-2">
                  <div className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-600 font-medium">{date}</p>
                    <p
                      className={`${
                        dailyTotal > 0 ? "text-emerald-600" : "text-rose-600"
                      } text-xs font-semibold`}
                    >
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
              );
            })
          )}
        </div>
        {activePagination && (
          <div className="border-t px-4 py-3 bg-white pagination-container">
            <div className="pagination-wrapper">
              {/** Left page info */}
              <div className="text-sm text-gray-600 page-info">
                {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of{" "}
                {total} transactions
              </div>
              {/** Pagination buttons */}
              <div className="flex items-center gap-2 pagination-buttons">
                <button
                  className="cursor-pointer px-3 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  onClick={() =>
                    handleFilterChange({ ...filters, page: page - 1 })
                  }
                  disabled={!has_prev}
                >
                  Prev
                </button>

                {Array.from({ length: Math.min(5, total_pages) }).map((_, i) => {
                  // Calculate the first page to show
                  let start = page - 2;
                  if (start < 1) start = 1;
                  if (start > total_pages - 4)
                    start = Math.max(1, total_pages - 4);

                  const pageNum = start + i;
                  if (pageNum > total_pages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleFilterChange({ page: pageNum })}
                      className={`mx-1 px-3 py-1 rounded-md text-sm ${
                        filters.page === pageNum
                          ? "bg-teal-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  className="cursor-pointer px-3 py-1 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  onClick={() =>
                    handleFilterChange({ ...filters, page: page + 1 })
                  }
                  disabled={!has_next}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsSection;