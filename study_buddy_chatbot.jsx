import { useState, useRef, useEffect } from "react";
import { Send, BookOpen, Sparkles } from "lucide-react";

const SUBJECTS = ["Math", "Physics", "CS/Programming", "Biology", "General"];

export default function StudyBuddy() {
  const [subject, setSubject] = useState("General");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Study Buddy. Ask me to explain a concept, walk through a problem, or quiz you on something you're learning.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt = `You are Study Buddy, a friendly, encouraging study assistant helping a student with ${subject}. Explain concepts clearly with short examples. Keep answers focused and not too long. If asked to quiz the student, ask one question at a time and wait for their answer.`;

      const apiMessages = nextMessages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const textBlocks = (data.content || []).filter((c) => c.type === "text").map((c) => c.text);
      const reply = textBlocks.join("\n").trim() || "Sorry, I couldn't generate a response just now.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong reaching the tutor. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-[#F3F1EC] p-4">
      <div className="w-full max-w-md h-[640px] bg-[#FFFFFF] rounded-2xl shadow-xl flex flex-col overflow-hidden border border-[#E3DFD3]">
        {/* Header */}
        <div className="bg-[#1F3B2C] px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C7962B] flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} className="text-[#1F3B2C]" />
          </div>
          <div className="flex-1">
            <h1 className="text-[#F3F1EC] font-serif text-lg leading-tight">Study Buddy</h1>
            <p className="text-[#B9C4B5] text-xs">Powered by Claude</p>
          </div>
          <Sparkles size={16} className="text-[#C7962B]" />
        </div>

        {/* Subject selector */}
        <div className="px-4 py-2 bg-[#FAF8F3] border-b border-[#E3DFD3] flex gap-2 overflow-x-auto">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap border transition-colors ${
                subject === s
                  ? "bg-[#1F3B2C] text-[#F3F1EC] border-[#1F3B2C]"
                  : "bg-white text-[#4A4A42] border-[#E3DFD3] hover:border-[#C7962B]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAF8F3]">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${
                  m.role === "user"
                    ? "bg-[#1F3B2C] text-[#F3F1EC] rounded-br-sm"
                    : "bg-white text-[#2E2E28] border border-[#E3DFD3] rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#E3DFD3] rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7962B] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7962B] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C7962B] animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-3 py-3 bg-white border-t border-[#E3DFD3] flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${subject.toLowerCase()}...`}
            rows={1}
            className="flex-1 resize-none text-sm px-3 py-2 rounded-xl border border-[#E3DFD3] focus:outline-none focus:border-[#1F3B2C] max-h-24"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-9 h-9 flex-shrink-0 rounded-full bg-[#1F3B2C] text-[#F3F1EC] flex items-center justify-center disabled:opacity-40 hover:bg-[#16291F] transition-colors"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
