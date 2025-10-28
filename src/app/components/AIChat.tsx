import { Send, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Simple markdown parser for bold, italic, and line breaks
// const parseMarkdown = (text: string) => {
//   // Replace **bold** with <strong>
//   let parsed = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

//   // Replace *italic* with <em>
//   parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>");

//   // Replace bullet points • with proper formatting
//   parsed = parsed.replace(/^• /gm, "• ");

//   return parsed;
// };

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

interface UsageData {
  count: number;
  resetTime: number;
}

  // All available quick questions
  const allQuickQuestions = [
    // Budgeting
    { text: "How do I create a budget?", icon: "💰", category: "budgeting" },
    { text: "What's the 50/30/20 rule?", icon: "📊", category: "budgeting" },
    {
      text: "How to track monthly expenses?",
      icon: "📝",
      category: "tracking",
    },
    { text: "Tips for saving money", icon: "🤑", category: "saving" },

    // Savings
    {
      text: "Best way to save for emergencies?",
      icon: "🚨",
      category: "saving",
    },
    { text: "How much should I save monthly?", icon: "💵", category: "saving" },
    { text: "Where to keep emergency funds?", icon: "🏦", category: "saving" },
    { text: "How to build a savings habit?", icon: "🎯", category: "saving" },

    // Expenses
    { text: "How to reduce daily expenses?", icon: "✂️", category: "expenses" },
    { text: "What are needs vs wants?", icon: "🤔", category: "expenses" },
    { text: "Track grocery spending tips", icon: "🛒", category: "expenses" },
    {
      text: "How to cut subscription costs?",
      icon: "📱",
      category: "expenses",
    },

    // Planning
    { text: "How to set financial goals?", icon: "🎯", category: "planning" },
    { text: "Plan for big purchases", icon: "🏠", category: "planning" },
    { text: "Retirement savings tips", icon: "👴", category: "planning" },
    { text: "Debt payment strategies", icon: "💳", category: "planning" },

    // Filipino-specific
    { text: "Paano mag-ipon ng pera?", icon: "🛒", category: "filipino" },
    { text: "Budget tips for Pinoys", icon: "🔗", category: "filipino" },
    { text: "Save money habang may utang", icon: "💡", category: "filipino" },
    { text: "Emergency fund sa Pilipinas", icon: "✍", category: "filipino" },
  ];

const AIChatWidget = () => {
  const GUEST_MESSAGE_LIMIT = 10;
  const RESET_INTERVAL = 60 * 60 * 1000; // 60 minutes in ms
  const MESSAGES_PER_PAGE = 10;
  const MAX_MESSAGE_LENGTH = 300;

  const [showTooltip, setShowTooltip] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleCount, setVisibleCount] = useState(MESSAGES_PER_PAGE);
  const [userInput, setUserInput] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [, setUsageCount] = useState<number>(0);
  const [isGuestLimitReached, setIsGuestLimitReached] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [resetTime, setResetTime] = useState<number>(0);

  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const lastMessageCountRef = useRef(0);

  const visibleMessages = messages.slice(-visibleCount);
  const hasMoreMessages = messages.length > visibleCount;

  const handleScroll = () => {
    if (!scrollRef.current || isLoadingMore || !hasMoreMessages) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // Track if user is manually scrolling
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    isUserScrollingRef.current = !isNearBottom;

    // If scrolled near top (within 100px), load more
    if (scrollTop < 100) {
      loadMoreMessages();
    }
  };

  const loadMoreMessages = () => {
    if (isLoadingMore || !hasMoreMessages) return;

    setIsLoadingMore(true);

    // Get current scroll position before loading
    const currentScrollTop = scrollRef.current?.scrollTop || 0;
    const currentScrollHeight = scrollRef.current?.scrollHeight || 0;

    setTimeout(() => {
      setVisibleCount((prev) =>
        Math.min(prev + MESSAGES_PER_PAGE, messages.length)
      );

      // Wait for DOM to update, then maintain scroll position
      setTimeout(() => {
        if (scrollRef.current) {
          const newScrollHeight = scrollRef.current.scrollHeight;
          const heightDifference = newScrollHeight - currentScrollHeight;

          // Keep user at the same visual position
          scrollRef.current.scrollTop = currentScrollTop + heightDifference;
        }
        setIsLoadingMore(false);
      }, 0);
    }, 300);
  };

  const getUsageData = useCallback((): UsageData => {
    const stored = localStorage.getItem("guest_usage");
    const now = Date.now();

    if (stored) {
      const data: UsageData = JSON.parse(stored);

      if (now >= data.resetTime) {
        // reset usage
        const newData: UsageData = {
          count: 0,
          resetTime: now + RESET_INTERVAL,
        };

        localStorage.setItem("guest_usage", JSON.stringify(newData));
        return newData;
      }
      return data;
    } else {
      // initialize new data
      const newData: UsageData = {
        count: 0,
        resetTime: now + RESET_INTERVAL,
      };
      localStorage.setItem("guest_usage", JSON.stringify(newData));
      return newData;
    }
  }, [RESET_INTERVAL]);

  const getTimeRemaining = () => {
    const now = Date.now();
    const remaining = resetTime - now;

    if (remaining <= 0) return "0m";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // update usage count
  const incrementData = () => {
    const currentData = getUsageData();
    const newData: UsageData = {
      count: currentData.count + 1,
      resetTime: currentData.resetTime,
    };

    localStorage.setItem("guest_usage", JSON.stringify(newData));
    setUsageCount(newData.count);
    setResetTime(newData.resetTime);

    if (newData.count >= GUEST_MESSAGE_LIMIT) {
      setIsGuestLimitReached(true);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messageRef.current?.scrollIntoView({ behavior });
  };

  // Load messages once when component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem("guest_chat");
    if (storedMessages) {
      const parsed = JSON.parse(storedMessages);
      setMessages(parsed);
    } else {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm CoinWise AI, your personal finance agent. I can help you understand budgeting, savings strategies, and financial planning. What would you like to know?",
          time: new Date().toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    // Load and check usage
    const usageData = getUsageData();
    setUsageCount(usageData.count);
    setResetTime(usageData.resetTime);

    if (usageData.count >= GUEST_MESSAGE_LIMIT) {
      setIsGuestLimitReached(true);
    }

    setIsInitialized(true);
  }, [getUsageData]);

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen) {
      scrollToBottom("auto");
    }
  }, [isOpen]);

  // Save messages to localStorage whenever they change (after initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("guest_chat", JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  // Scroll to bottom when new message is added (not when loading more)
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current && !isLoadingMore) {
      scrollToBottom("smooth");
    }
    lastMessageCountRef.current = messages.length;
  }, [messages.length, isLoadingMore]);

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
    if (!userInput.trim() || isTyping || isGuestLimitReached) return;

    // Check current usage
    const usageData = getUsageData();
    if (usageData.count >= GUEST_MESSAGE_LIMIT) {
      setIsGuestLimitReached(true);
      const limitMessage: Message = {
        role: "assistant",
        content: `You've reached the free guest limit...`,
        time: new Date().toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, limitMessage]);
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: userInput,
      time: new Date().toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Expand visible count if needed to show new message
    if (visibleCount < messages.length + 1) {
      setVisibleCount(messages.length + 1);
    }

    const currentInput = userInput;
    setUserInput("");
    setIsTyping(true);
    setError(null);

    incrementData();

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

      // Expand visible count for AI response too
      if (visibleCount < messages.length + 2) {
        setVisibleCount(messages.length + 2);
      }
    } catch (error) {
      setError(
        `Sorry, I'm having trouble connecting right now. Please try again.${error}`
      );

      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm experiencing technical difficulties...",
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
  };

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSendMessage();
  //   }
  // };

  const [currentQuestions, setCurrentQuestions] = useState<
    Array<{ text: string; icon: React.ReactNode }>
  >([]);

  // Get random 4 questions based on current hour
  const getRotatedQuestions = useCallback(() => {
    const now = new Date();
    const currentHour = now.getMilliseconds();

    // Use hour as seed for consistent questions within the hour
    const seed = currentHour;

    // Shuffle array based on seed
    const shuffled = [...allQuickQuestions].sort((a, b) => {
      const hashA = (seed * 31 + a.text.length) % allQuickQuestions.length;
      const hashB = (seed * 31 + b.text.length) % allQuickQuestions.length;
      return hashA - hashB;
    });

    return shuffled.slice(0, 4);
  }, []);

  // Initialize and update questions every hour
  useEffect(() => {
    const updateQuestions = () => {
      setCurrentQuestions(getRotatedQuestions());
    };
    // Set initial questions
    updateQuestions();
  }, []);

  return (
    <div className="fixed bottom-6 right-0 md:right-6 z-50">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setShowQuickQuestions(true);
          }}
          className="relative bg-gradient-to-br from-amber-500 to-amber-500 
             text-white rounded-full p-4 shadow-2xl 
             hover:shadow-amber-500/50 hover:scale-110 
             transition-all duration-300 group cursor-pointer right-6"
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
        <div className="bg-white rounded-2xl shadow-2xl md:w-96 h-[600px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 place-self-center mx-4">
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

          {isGuestLimitReached && (
            <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 shadow-sm">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-base font-bold text-red-600">
                    Guest Limit Reached
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Resets in:{" "}
                  <span className="font-mono font-medium text-slate-700">
                    {getTimeRemaining()}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                >
                  Sign Up Free
                </Link>
                <span className="text-slate-400">or</span>
                <Link
                  href="/login"
                  className="px-6 py-2 bg-white text-slate-700 font-semibold border-2 border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors"
                >
                  Log In
                </Link>
              </div>

              <p className="text-xs text-slate-500 text-center max-w-md">
                Create a free account to get unlimited messages and access
                premium features
              </p>
            </div>
          )}

          {/* Chat Body - Messages */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {/* Loading indicator */}
            {isLoadingMore && (
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading messages...
                </div>
              </div>
            )}

            {/* Show message count */}
            {hasMoreMessages && !isLoadingMore && (
              <div className="flex justify-center mb-4">
                <div className="px-4 py-2 bg-slate-100 rounded-lg text-xs text-slate-600">
                  Showing {visibleCount} of {messages.length} messages • Scroll
                  up to load more
                </div>
              </div>
            )}

            {visibleMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 overflow-x-auto ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-300 text-white rounded-br-none"
                      : "bg-white text-slate-800 rounded-bl-none shadow-md"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="leading-tight mb-1">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-700">{children}</em>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {children}
                        </a>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside pl-2 space-y-1 text-gray-700">
                          {children}
                        </ul>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
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

          {showQuickQuestions && currentQuestions.length > 0 && (
            <div className="px-4 py-3 bg-white border-t border-slate-200 relative">
              <p className="text-xs text-slate-500 mb-2 font-medium">
                💡 Quick questions:
              </p>
              <X
                onClick={() => setShowQuickQuestions(false)}
                className="w-4 h-4 absolute top-2 right-2 cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-2">
                {currentQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleQuickQuestion(q.text);
                    }}
                    className="flex items-center gap-2 text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 px-3 py-2 rounded-lg transition-all hover:shadow-md"
                  >
                    <span>{q.icon}</span>
                    <span className="truncate text-left">{q.text}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                ⏰ Questions refresh every hour
              </p>
            </div>
          )}

          {/* Input */}
          <div className="p-4 space-y-2 bg-white border-t border-slate-200">
            {/* Character counter */}
            {userInput.length > 0 && (
              <div
                className={`text-xs ${
                  userInput.length >= MAX_MESSAGE_LENGTH
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {userInput.length} / {MAX_MESSAGE_LENGTH} characters
                {userInput.length >= MAX_MESSAGE_LENGTH && (
                  <span> - Maximum limit reached</span>
                )}
              </div>
            )}
            <div className="flex gap-2 items-center">
              <textarea
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  // Auto-resize
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 150) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask CoinWise AI."
                className="w-full px-4 py-3 pr-24 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
                style={{ minHeight: "52px", maxHeight: "200px" }}
                rows={1}
                maxLength={MAX_MESSAGE_LENGTH}
              />

              <button
                onClick={() => {
                  handleSendMessage();
                  setShowQuickQuestions(false);
                }}
                disabled={
                  !userInput.trim() ||
                  isTyping ||
                  userInput.length === 0 ||
                  userInput.length >= MAX_MESSAGE_LENGTH ||
                  isGuestLimitReached
                }
                className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Not authenticated •{" "}
              <Link
                href={"/login"}
                className="text-emerald-500 hover:underline font-medium"
              >
                Login for full features
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
