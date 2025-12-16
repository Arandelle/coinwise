// components/AIInsightsSimple.tsx
'use client';

import { useState } from 'react';
import { useGenerateInsights } from '../hooks/useAiInsights';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Loader2,
  Target,
  Zap,
  TrendingDown,
  ArrowLeft,
  Clock,
  Database
} from 'lucide-react';

interface AIInsightsSimpleProps {
  // All props are optional - component will use current month if not provided
  start_date?: string;
  end_date?: string;
  category?: string;
}

export default function AIInsightsSimple({ 
  start_date, 
  end_date, 
  category 
}: AIInsightsSimpleProps = {}) {
  const [showDetails, setShowDetails] = useState(false);
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

  // Initial state - not generated yet
  if (!insights && !isPending) {
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
  if (insights && !showDetails) {
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
            onClick={() => setShowDetails(true)}
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowDetails(false)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Summary
        </button>
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {/* Financial Health Score */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Financial Health</h2>
          <div className="text-5xl font-black">{insights && insights.financial_health_score}<span className="text-2xl text-purple-200">/10</span></div>
        </div>
        <p className="text-purple-100">{insights && insights.score_explanation}</p>
        <div className="mt-6 h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-1000"
            style={{ width: `${insights && insights.financial_health_score * 10}%` }}
          />
        </div>
      </div>

      {/* Monthly Goal */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Monthly Savings Goal</h3>
        </div>
        
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Current</div>
            <div className="text-3xl font-bold text-gray-900">₱{insights && insights.monthly_goal.current_savings.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Target</div>
            <div className="text-2xl font-bold text-emerald-600">₱{insights && insights.monthly_goal.target_savings.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              insights && insights.monthly_goal.percentage >= 100 ? 'bg-emerald-500' : 'bg-violet-500'
            }`}
            style={{ width: `${Math.min(insights ? insights.monthly_goal.percentage : 0, 100)}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-600 text-right">{insights && insights.monthly_goal.percentage.toFixed(1)}%</div>
      </div>

      {/* Doing Well */}
      {insights && insights.doing_well.length > 0 && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">What You're Doing Well</h3>
          </div>
          <ul className="space-y-3">
            {insights && insights.doing_well.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Money Leaks */}
      {insights && insights.money_leaks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Money Leaks</h3>
          </div>
          <div className="space-y-4">
            {insights && insights.money_leaks.map((leak, i) => (
              <div key={i} className={`p-4 rounded-xl border-2 ${
                leak.severity === 'high' ? 'bg-red-50 border-red-200' : 
                leak.severity === 'medium' ? 'bg-amber-50 border-amber-200' : 
                'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-900">{leak.category}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    leak.severity === 'high' ? 'bg-red-200 text-red-800' : 
                    leak.severity === 'medium' ? 'bg-amber-200 text-amber-800' : 
                    'bg-yellow-200 text-yellow-800'
                  }`}>{leak.severity}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{leak.action}</p>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-600">Current</div>
                    <div className="font-semibold text-gray-900">₱{leak.current_spending.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Save/mo</div>
                    <div className="font-semibold text-emerald-600">₱{leak.potential_savings.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Save/yr</div>
                    <div className="font-semibold text-violet-600">₱{leak.annual_impact.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan */}
      {insights && insights.action_plan.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Action Plan</h3>
          </div>
          <div className="space-y-4">
            {insights && insights.action_plan.map((action, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 flex-1">{action.title}</h4>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      action.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' : 
                      action.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>{action.difficulty}</span>
                    <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">{action.timeframe}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-gray-600">Saves:</span>
                  <span className="font-semibold text-emerald-600">₱{action.savings.toLocaleString()}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}