import React from "react";
import { User, TrendingUp } from "lucide-react";

interface ProfileSidebarProps {
  user: { username: string } | null;
  totalSpent: number;
  remaining: number;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  totalSpent,
  remaining,
}) => {
  return (
    <div className="hidden lg:block lg:col-span-3 space-y-6">
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
              <span className="text-sm font-semibold text-gray-900">
                ₱25,000
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-50 to-red-50 rounded-lg">
              <span className="text-sm text-gray-600">Spent this month</span>
              <span className="text-sm font-semibold text-rose-500">
                ₱{totalSpent.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className="text-sm font-semibold text-emerald-600">
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
          {`At your current rate, you'll spend:`}
        </p>
        <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
          ₱{Math.round(totalSpent * 1.5).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">by end of month</p>
      </div>
    </div>
  );
};

export default ProfileSidebar;