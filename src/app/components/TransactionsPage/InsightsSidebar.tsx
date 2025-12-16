import React from "react";
import { Brain, ChevronRight, Target } from "lucide-react";
import { getLucideIcon } from "../ReusableComponent/Lucidecon";
import { useTopCategories } from "@/app/hooks/useApi";
import AIInsightsSimple from "../AIInsights";

const InsightsSidebar = () => {
  const { data: top_categories} = useTopCategories();

  return (
    <div className="lg:col-span-3 space-y-6 order-3">
      {/* AI Insights */}
      <AIInsightsSimple />

      {/* Weekly Challenges */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Target size={24} className="text-emerald-600" />
          <h3 className="font-semibold text-lg text-gray-900">
            Weekly Challenges
          </h3>
        </div>

        <div className="space-y-4">
          <div className="border-l-4 border-emerald-500 pl-4 py-2">
            <p className="text-sm font-medium text-gray-900">
              No dining out for 3 days
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                  style={{ width: "66%" }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">2/3</span>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm font-medium text-gray-900">
              Save ₱500 this week
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <span className="text-xs text-gray-600">₱200/₱500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          Top Categories
        </h3>
        
        <div className="space-y-3">          
          {top_categories && top_categories.length > 0 ? (
            top_categories.map((cat, idx) => {
              const Icon = getLucideIcon(cat.category.icon);

              return (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      cat.category.type === "expense"
                        ? "bg-rose-600"
                        : "bg-emerald-600"
                    }`}
                  >
                    <Icon size={16} className="text-white" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {cat.category.category_name}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 italic mt-6">
              {`You haven’t added any transactions yet.`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsSidebar;
