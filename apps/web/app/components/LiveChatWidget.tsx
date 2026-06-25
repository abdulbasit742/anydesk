"use client";
import { MessageSquare, Minimize2, Paperclip, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  sender: "visitor" | "agent" | "bot";
  senderName: string;
  content: string;
  time: string;
}

interface WidgetConfig {
  primaryColor: string;
  title: string;
  subtitle: string;
  welcomeMessage: string;
  position: "bottom-right" | "bottom-left";
  borderRadius: number;
}

const defaultConfig: WidgetConfig = {
  primaryColor: "#2563eb",
  title: "Support Chat",
  subtitle: "We typically reply within minutes",
  welcomeMessage: "Hi there! 👋 How can we help you today?",
  position: "bottom-right",
  borderRadius: 12,
};

export function LiveChatWidget({ config = defaultConfig }: { config?: WidgetConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", sender: "bot", senderName: "Support Bot", content: config.welcomeMessage, time: "Just now" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [preChatDone, setPreChatDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "visitor",
      senderName: name || "You",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");

    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "agent",
          senderName: "Sarah",
          content: "Thanks for reaching out! Let me look into that for you. One moment please...",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 2000);
  };

  const handlePreChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) setPreChatDone(true);
  };

  const positionClass = config.position === "bottom-left" ? "left-4" : "right-4";

  return (
    <div className={`fixed bottom-4 ${positionClass} z-50`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 shadow-2xl border border-slate-200 bg-white overflow-hidden" style={{ borderRadius: `${config.borderRadius}px` }}>
          {/* Header */}
          <div className="p-4 flex items-center justify-between" style={{ backgroundColor: config.primaryColor }}>
            <div>
              <h3 className="text-white font-semibold text-sm">{config.title}</h3>
              <p className="text-white/80 text-xs mt-0.5">{config.subtitle}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pre-chat form */}
          {!preChatDone ? (
            <form onSubmit={handlePreChat} className="p-4 space-y-3">
              <p className="text-sm text-slate-600">Please provide your details to start chatting:</p>
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="w-full py-2 text-white rounded-lg text-sm font-medium" style={{ backgroundColor: config.primaryColor }}>
                Start Chat
              </button>
            </form>
          ) : (
            <>
              {/* Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "visitor" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === "visitor" ? "text-white" : "bg-slate-100 text-slate-700"}`} style={msg.sender === "visitor" ? { backgroundColor: config.primaryColor } : undefined}>
                      {msg.sender !== "visitor" && <p className="text-xs font-medium text-slate-500 mb-1">{msg.senderName}</p>}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === "visitor" ? "text-white/70" : "text-slate-400"}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-200 p-3">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 px-3 py-2 bg-slate-50 rounded-lg text-sm border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button onClick={sendMessage} className="p-2 rounded-lg text-white" style={{ backgroundColor: config.primaryColor }}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Launcher Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105" style={{ backgroundColor: config.primaryColor }}>
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}
