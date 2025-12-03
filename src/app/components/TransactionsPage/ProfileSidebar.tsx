import React from "react";
import { User, TrendingUp } from "lucide-react";
import { useWallet } from "@/app/hooks/useAccount";
import { useUser } from "@/app/hooks/useUser";

interface ProfileSidebarProps {
  totalSpent: number;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  totalSpent,
}) => {

  const {data: account} = useWallet();
  const {data: user} = useUser();
  
  const hasIncome = totalSpent > 0;
  const remaining = (account?.[0]?.balance ?? 0) + (totalSpent ?? 0);

  return (
    <div className="lg:block lg:col-span-3 space-y-6 order-2 md:order-1">
      {/* Profile Card */}
      <div className="bg-white rounded-xl p-6 shadow-md sticky">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <User className="text-white" size={32} />
          </div>
          <h3 className="font-semibold text-lg text-gray-900">
            {user ? `Welcome ${user.username}` : "Guest mode"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">Track your finances</p>

          <div className="w-full space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
              <span className="text-sm text-gray-600">Monthly Budget</span>
   
              <span className="text-sm font-semibold text-gray-900"
              
              >
                {account?.[0]?.balance.toLocaleString() ?? 0}
              </span>

            </div>
            <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${hasIncome ? "from-emerald-50 to-teal-50" : "from-rose-50 to-red-50"}  rounded-lg`}>
              <span className="text-sm text-gray-600">{hasIncome ? "Income" : "Spent"} this month</span>
              <span className={`text-sm font-semibold ${hasIncome ? "text-emerald-600" : "text-rose-600"}`}>
                ₱{totalSpent.toLocaleString()}
              </span>
            </div>
            <div className={`flex items-center justify-between p-3 bg-gradient-to-r ${remaining > 0 ? "from-emerald-50 to-teal-50" : "from-rose-50 to-red-50"} rounded-lg`}>
              <span className="text-sm text-gray-600">Remaining</span>
              <span className={`text-sm font-semibold ${remaining > 0 ? "text-emerald-600" : "text-red-600"} `}>
                ₱{remaining.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spending Forecast */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={24} className="text-teal-600" />
          <h3 className="font-semibold text-lg text-gray-900">Forecast</h3>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {`At your current rate, ${hasIncome ? "you'll gain: " : "you'll spend: "}`}
        </p>
        <p className={`text-2xl font-bold ${hasIncome ? "text-emerald-600" : "text-rose-600"}`}>
          ₱{Math.round(totalSpent * 1.5).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">by end of month</p>
      </div>
    </div>
  );
};

export default ProfileSidebar;