"use client";

import { Send, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAiChatInfinite, useSendChat } from "../hooks/useAiChat";
import { useUser } from "../hooks/useUser";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
  model_used?: string;
}

interface UsageData {
  count: number;
  resetTime: number;
}

const allQuickQuestions = [
  { text: "How do I create a budget?", icon: "💰", category: "budgeting" },
  { text: "What's the 50/30/20 rule?", icon: "📊", category: "budgeting" },
  { text: "How to track monthly expenses?", icon: "📝", category: "tracking" },
  { text: "Tips for saving money", icon: "🤑", category: "saving" },
  { text: "Best way to save for emergencies?", icon: "🚨", category: "saving" },
  { text: "How much should I save monthly?", icon: "💵", category: "saving" },
  { text: "Where to keep emergency funds?", icon: "🏦", category: "saving" },
  { text: "How to build a savings habit?", icon: "🎯", category: "saving" },
  { text: "How to reduce daily expenses?", icon: "✂️", category: "expenses" },
  { text: "What are needs vs wants?", icon: "🤔", category: "expenses" },
  { text: "Track grocery spending tips", icon: "🛒", category: "expenses" },
  { text: "How to cut subscription costs?", icon: "📱", category: "expenses" },
  { text: "How to set financial goals?", icon: "🎯", category: "planning" },
  { text: "Plan for big purchases", icon: "🏠", category: "planning" },
  { text: "Retirement savings tips", icon: "👴", category: "planning" },
  { text: "Debt payment strategies", icon: "💳", category: "planning" },
  { text: "Paano mag-ipon ng pera?", icon: "🛒", category: "filipino" },
  { text: "Budget tips for Pinoys", icon: "🔗", category: "filipino" },
  { text: "Save money habang may utang", icon: "💡", category: "filipino" },
  { text: "Emergency fund sa Pilipinas", icon: "✍", category: "filipino" },
];

const AIChatWidget = () => {
  const GUEST_MESSAGE_LIMIT = 10;
  const RESET_INTERVAL = 60 * 60 * 1000;
  const MAX_MESSAGE_LENGTH = 300;

  const { isAuthenticated } = useUser();

  // Pass isAuthenticated to the hook
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAiChatInfinite(isAuthenticated);
  const sendChatMutation = useSendChat();

  const [showTooltip, setShowTooltip] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  const [, setUsageCount] = useState<number>(0);
  const [isGuestLimitReached, setIsGuestLimitReached] = useState(false);
  const [resetTime, setResetTime] = useState<number>(0);

  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  const shouldScrollToBottom = useRef(false);

  const getUsageData = useCallback((): UsageData => {
    if (isAuthenticated) {
      // Authenticated users don't have limits
      return { count: 0, resetTime: 0 };
    }

    const stored = localStorage.getItem("guest_usage");
    const now = Date.now();

    if (stored) {
      const data: UsageData = JSON.parse(stored);
      if (now >= data.resetTime) {
        const newData: UsageData = {
          count: 0,
          resetTime: now + RESET_INTERVAL,
        };
        localStorage.setItem("guest_usage", JSON.stringify(newData));
        return newData;
      }
      return data;
    } else {
      const newData: UsageData = {
        count: 0,
        resetTime: now + RESET_INTERVAL,
      };
      localStorage.setItem("guest_usage", JSON.stringify(newData));
      return newData;
    }
  }, [RESET_INTERVAL, isAuthenticated]);

  const getTimeRemaining = () => {
    const now = Date.now();
    const remaining = resetTime - now;

    if (remaining <= 0) return "0m";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const incrementData = () => {
    if (isAuthenticated) return; // No limit for authenticated users

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
    requestAnimationFrame(() => {
      messageRef.current?.scrollIntoView({ behavior, block: "end" });
    });
  };

  // Convert infinite query data to messages - REVERSED ORDER (oldest first, newest last)
  useEffect(() => {
    if (data?.pages && isAuthenticated) {
      const allMessages: Message[] = [];

      // Pages come in order: [newest page, older page, oldest page]
      // But we want to display: [oldest messages ... newest messages]
      // So we reverse the pages array and flatten
      const reversedPages = [...data.pages].reverse();

      reversedPages.forEach((page) => {
        const pageMessages = page.history.map((msg) => ({
          role: msg.role === "model" ? "assistant" : msg.role,
          content: msg.content,
          time: new Date(msg.timestamp).toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          model_used: msg.model_used,
        }));
        allMessages.push(...pageMessages);
      });

      setMessages(allMessages);
    } else if (!isAuthenticated) {
      // For guests, check localStorage for messages
      const storedMessages = localStorage.getItem("guest_messages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    }
  }, [data, isAuthenticated]);

  // Handle scroll to load more messages (when scrolling UP to top)
  const handleScroll = useCallback(() => {
    if (
      !scrollRef.current ||
      isFetchingNextPage ||
      !hasNextPage ||
      !isAuthenticated
    )
      return;

    const { scrollTop } = scrollRef.current;

    // If scrolled to top (within 50px), load MORE OLD messages
    if (scrollTop < 50) {
      const previousScrollHeight = scrollRef.current.scrollHeight - 20;
      const previousScrollTop = scrollRef.current.scrollTop;

      fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            const newScrollHeight = scrollRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - previousScrollHeight;
            scrollRef.current.scrollTop = previousScrollTop + scrollDiff;
          }
        });
      });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isAuthenticated]);

  // Initialize usage tracking
  useEffect(() => {
    const usageData = getUsageData();
    setUsageCount(usageData.count);
    setResetTime(usageData.resetTime);

    if (!isAuthenticated && usageData.count >= GUEST_MESSAGE_LIMIT) {
      setIsGuestLimitReached(true);
    }
  }, [getUsageData, isAuthenticated]);

  // Scroll to bottom on initial load and when chat opens
  useEffect(() => {
    if (isOpen && messages.length > 0 && isFirstLoad.current) {
      setTimeout(() => {
        scrollToBottom("auto");
        isFirstLoad.current = false;
      }, 100);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom when new message is added
  useEffect(() => {
    if (shouldScrollToBottom.current) {
      scrollToBottom("smooth");
      shouldScrollToBottom.current = false;
    }
  }, [messages]);

  // Save guest messages to localStorage
  useEffect(() => {
    if (!isAuthenticated && messages.length > 0) {
      localStorage.setItem("guest_messages", JSON.stringify(messages));
    }
  }, [messages, isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isTyping || isGuestLimitReached) return;

    // Check guest limit
    if (!isAuthenticated) {
      const usageData = getUsageData();
      if (usageData.count >= GUEST_MESSAGE_LIMIT) {
        setIsGuestLimitReached(true);
        const limitMessage: Message = {
          role: "assistant",
          content: `You've reached the free guest limit. Please sign up or log in to continue chatting.`,
          time: new Date().toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, limitMessage]);
        shouldScrollToBottom.current = true;
        return;
      }
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
    shouldScrollToBottom.current = true;

    const currentInput = userInput;
    setUserInput("");
    setIsTyping(true);
    setError(null);

    incrementData();

    try {
      const aiResponseText = await sendChatMutation.mutateAsync({
        prompt: currentInput,
      });

      const aiMessage: Message = {
        role: "assistant",
        content: aiResponseText.reply,
        time: new Date().toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
      shouldScrollToBottom.current = true;
    } catch (error) {
      setError(
        `Sorry, I'm having trouble connecting right now. Please try again.`
      );

      const errorMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        time: new Date().toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
      shouldScrollToBottom.current = true;
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setUserInput(question);
  };

  const [currentQuestions, setCurrentQuestions] = useState<
    Array<{ text: string; icon: string; category: string }>
  >([]);

  const getRotatedQuestions = useCallback(() => {
    const now = new Date();
    const currentHour = now.getMilliseconds();
    const seed = currentHour;

    const shuffled = [...allQuickQuestions].sort((a, b) => {
      const hashA = (seed * 31 + a.text.length) % allQuickQuestions.length;
      const hashB = (seed * 31 + b.text.length) % allQuickQuestions.length;
      return hashA - hashB;
    });

    return shuffled.slice(0, 4);
  }, []);

  useEffect(() => {
    const updateQuestions = () => {
      setCurrentQuestions(getRotatedQuestions());
    };
    updateQuestions();
  }, [getRotatedQuestions]);

  return (
    <div className="fixed bottom-6 right-0 md:right-6 z-50">
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

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl md:w-96 h-[600px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 place-self-center mx-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-4 flex items-center justify-between">
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

          {error && (
            <div className="bg-red-50 border-b border-red-200 px-4 py-2">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {isGuestLimitReached && !isAuthenticated && (
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

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {isAuthenticated && hasNextPage && !isFetchingNextPage && (
              <div className="flex justify-center mb-4">
                <div className="px-4 py-2 bg-blue-100 rounded-lg text-xs text-blue-700 font-medium">
                  ↑ Scroll up to load older messages
                </div>
              </div>
            )}

            {isFetchingNextPage && (
              <div className="flex justify-center mb-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading older messages...
                </div>
              </div>
            )}

            {isLoading && messages.length === 0 && isAuthenticated && (
              <div className="flex justify-center items-center h-full">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-600">
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  Loading messages...
                </div>
              </div>
            )}

            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col justify-center items-center text-center p-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
                  <Image
                    src={"/CoinwiseLogo_v7.png"}
                    alt="Coinwise AI Logo"
                    width={48}
                    height={48}
                    className="opacity-70"
                  />
                </div>

                <h2 className="text-slate-700 font-semibold text-lg mb-1">
                  Hi there👋
                </h2>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                  Ask me anything about your finances — spending, savings, or
                  insights.
                </p>

                <span className="mt-4 text-xs text-slate-400 animate-pulse">
                  Start typing below
                </span>
              </div>
            )}

            {
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[95%] text-sm rounded-2xl px-4 py-3 overflow-x-auto ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-br-none"
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
                      {msg.model_used && `${msg.model_used} • `}
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))
            }

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

            {/** Placeholder for future content */}
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

          <div className="p-4 space-y-2 bg-white border-t border-slate-200">
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
                placeholder="Ask CoinWise AI..."
                className="w-full px-4 py-3 pr-24 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none overflow-y-auto"
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
            {!isAuthenticated && (
              <p className="text-xs text-slate-400 mt-2 text-center">
                Guest mode •{" "}
                <Link
                  href={"/login"}
                  className="text-emerald-500 hover:underline font-medium"
                >
                  Login for unlimited messages
                </Link>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
