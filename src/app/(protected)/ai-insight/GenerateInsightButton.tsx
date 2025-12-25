// components/AIInsightsSimple.tsx
"use client";
import {
  AlertCircle,
  ChevronRight,
  Loader2,
  Clock,
  Database,
  Sparkle,
} from "lucide-react";
import { useAIInsights, useGenerateInsights } from "@/app/hooks/useAiInsights";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AIInsightsSimpleProps {
  // All props are optional - component will use current month if not provided
  start_date?: string;
  end_date?: string;
  category?: string;
}

export default function GenerateInsightButton({
  start_date,
  end_date,
  category,
}: AIInsightsSimpleProps = {}) {
  const router = useRouter();

  const {
    mutate: generateInsights,
    data: responseData,
    isPending,
    error,
  } = useGenerateInsights();

  // Fetch cached insights on mount
  const {
    data: cachedInsights,
    isLoading: isLoadingCache,
    error: cacheError,
  } = useAIInsights(false);

  const handleGenerate = () => {
    // Call with optional params (undefined values will use backend defaults - current month)
    generateInsights({
      start_date,
      end_date,
      category,
    });
  };

  // Prioritize fresh generated data over cached data
  const activeData = responseData || cachedInsights;

  // Extract insights and check data type
  const insights =
    activeData?.insights && "financial_health_score" in activeData.insights
      ? activeData.insights
      : null;
  const isCached = activeData?.cached || false;
  const cacheAge = activeData?.cache_age_minutes;
  const dataSummary = activeData?.data_summary;

  // Check if insufficient data
  const isInsufficientData =
    responseData?.insights &&
    "type" in responseData.insights &&
    responseData.insights.type === "insufficient_data";

  // Error state
  if (error || cacheError) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-red-50 border border-red-200 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-red-900 mb-1">
              Error Generating Insights
            </h3>
            <p className="text-sm text-red-700 mb-3">
              {error instanceof Error
                ? error.message
                : "Failed to generate insights"}
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
  if (isInsufficientData && "message" in responseData.insights) {
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
  if (isPending || isLoadingCache) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="mt-4 text-gray-700 font-medium">
            Analyzing your finances...
          </p>
          <p className="text-sm text-gray-500 mt-1">
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  // Summary state
  if (insights) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm p-5 sm:p-6">
        <div className="flex flex-col items-start gap-3 mb-4">
          <div className="flex flex-row w-full justify-between">
            <Image
              src="/CoinwiseLogo_v7.png"
              alt="coinwise-logo"
              width={50}
              height={50}
            />

            <h3 className="text-lg font-semibold text-slate-800">
              Smart Insights
            </h3>
            <div className="px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-700">
                {insights.financial_health_score}/10
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {isCached && cacheAge !== undefined && (
              <div className="px-2 py-0.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">
                  {cacheAge}m ago
                </span>
              </div>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed text-sm">
            {insights.insights_summary}
          </p>

          {dataSummary && (
            <p className="text-xs text-slate-500 mt-2">
              {dataSummary.period} • {dataSummary.total_transactions}{" "}
              transactions
            </p>
          )}
        </div>

        {insights.priority_alert && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50/80 border border-amber-200/60 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900 font-medium">
              {insights.priority_alert}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/60 shadow-sm">
            <div className="text-xs text-slate-600 mb-1 font-medium">
              Issues
            </div>
            <div className="text-lg font-bold text-red-600">
              {insights.money_leaks.length}
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/60 shadow-sm">
            <div className="text-xs text-slate-600 mb-1 font-medium">
              Actions
            </div>
            <div className="text-lg font-bold text-indigo-600">
              {insights.action_plan.length}
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/60 shadow-sm">
            <div className="text-xs text-slate-600 mb-1 font-medium">
              Strengths
            </div>
            <div className="text-lg font-bold text-emerald-600">
              {insights.doing_well.length}
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/ai-insight")}
          className="w-full group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-700 rounded-lg font-medium shadow-sm border border-slate-200 hover:bg-slate-50 hover:shadow transition-all duration-200 cursor-pointer"
        >
          View Detailed Analysis
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  if (!cachedInsights) {
    // Detailed view
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Image
            src="/CoinwiseLogo_v7.png"
            alt="coinwise-logo"
            width={50}
            height={50}
          />
          <h3 className="font-semibold text-lg text-slate-800">
            Smart Insights
          </h3>
        </div>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          Get personalized recommendations to optimize your spending and boost
          your savings.
        </p>
        <button
          onClick={handleGenerate}
          className="text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 hover:gap-3 hover:font-bold transition-all cursor-pointer shadow-sm hover:shadow w-full"
        >
          <Sparkle size={16} />
          Generate Insights
        </button>
      </div>
    );
  }
}
