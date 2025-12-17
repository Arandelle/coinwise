// components/AIInsightsSimple.tsx
'use client';

import { useState } from 'react';

import { 
  AlertCircle, 
  Sparkles,
  ChevronRight,
  Loader2,
  Clock,
  Database
} from 'lucide-react';
import { useGenerateInsights } from '@/app/hooks/useAiInsights';
import { useRouter } from 'next/navigation';

interface AIInsightsSimpleProps {
  // All props are optional - component will use current month if not provided
  start_date?: string;
  end_date?: string;
  category?: string;
}

export default function GenerateInsightButton({ 
  start_date, 
  end_date, 
  category 
}: AIInsightsSimpleProps = {}) {
  const router = useRouter();

  const { mutate: generateInsights, data: responseData, isPending, error } = useGenerateInsights();

  const handleGenerate = () => {
    // Call with optional params (undefined values will use backend defaults - current month)
    generateInsights({
      start_date,
      end_date,
      category,
    });
  };

  // Extract insights and check data type
  const insights = responseData?.insights && 'financial_health_score' in responseData.insights 
    ? responseData.insights 
    : null;
  const isCached = responseData?.cached || false;
  const cacheAge = responseData?.cache_age_minutes;
  const dataSummary = responseData?.data_summary;
  
  // Check if insufficient data
  const isInsufficientData = responseData?.insights && 'type' in responseData.insights 
    && responseData.insights.type === 'insufficient_data';

  // Error state
  if (error) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-red-50 border border-red-200 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-red-900 mb-1">Error Generating Insights</h3>
            <p className="text-sm text-red-700 mb-3">
              {error instanceof Error ? error.message : 'Failed to generate insights'}
            </p>
            <button
              onClick={handleGenerate}
              className="text-sm text-red-600 hover:text-red-700 underline font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Insufficient data state
  if (isInsufficientData && 'message' in responseData.insights) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-amber-50 border border-amber-200 p-6">
        <div className="flex items-start gap-4">
          <Database className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-amber-900 mb-1">Need More Data</h3>
            <p className="text-sm text-amber-700 mb-2">
              {responseData.insights.message}
            </p>
            <p className="text-sm text-amber-600">
              💡 {responseData.insights.suggestion}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isPending) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border border-purple-100 shadow-sm">
        <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
          <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
          <p className="mt-4 text-gray-700 font-medium">Analyzing your finances...</p>
          <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Summary state
  if (insights) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border border-purple-100 shadow-sm">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-200 rounded-full mix-blend-multiply filter blur-2xl" />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
                <div className="px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-purple-200">
                  <span className="text-sm font-semibold text-violet-700">
                    {insights.financial_health_score}/10
                  </span>
                </div>
                {isCached && cacheAge !== undefined && (
                  <div className="px-2 py-1 rounded-full bg-blue-50 border border-blue-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">
                      {cacheAge}m ago
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 leading-relaxed text-sm">
                {insights.insights_summary}
              </p>
              
              {dataSummary && (
                <p className="text-xs text-gray-500 mt-2">
                  {dataSummary.period} • {dataSummary.total_transactions} transactions
                </p>
              )}
            </div>
          </div>

          {insights.priority_alert && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 font-medium">
                {insights.priority_alert}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-purple-100">
              <div className="text-xs text-gray-600 mb-1">Money Leaks</div>
              <div className="text-xl font-bold text-red-600">
                {insights.money_leaks.length}
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-purple-100">
              <div className="text-xs text-gray-600 mb-1">Actions</div>
              <div className="text-xl font-bold text-violet-600">
                {insights.action_plan.length}
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-purple-100">
              <div className="text-xs text-gray-600 mb-1">Good</div>
              <div className="text-xl font-bold text-emerald-600">
                {insights.doing_well.length}
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/ai-insight")}
            className="w-full group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
          >
            View Detailed Analysis
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Detailed view
  return (
   <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 border border-purple-100 shadow-sm transition-all hover:shadow-md">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI Financial Insights
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Get personalized recommendations to optimize your spending and boost your savings.
              </p>
              
              <button
                onClick={handleGenerate}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                Generate Insights
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}