import { PiggyBank, Send, Sparkles, Target, TrendingUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

// Simple markdown parser for bold, italic, and line breaks
const parseMarkdown = (text: string) => {
  // Replace **bold** with <strong>
  let parsed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace *italic* with <em>
  parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Replace bullet points • with proper formatting
  parsed = parsed.replace(/^• /gm, '• ');
  
  return parsed;
};

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const AIChatWidget = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm CoinWise AI, your personal finance assistant. I can help you understand budgeting, savings strategies, and financial planning. What would you like to know?",
      time: new Date().toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const callAIAPI = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to get AI response");
      }

      const data = await response.json();
      
      // Backend returns { "reply": "..." }
      return data.reply || data.response || data.message || data;
    } catch (error) {
      console.error("AI API Error:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: userInput,
      time: new Date().toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput("");
    setIsTyping(true);
    setError(null);

    try {
      const aiResponseText = await callAIAPI(currentInput);

      const aiMessage: Message = {
        role: "assistant",
        content: aiResponseText,
        time: new Date().toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setError("Sorry, I'm having trouble connecting right now. Please try again.");
      
      // Optional: Add error message to chat
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        time: new Date().toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setUserInput(question);
    // Small delay for UX
    setTimeout(() => {
      const event = new KeyboardEvent("keypress", { key: "Enter" });
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-br from-amber-500 to-amber-500 
             text-white rounded-full p-4 shadow-2xl 
             hover:shadow-amber-500/50 hover:scale-110 
             transition-all duration-300 group cursor-pointer"
          aria-label="Coinwise AI chat"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="/CoinwiseLogo_v8.png"
              alt="Coinwise Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>

          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />

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

      {/* Chat window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Chat Header */}
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

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border-b border-red-200 px-4 py-2">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Chat Body - Messages */}
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
                  <p className="text-sm whitespace-pre-line"
                  dangerouslySetInnerHTML={{__html: parseMarkdown(msg.content)}}
                  />
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
                disabled={isTyping}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isTyping}
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
                className="text-emerald-500 hover:underline font-medium"
              >
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