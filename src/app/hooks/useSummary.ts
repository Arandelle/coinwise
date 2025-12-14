import { useQuery } from "@tanstack/react-query";
import { Summary, SummaryResponse } from "../types/Summary";
import { getGuestTransactions } from "./useTransactions";
import { useUser } from "./useUser";

// For logged-in users
export function useSummary(filters?: Summary) {
  return useQuery({
    queryKey: ["summary", filters],
    queryFn: async () => {
      // Build query params
      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`/api/summary?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Error fetching summary");
      }

      const data: SummaryResponse = await response.json();
      return data;
    },
    staleTime: 0
  });
}

// For guest users
export function useGuestSummary(filters?: Summary) {
  return useQuery({
    queryKey: ["guest_summary", filters],
    queryFn: async () => {
      const transactions = getGuestTransactions();

      let filteredTransactions = transactions;

      // Default to daily mode (today) if no filters provided
      const defaultFilters = { mode: "monthly", ...filters };
      const { mode, month, year, date_from, date_to } = defaultFilters;
      const now = new Date();

      let startDate: Date | null = null;
      let endDate: Date | null = null;

      if (mode === "daily") {
        // Today only
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(startDate);

        endDate.setDate(endDate.getDate() + 1);
      } else if (mode === "weekly") {
        // Current week (mon - sun)
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startDate = new Date(now);
        startDate.setDate(now.getDate() + diffToMonday);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
      } else if (mode === "monthly") {
        // Specific month or current month
        const targetYear = year ?? now.getFullYear();
        const targetMonth = month ?? now.getMonth() + 1;

        startDate = new Date(targetYear, targetMonth - 1, 1);
        endDate = new Date(targetYear, targetMonth, 1);
      } else if (mode === "yearly") {
        const targetYear = year ?? now.getFullYear();
        startDate = new Date(targetYear, 0, 1);
        endDate = new Date(targetYear + 1, 0, 1);
      } else if (mode === "custom") {
        if (date_from) {
          startDate = new Date(date_from);
          startDate.setHours(0, 0, 0, 0);
        }
        if (date_to) {
          endDate = new Date(date_to);
          endDate.setHours(23, 59, 59, 999);
        }
      }

      // mode === "all" - no filtering

      // Filter transactions by date range
      if (startDate || endDate) {
        filteredTransactions = transactions.filter((tx) => {
          if (!tx.date) return false;
          const txDate = new Date(tx.date);

          // Check if date is valid
          if (isNaN(txDate.getTime())) return false;

          if (startDate && txDate < startDate) return false;
          if (endDate && txDate >= endDate) return false;

          return true;
        });
      }

      // Calculate summary
      let total_income = 0;
      let total_expense = 0;
      let expense_count = 0;
      let income_count = 0;

      filteredTransactions.forEach((tx) => {
        if (tx.type === "income") {
          total_income += tx.amount;
          income_count++;
        } else if (tx.type === "expense") {
          total_expense += tx.amount;
          expense_count++;
        }
      });

      const cash_flow = total_income - total_expense;

      let date_rangee = {
        from: startDate ?? null,
        to: endDate ?? null,
      };

      if (mode !== "all") {
        if (filteredTransactions.length > 0) {
          const validDates = filteredTransactions
            .map((t) => (t.date ? new Date(t.date).getTime() : null))
            .filter((time): time is number => time !== null && !isNaN(time));

          if (validDates.length > 0) {
            const minDate = new Date(Math.min(...validDates));
            const maxDate = new Date(Math.max(...validDates));

            date_rangee = {
              from: minDate,
              to: maxDate,
            };
          }
        }
      }

      const response : SummaryResponse = {
        total_income,
        total_expense,
        cash_flow,
        income_count,
        expense_count,
        date_range : {
            from: date_rangee.from ? date_rangee.from.toISOString().split('T')[0] : "",
            to: date_rangee.to ? date_rangee.to.toISOString().split('T')[0] : "",
        },
      };

      return response;

    },
  });
}


// Unified summary hook
export function useTransactionSummary( guestMode?: boolean, filters?: Summary){
    const {data: user} = useUser(guestMode ? { guestMode: true} : undefined);
    const authQuery = useSummary(filters);
    const guestQuery = useGuestSummary(filters);

    if (!user){
        return guestQuery;
    } 

    return authQuery;
}