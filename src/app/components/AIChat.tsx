import { PiggyBank, Send, Sparkles, Target, TrendingUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const AIChatWidget = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Hi! I'm CoinWise AI, your personal finance assistant. I can help you understand budgeting, savings strategies, and financial planning. What would you like to know?",
      time: new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickQuestions = [
    {
      icon: <PiggyBank size={16} />,
      text: "How do I start saving?",
      category: "savings",
    },
    {
      icon: <TrendingUp size={16} />,
      text: "What is budgeting?",
      category: "budget",
    },
    {
      icon: <Target size={16} />,
      text: "Setting financial goals",
      category: "goals",
    },
    {
      icon: <Sparkles size={16} />,
      text: "How does CoinWise work?",
      category: "product",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const getAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
      return "Great question! Here are some key saving strategies:\n\n• Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings\n• Automate your savings to make it effortless\n• Build an emergency fund of 3-6 months expenses\n• Set specific savings goals with deadlines\n\nWith CoinWise, our AI analyzes your spending patterns and suggests personalized saving opportunities. Want to see how it works? Sign up to get started!";
    } else if (lowerMessage.includes("budget")) {
      return "Budgeting is the foundation of financial success! 💰\n\nA budget helps you:\n• Track where your money goes\n• Identify unnecessary expenses\n• Allocate funds to your priorities\n• Stay on track with financial goals\n\nCoinWise makes budgeting easy with:\n✨ AI-powered expense categorization\n✨ Real-time spending insights\n✨ Smart alerts when you're overspending\n✨ Visual dashboards to see your progress\n\nReady to take control of your finances?";
    } else if (lowerMessage.includes("goal")) {
      return "Setting financial goals is crucial for success! 🎯\n\nHere's how to set effective goals:\n1. Make them SMART (Specific, Measurable, Achievable, Relevant, Time-bound)\n2. Break big goals into smaller milestones\n3. Track progress regularly\n4. Adjust as needed\n\nCoinWise helps you:\n• Set and track multiple financial goals\n• Get AI recommendations on how to reach them faster\n• Visualize your progress with intuitive charts\n• Receive motivational reminders\n\nWhat financial goal would you like to achieve?";
    } else if (
      lowerMessage.includes("coinwise") ||
      lowerMessage.includes("work") ||
      lowerMessage.includes("features")
    ) {
      return "CoinWise is your AI-powered financial companion! 🚀\n\nKey Features:\n• 🤖 Smart AI that learns your spending habits\n• 📊 Automated expense tracking & categorization\n• 💡 Personalized saving recommendations\n• 🎯 Goal setting and progress tracking\n• 📈 Financial insights and trends\n• 🔔 Smart alerts for bills and overspending\n• 🔒 Bank-level security\n\nOur AI analyzes your finances and provides actionable advice to help you save more and spend smarter.\n\nCreate a free account to experience the full power of AI-driven finance management!";
    } else if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("free")
    ) {
      return "We offer flexible pricing options! 💳\n\n• **Free Plan**: Basic budgeting and tracking\n• **Pro Plan**: Advanced AI insights and unlimited goals\n• **Premium**: Priority support and custom reports\n\nSign up now to start with our free plan - no credit card required! You can upgrade anytime as your needs grow.";
    } else if (
      lowerMessage.includes("sign up") ||
      lowerMessage.includes("register") ||
      lowerMessage.includes("account")
    ) {
      return "Awesome! Ready to transform your finances? 🎉\n\nTo create your account:\n1. Click the 'Get Started' button at the top of the page\n2. Enter your email and create a password\n3. Complete the quick onboarding\n4. Start tracking your finances immediately!\n\nIt takes less than 2 minutes to get started. Your financial freedom journey begins now!";
    } else {
      return "I'd be happy to help you with that! Here are some things I can assist you with:\n\n• Budgeting tips and strategies\n• Saving and investment basics\n• Understanding CoinWise features\n• Setting financial goals\n• Getting started with the app\n\nFeel free to ask me anything about personal finance or CoinWise. You can also click on the quick questions below for instant answers!";
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage = {
      role: "user",
      content: userInput,
      time: new Date().toLocaleDateString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = {
        role: "system",
        content: getAIResponse(userInput),
        time: new Date().toLocaleDateString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setUserInput(question);
    setTimeout(() => handleSendMessage(), 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/** Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-br from-amber-500 to-amber-500 
             text-white rounded-full p-4 shadow-2xl 
             hover:shadow-amber-500/50 hover:scale-110 
             transition-all duration-300 group cursor-pointer"
          aria-label="Coinwise AI chat"
        >
          {/* Circular inner container for the logo */}
          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="/CoinwiseLogo_v8.png"
              alt="Coinwise Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>

          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />

          {/* Tooltip */}
          <div
            className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-800 
                  text-white text-sm rounded-lg shadow-lg opacity-0 
                  group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                    showTooltip ? "opacity-100" : "opacity-0"
                  }`}
          >
            Ask Coinwise AI
            <div
              className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 
                    border-l-transparent border-r-transparent border-t-slate-800"
            ></div>
          </div>
        </button>
      )}

      {/** Chat window with AI */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/** Chat Header */}
          <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-300 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={"/CoinwiseLogo_v8.png"}
                  alt="coinwise-logo"
                  width={30}
                  height={30}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">CoinWise AI</h3>
                <p className="text-xs text-emerald-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/** Chat Body - Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-white rounded-br-none"
                      : "bg-white text-slate-800 rounded-bl-none shadow-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.role === "user"
                        ? "text-emerald-100"
                        : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messageRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-3 bg-white border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2 font-medium">
                Quick questions:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(q.text)}
                    className="flex items-center gap-2 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 px-3 py-2 rounded-lg transition-all hover:shadow-md"
                  >
                    {q.icon}
                    <span className="truncate">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Not authenticated •{" "}
              <Link 
              href={"/signup"}
              className="text-emerald-500 hover:underline font-medium">
                Sign up for full features
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
