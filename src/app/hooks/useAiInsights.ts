// hooks/useAIInsights.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface MoneyLeak {
  category: string;
  current_spending: number;
  potential_savings: number;
  annual_impact: number;
  action: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ActionItem {
  title: string;
  description: string;
  savings: number;
  timeframe: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MonthlyGoal {
  target_savings: number;
  current_savings: number;
  percentage: number;
}

export interface AIInsights {
  financial_health_score: number;
  score_explanation: string;
  money_leaks: MoneyLeak[];
  doing_well: string[];
  action_plan: ActionItem[];
  priority_alert: string | null;
  monthly_goal: MonthlyGoal;
  insights_summary: string;
}

export interface DataSummary {
  period: string;
  date_range: {
    start: string;
    end: string;
  };
  total_income: number;
  total_expense: number;
  net_cash_flow: number;
  savings_rate: number;
  total_transactions: number;
}

export interface AIInsightsResponse {
  insights: AIInsights | {
    type: 'insufficient_data';
    message: string;
    suggestion: string;
  };
  cached: boolean;
  cache_age_minutes?: number;
  generated_at: string;
  data_summary?: DataSummary;
}

interface GenerateInsightsParams {
  start_date?: string;  // ISO string, optional
  end_date?: string;    // ISO string, optional
  category?: string;    // Category ID, optional
}


// Generate new AI insights
export function useGenerateInsights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params?: GenerateInsightsParams) => {

      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send params or empty object (backend handles both)
        body: JSON.stringify(params || {}),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle rate limiting
        if (response.status === 429) {
          throw new Error(errorData.error || 'Rate limit exceeded. Please try again later.');
        }
        
        throw new Error(errorData.error || 'Failed to generate insights');
      }

      return response.json() as Promise<AIInsightsResponse>;
    },
    onSuccess: (data) => {
      // Cache the insights
      queryClient.setQueryData(['ai-insights'], data);
    },
  });
}

// Fetch cached insights (current month by default)
export function useAIInsights(enabled = false) {
  return useQuery<AIInsightsResponse>({
    queryKey: ['ai-insights'],
    queryFn: async () => {

      const response = await fetch('/api/ai-insights', {
        method: 'GET',
        headers: {"Content-Type" : "application/json" }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }
      
      return response.json();
    },
    staleTime: 1000 * 60 * 60 * 4, // 4 hours (matches backend cache)
    enabled, // Only fetch when explicitly enabled
  });
}

// Helper hook for generating insights for current month (no params)
export function useGenerateCurrentMonthInsights() {
  const mutation = useGenerateInsights();
  
  const generateCurrentMonth = () => {
    // Call without any params - backend will use current month
    return mutation.mutate
  };
  
  return {
    ...mutation,
    generateCurrentMonth,
  };
}

// Helper hook for generating insights with date range
export function useGenerateInsightsWithDateRange() {
  const mutation = useGenerateInsights();
  
  const generateWithDateRange = (startDate: Date, endDate: Date, category?: string) => {
    return mutation.mutate({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      category,
    });
  };
  
  return {
    ...mutation,
    generateWithDateRange,
  };
}