import React, { useState, useRef, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import { Category, Department } from "../types";
import UploadCard from "./UploadCard";
import SearchFilters from "./SearchFilters";
import {
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  MessageCircle,
  X,
  Send,
  PlusCircle,
} from "lucide-react";

// === API Config ===
const LM_STUDIO_API =
  window.location.hostname === "localhost"
    ? "http://localhost:1234/v1/chat/completions"
    : "https://repository-ky-atmosphere-well.trycloudflare.com/v1/chat/completions";

const MODEL_NAME = "AI_SRK_CHATBOT";

const Dashboard: React.FC = () => {
  const { uploads, searchUploads } = useData();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | "">("");
  const [customDepartment, setCustomDepartment] = useState("");

  // Chatbot states
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [showTypingDots, setShowTypingDots] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll chat to bottom on changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAITyping, showTypingDots]);

  // Filter uploads
  const filteredUploads = searchUploads(
    searchQuery,
    selectedCategory || undefined,
    selectedDepartment || undefined,
    selectedDepartment === "Others" ? customDepartment : undefined
  );
  const sortedUploads = filteredUploads.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Dashboard stats
  const stats = {
    totalUploads: uploads.length,
    totalUsers: new Set(uploads.map((u) => u.uploaderId)).size,
    categoriesCount: new Set(uploads.map((u) => u.category)).size,
    thisWeek: uploads.filter((u) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return u.createdAt >= weekAgo;
    }).length,
  };

  // Ask LM Studio
  async function askLMStudio(prompt: string) {
    try {
      const res = await fetch(LM_STUDIO_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for Smart Notes.",
            },
            ...chatHistory,
            { role: "user", content: prompt },
          ],
        }),
      });
      const data = await res.json();
      return (
        data.choices?.[0]?.message?.content || "No response from AI."
      );
    } catch {
      return "❌ Error: Unable to connect to the Server.Try reaching out the Admin...😊";
    }
  }

  // Typing effect
  function displayTypingEffect(fullText: string) {
    setIsAITyping(true);
    let index = 0;
    const typingInterval = setInterval(() => {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = fullText.slice(0, index);
        return updated;
      });
      index++;
      if (index > fullText.length) {
        clearInterval(typingInterval);
        setIsAITyping(false);
      }
    }, 20);
  }

  // Send
  async function handleSend() {
    if (!userMessage.trim()) return;

    // User msg
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }]);
    const prompt = userMessage;
    setUserMessage("");

    // Prepare AI empty msg + show dots
    setChatHistory((prev) => [...prev, { role: "assistant", content: "" }]);
    setShowTypingDots(true);

    const aiReply = await askLMStudio(prompt);
    setShowTypingDots(false); // hide dots before typing
    displayTypingEffect(aiReply);
  }

  // Open with welcome
  function openChatbot() {
    setChatHistory([
      { role: "assistant", content: "👋 Hello! I'm your personal assistant, powered by Team Wexler. How can I help you today?" },
    ]);
    setIsChatbotOpen(true);
  }

  // Reset
  function startNewChat() {
    setChatHistory([
      { role: "assistant", content: "👋 Hello! I'm your personal assistant, powered by Team Wexler. How can I help you today?" },
    ]);
    setUserMessage("");
  }

  return (
    <div className="space-y-6 relative min-h-screen">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Smart Notes</h1>
        <p className="text-blue-100 text-lg">
          Your intelligent academic resource hub for sharing and discovering study materials
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<BookOpen size={24} className="text-blue-600" />} bg="bg-blue-100" value={stats.totalUploads} label="Total Resources" />
        <StatCard icon={<Users size={24} className="text-green-600" />} bg="bg-green-100" value={stats.totalUsers} label="Contributors" />
        <StatCard icon={<TrendingUp size={24} className="text-purple-600" />} bg="bg-purple-100" value={stats.categoriesCount} label="Categories" />
        <StatCard icon={<Calendar size={24} className="text-orange-600" />} bg="bg-orange-100" value={stats.thisWeek} label="This Week" />
      </div>

      {/* Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        customDepartment={customDepartment}
        onCustomDepartmentChange={setCustomDepartment}
      />

      {/* Uploads */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          Recent Uploads{" "}
          {filteredUploads.length !== uploads.length &&
            `(${filteredUploads.length} results)`}
        </h2>
        {sortedUploads.length === 0 ? <EmptyUploads /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedUploads.map(upload => <UploadCard key={upload.id} upload={upload} />)}
          </div>
        )}
      </div>

      {/* Floating expandable button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openChatbot}
          className="group flex items-center bg-blue-600 text-white rounded-full shadow-lg overflow-hidden transition-all duration-300 ease-out hover:pr-4"
        >
          <div className="p-4">
            <MessageCircle size={24} />
          </div>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-out">
            Your Assistant
          </span>
        </button>
      </div>

      {/* Chat panel */}
      {isChatbotOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50"
          onClick={(e) => { if (e.target === e.currentTarget) setIsChatbotOpen(false); }}
        >
          <div className="bg-white w-full sm:w-[450px] h-full shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white">
              <h3 className="text-lg font-semibold">Smart Note's Personal Assistant</h3>
              <div className="flex items-center gap-3">
                <button onClick={startNewChat} title="New Chat">
                  <PlusCircle size={20} />
                </button>
                <button onClick={() => setIsChatbotOpen(false)}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {chatHistory.map((msg, i) => {
                const isLast = i === chatHistory.length - 1;
                return (
                  <div
                    key={i}
                    className={`px-4 py-2 rounded-2xl max-w-[80%] break-words ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-200 text-gray-900 mr-auto"
                    }`}
                  >
                    {showTypingDots && msg.role === "assistant" && isLast && !msg.content
                      ? <TypingDots />
                      : msg.content}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none text-sm"
                  placeholder="Type your message..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isAITyping}
                />
                <button
                  onClick={handleSend}
                  disabled={isAITyping}
                  className={`ml-2 text-blue-600 hover:text-blue-800 ${isAITyping ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Typing dots component */
const TypingDots: React.FC = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

/* Reusable stat card */
const StatCard = ({ icon, bg, value, label }: { icon: JSX.Element; bg: string; value: number; label: string }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
    <div className={`p-3 ${bg} rounded-lg`}>{icon}</div>
    <div className="ml-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  </div>
);

/* Empty uploads placeholder */
const EmptyUploads = () => (
  <div className="text-center py-12">
    <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No uploads found</h3>
    <p className="text-gray-500">Try adjusting search criteria or upload something first!</p>
  </div>
);

export default Dashboard;
