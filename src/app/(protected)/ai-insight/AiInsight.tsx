// components/AIInsightsSimple.tsx
'use client';

import { AIInsights } from '../../hooks/useAiInsights';
import { 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  Target,
  Zap,
  TrendingDown,
} from 'lucide-react';

interface AIInsightsSimpleProps {
 insights?: AIInsights,
 handleGenerate?: () => void,
 isPending?: boolean
}

export default function AIInsightsSimple({ 
  insights,
  handleGenerate,
  isPending
}: AIInsightsSimpleProps) {

  // Detailed view
  return (
    <div className="space-y-6 mx-auto max-w-4xl mb-4">
      <div className="flex items-center justify-between">

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