"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  Zap,
  Brain,
  ChevronDown,
  Menu,
  X,
  PieChart,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CoinWiseLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Insights",
      description:
        "Get personalized recommendations and smart alerts about your spending patterns. Our AI learns your habits and helps you save more.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real-Time Tracking",
      description:
        "Track every expense effortlessly. See where your money goes with beautiful visualizations and instant categorization.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Goal Setting",
      description:
        "Set financial goals and watch your progress. Emergency fund, vacation, or dream home - we'll help you get there faster.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Savings Challenges",
      description:
        "Take on personal finance challenges to stay motivated. Hit your weekly or monthly savings targets and track your streaks with ease.",
      color: "from-pink-500 to-rose-500",
    },

    {
      icon: <Zap className="w-8 h-8" />,
      title: "Budget Optimizer",
      description:
        "Automatically optimize your budget allocation. Get suggestions to cut costs and maximize your savings potential.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Expense Visualization",
      description:
        "Understand your finances at a glance with intuitive charts and analytics that show where your money really goes.",
      color: "from-sky-500 to-blue-500",
    },
  ];

  const stats = [
    { value: "$2.5M+", label: "Total Saved by Users" },
    { value: "50K+", label: "Active Users" },
    { value: "4.9/5", label: "User Rating" },
    { value: "85%", label: "Average Savings Increase" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image
                src="/CoinwiseLogo_v7.png"
                alt="coinwise-logo"
                width={50}
                height={50}
              />
              <span className={`text-2xl font-bold text-emerald-600`}>
                CoinWise
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Pricing
              </a>
              <Link
                href={"/login"}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Login
              </Link>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block text-slate-600 hover:text-emerald-600"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-slate-600 hover:text-emerald-600"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="block text-slate-600 hover:text-emerald-600"
              >
                Pricing
              </a>
              <button className="w-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg">
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-100 via-teal-100 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-8xl">💰</div>
          <div className="absolute top-40 right-20 text-6xl">📊</div>
          <div className="absolute bottom-20 left-1/4 text-7xl">💵</div>
          <div className="absolute bottom-40 right-1/3 text-5xl">🎯</div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-slate-700">
                AI-Powered Financial Tracking
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Take Control of Your
              <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Track expenses, set goals, and build wealth with intelligent
              budgeting. Join thousands who have transformed their financial
              lives with CoinWise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={"/signup"}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Start CoinWise Free!
              </Link>
              <button className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-emerald-500 transition-all duration-200">
                Explore Guest Mode
              </button>
            </div>

            <p className="text-sm text-slate-500 mt-6">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        >
          <ChevronDown className="w-8 h-8 text-emerald-500" />
        </button>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make budgeting effortless and
              actually enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-emerald-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Simple. Smart. Effective.
            </h2>
            <p className="text-xl text-slate-600">
              Get started in just 3 easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Create or Continue Without an Account",
                description:
                  "You can start using Coinwise right away — no signup required. But if you connect your email, your data will be securely saved for future access.",
                icon: "🔗",
              },
              {
                step: "02",
                title: "Set Your Financial Goals",
                description:
                  "Define what you’re saving for — like an emergency fund, travel, or new gadget. Coinwise helps you plan your budget around what matters most.",
                icon: "🎯",
              },
              {
                step: "03",
                title: "Track and Improve Your Spending",
                description:
                  "View your transactions, analyze spending habits, and gain insights powered by smart AI suggestions — all designed to help you save more.",
                icon: "📊",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-6">{item.icon}</div>
                <div className="text-emerald-600 font-bold text-lg mb-3">
                  STEP {item.step}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-slate-600">
              See what our users have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Freelance Designer",
                avatar: "👩‍💻",
                text: "CoinWise helped me save $5,000 in just 6 months! The AI insights are game-changing.",
                saved: "$5,000",
              },
              {
                name: "Michael Rodriguez",
                role: "Software Engineer",
                avatar: "👨‍💼",
                text: "Finally, a budgeting app that does not feel like a chore. The community challenges keep me motivated!",
                saved: "$8,200",
              },
              {
                name: "Emily Taylor",
                role: "Marketing Manager",
                avatar: "👩‍🎨",
                text: "I paid off my credit card debt in 8 months. The budget optimizer is incredibly smart.",
                saved: "$12,000",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 mb-4 italic">{`"${testimonial.text}"`}</p>
                <div className="inline-block bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold">
                  Saved {testimonial.saved}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-9xl">💰</div>
          <div className="absolute bottom-10 left-10 text-8xl">🎯</div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-emerald-100 mb-10">
            Join 50,000+ users who are already building their financial future
            with CoinWise
          </p>
          <button className="px-10 py-5 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            Start Your Free Trial
          </button>
          <p className="text-emerald-100 mt-6">
            14-day free trial • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-xl font-bold text-white">CoinWise</span>
              </div>
              <p className="text-sm">
                Making financial wellness accessible to everyone.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2025 CoinWise. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
