import React, { useState } from "react";
import {
  useDeleteTransaction,
  useTransactions,
} from "../hooks/useTransactions";
import { Transaction } from "../types/Transaction";
import BackgroundLayout from "./ReusableComponent/BackgroundLayout";
import { TransactionsSection } from "./TransactionsPage/Transaction";
import { toast } from "sonner";
import TransactionModal from "./TransactionsPage/TransactionModals/TransactionModal";
import { useUser } from "../hooks/useUser";

// 🧩 Each event (e.g., transaction)
export type CalendarEvent = {
  id: string | number;
  date: string; // e.g. "2025-11-10" (ISO date format recommended)
  color?: string; // optional dot color
  name?: string;
};

// 🧩 Component props
export type MiniCalendarProps = {
  value?: Date; // currently selected date
  onChange?: (date: Date) => void; // callback when a date is clicked
  events?: CalendarEvent[]; // list of events/transactions
};

// Simple date utilities
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();
const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
// const parseDate = (str: string) => {
//   const [y, m, d] = str.split("-").map(Number);
//   return new Date(y, m - 1, d);
// };

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  value,
  onChange,
  events = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const selectedDate = value;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrev = () => setCurrentMonth(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    onChange?.(clickedDate);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    return events.filter((e) => e.date === dateStr);
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-10" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const selected = isSelected(day);

    calendarDays.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`relative h-10 flex items-center justify-center rounded-md
          ${
            selected
              ? "bg-amber-500 text-white font-semibold"
              : "hover:bg-gray-100 text-gray-800"
          }
          focus:outline-none focus:ring-2 focus:ring-amber-400`}
      >
        <span>{day}</span>

        {/** Shows the dot indicator */}
        {(() => {
          // Separate income and expense events
          const incomes = dayEvents.filter((ev) => ev.color === "#10b981");
          const expenses = dayEvents.filter((ev) => ev.color === "#ef4444");

          const displayEvents = (() => {
            if (incomes.length > 0 && expenses.length > 0) {
              // Determin which group is larger
              const incomeCount = incomes.length;
              const expenseCount = expenses.length;

              if (incomeCount >= expenseCount) {
                return [...incomes.slice(0, 2), ...expenses.slice(0, 1)];
              } else {
                return [...incomes.slice(0, 1), ...expenses.slice(0, 2)];
              }
            }

            // Only one type of event -> max 3 dots
            return dayEvents.slice(0, 3);
          })();

          return (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
              {displayEvents.map((ev, idx) => (
                <span
                  key={idx}
                  style={{ backgroundColor: ev.color }}
                  className="inline-block h-1.5 w-1.5 rounded-full"
                />
              ))}
            </div>
          );
        })()}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-base font-semibold text-gray-800">
          {monthNames[month]} {year}
        </div>
        <div className="flex gap-1">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 text-lg"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 text-lg"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2 text-center">
        {dayNames.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
    </div>
  );
};

export default function CoinWiseCalendar() {
  const { data: transactionsData } = useTransactions();
  const { data: user, refetch } = useUser();
  const deleteMutation = useDeleteTransaction();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const transactions = transactionsData?.transactions ?? [];
  // Convert transactions to calendar events
  const calendarEvents: CalendarEvent[] | undefined = transactions?.map(
    (t) => ({
      id: t._id ?? "",
      date: t.date ? new Date(t.date).toISOString().split("T")[0] : "", // normalize to yyyy-mm-dd
      color: t.type === "income" ? "#10b981" : "#ef4444",
      title: t.category_details?.name ?? "",
    })
  );

  // Get transactions for selected date
  const selectedDateStr = formatDate(selectedDate);
  const selectedTransactions: Transaction[] | undefined = transactions?.filter(
    (t) => {
      if (!t.date) return false;
      const txDate = new Date(t.date).toISOString().split("T")[0];
      return txDate === selectedDateStr;
    }
  );

  // Calculate totals for selected date
  const dayIncome =
    selectedTransactions
      ?.filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0) ?? 0;

  const dayExpense =
    selectedTransactions
      ?.filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0) ?? 0;

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this transaction?`)) {
      return;
    }

    // Guest user - delete from localStorage
    if (!user) {
      localStorage.removeItem(id);
      toast.info("Transaction deleted (local storage)");
      refetch();
      return;
    }

    // Logged-in user - use mutation
    try {
      await deleteMutation.mutateAsync(id);
      toast.info("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction", error);
      toast.info("Error deleting transaction");
    }
  };

  return (
    <BackgroundLayout>
      <div className="grid md:grid-cols-2 gap-6 mx-auto max-w-4xl">
        {/* Calendar */}
        <div>
          <MiniCalendar
            value={selectedDate}
            onChange={setSelectedDate}
            events={calendarEvents}
          />

          {/* Legend */}
          <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Legend</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-gray-600">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-rose-500"></span>
                <span className="text-gray-600">Expense</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>

            {selectedTransactions && selectedTransactions.length > 0 && (
              <div className="flex gap-4 mt-2 text-sm">
                {dayIncome > 0 && (
                  <div className="text-emerald-600 font-medium">
                    Income: ₱{dayIncome.toLocaleString()}
                  </div>
                )}
                {dayExpense > 0 && (
                  <div className="text-rose-600 font-medium">
                    Expense: ₱{dayExpense.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedTransactions && selectedTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-sm">No transactions on this date</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <TransactionsSection
                transactions={selectedTransactions ?? []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddClick={() => setShowModal(true)}
              />
              {showModal && (
                <TransactionModal
                  transactions={transactions ?? []}
                  editingTransaction={editingTransaction}
                  onClose={() => setShowModal(false)}
                  onSubmit={() => refetch()}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </BackgroundLayout>
  );
}
