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


  return (
    <div className="space-y-6 mx-auto max-w-4xl mb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Refresh Insights
        </button>
      </div>
      
      {/* Financial Health Score - Full Width */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Financial Health</h2>
          <div className="text-5xl font-bold">{insights && insights.financial_health_score}<span className="text-2xl text-slate-300 font-normal">/10</span></div>
        </div>
        <p className="text-slate-200 leading-relaxed">{insights && insights.score_explanation}</p>
        <div className="mt-6 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
            style={{ width: `${insights && insights.financial_health_score * 10}%` }}
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Monthly Goal */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Monthly Savings Goal</h3>
            </div>
            
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-sm text-slate-500 mb-2 font-medium">Current Savings</div>
                <div className="text-3xl font-bold text-slate-900">₱{insights && insights.monthly_goal.current_savings.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 mb-2 font-medium">Target</div>
                <div className="text-3xl font-bold text-emerald-600">₱{insights && insights.monthly_goal.target_savings.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  insights && insights.monthly_goal.percentage >= 100 ? 'bg-emerald-500' : 'bg-teal-500'
                }`}
                style={{ width: `${Math.min(insights ? insights.monthly_goal.percentage : 0, 100)}%` }}
              />
            </div>
            <div className="mt-3 text-sm text-slate-600 text-right font-medium">{insights && insights.monthly_goal.percentage.toFixed(1)}% achieved</div>
          </div>

          {/* Doing Well */}
          {insights && insights.doing_well.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">What You're Doing Well</h3>
              </div>
              <ul className="space-y-4">
                {insights && insights.doing_well.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Money Leaks */}
          {insights && insights.money_leaks.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Money Leaks</h3>
              </div>
              <div className="space-y-4">
                {insights && insights.money_leaks.map((leak, i) => (
                  <div key={i} className={`p-6 rounded-xl ${
                    leak.severity === 'high' ? 'bg-red-50' : 
                    leak.severity === 'medium' ? 'bg-amber-50' : 
                    'bg-yellow-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-bold text-slate-900 text-lg">{leak.category}</h4>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        leak.severity === 'high' ? 'bg-red-100 text-red-700' : 
                        leak.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>{leak.severity}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{leak.action}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/60 rounded-lg p-3">
                        <div className="text-xs text-slate-500 mb-1 font-medium">Current</div>
                        <div className="font-bold text-slate-900">₱{leak.current_spending.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3">
                        <div className="text-xs text-slate-500 mb-1 font-medium">Save/mo</div>
                        <div className="font-bold text-emerald-600">₱{leak.potential_savings.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3">
                        <div className="text-xs text-slate-500 mb-1 font-medium">Save/yr</div>
                        <div className="font-bold text-teal-600">₱{leak.annual_impact.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Plan - Full Width */}
      {insights && insights.action_plan.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-teal-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Action Plan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights && insights.action_plan.map((action, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-50">
                <div className="flex items-start justify-between mb-3 gap-4">
                  <h4 className="font-bold text-slate-900 text-lg flex-1">{action.title}</h4>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      action.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' : 
                      action.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 
                      'bg-slate-200 text-slate-700'
                    }`}>{action.difficulty}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-700 text-xs font-semibold">{action.timeframe}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{action.description}</p>
                <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-slate-600">Monthly savings:</span>
                  <span className="font-bold text-emerald-600">₱{action.savings.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}