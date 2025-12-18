// pages/ai-insights/page.tsx
"use client"
import AIInsightsSimple from '@/app/(protected)/ai-insight/AiInsight'
import { useAIInsights, useGenerateInsights } from '@/app/hooks/useAiInsights'
import Loading from '@/app/loading'

const AIInsightsPage = () => {
  const { data, isLoading } = useAIInsights(true);
 const {
    mutate: generateInsights,
    data: responseData,
    isPending,
    error,
  } = useGenerateInsights();

  const handleGenerate = () =>{
    generateInsights({})
  }

  if (isLoading) {
    return <Loading />
  }

  // Type guard: Check if insights is the actual AIInsights type
  const insights = data?.insights && 'financial_health_score' in data.insights 
    ? data.insights 
    : null

  // Handle insufficient data case
  if (data?.insights && 'type' in data.insights) {
    return (
      <div className="p-6">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
          <h3 className="font-bold text-amber-900 mb-2">Need More Data</h3>
          <p className="text-amber-700 mb-2">{data.insights.message}</p>
          <p className="text-amber-600">💡 {data.insights.suggestion}</p>
        </div>
      </div>
    )
  }

  // Handle no data case
  if (!insights) {
    return (
      <div className="p-6">
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6">
          <p className="text-gray-600">No insights available. Please generate insights first.</p>
        </div>
      </div>
    )
  }

  return (
    <AIInsightsSimple 
      insights={insights}
      handleGenerate={handleGenerate}
      isPending={isPending}
    />
  )
}

export default AIInsightsPage