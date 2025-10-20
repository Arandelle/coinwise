"use client"

import { MapPin, Mail, TrendingUp, Target, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/hooks/useUser';
import LoadingCoin from '@/app/components/Loading';

export default function CoinWiseProfile() {
  const {user, loading, error } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
      await fetch('/api/auth/logout', {
        method: "POST"
      });

  router.push("/login");
  router.refresh();    
  }

  if (loading) {
    return (
      <LoadingCoin label='Loading profile...'/>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">Please log in to view your profile</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Login
        </button>

        <button onClick={handleLogout}>logout</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Image with Financial Theme */}
        <div className="h-48 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 text-white text-6xl">💰</div>
            <div className="absolute top-8 right-8 text-white text-4xl">📊</div>
            <div className="absolute bottom-6 left-12 text-white text-3xl">💵</div>
            <div className="absolute bottom-8 right-6 text-white text-5xl">💳</div>
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Budget Health Score Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">8.5/10</span>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="relative px-6">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg overflow-hidden flex items-center justify-center">
              <span className="text-white text-5xl">🎯</span>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-6 px-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Sarah Johnson
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Smart spender | Savings enthusiast 💰<br />
            Building wealth through mindful spending
          </p>

          {/* AI Insight Badge */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">AI INSIGHT</span>
            </div>
            <p className="text-sm text-slate-700">
              Your spending is <span className="font-semibold text-emerald-600">15% better</span> than last month!
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex items-center justify-center gap-6 mb-6 text-slate-600 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>San Francisco</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Share Tips</span>
            </div>
          </div>

          {/* Current Goal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">CURRENT GOAL</span>
            </div>
            <p className="text-sm font-medium text-slate-700">
              Saving for Emergency Fund
            </p>
          </div>

          {/* Stats */}
          <div className="flex border-t border-b border-slate-200">
            <div className="flex-1 py-4 border-r border-slate-200">
              <div className="text-2xl font-bold text-emerald-600">$12,450</div>
              <div className="text-sm text-slate-500">Total Saved</div>
            </div>
            <div className="flex-1 py-4">
              <div className="text-2xl font-bold text-teal-600">89 Days</div>
              <div className="text-sm text-slate-500">Tracking Streak</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
            onClick={handleLogout}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
              Logout
            </button>
            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg transition-colors duration-200">
              View Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}