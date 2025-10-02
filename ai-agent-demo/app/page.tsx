"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Load chat history on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Save messages and username to localStorage
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }, [messages, userName]);

  const sendMessage = async () => {
    if (!input || loading) return;

    // Detect if user is telling their name
    const nameRegex = /i am (\w+)/i;
    const match = input.match(nameRegex);
    if (match) {
      setUserName(match[1]);
    }

    // Intercept "What is my name?" question
    if (/what is my new  name/i.test(input)) {
      const replyText = userName
        ? `Your name is ${userName}.`
        : "I'm sorry, I do not know your name.";

      const aiMessage = { role: "ai", text: replyText };
      setMessages((prev) => [...prev, aiMessage]);
      setInput("");
      return;
    }

    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      const aiMessage = { role: "ai", text: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const aiMessage = { role: "ai", text: "Error: Failed to get response" };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // Clear chat and localStorage
  const newChat = () => {
    setMessages([]);
    setInput("");
    localStorage.removeItem("chatHistory");
    // Optionally keep userName: comment this line if you want to reset name
    // localStorage.removeItem("userName");
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">AI Agent Demo</h1>
        <button
          onClick={newChat}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all text-sm"
        >
          New Chat
        </button>
      </div>

      <div className="flex-1 w-full bg-white p-4 rounded-2xl shadow-lg overflow-y-auto border">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 p-3 max-w-[80%] text-sm rounded-xl ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto rounded-br-none"
                : "bg-gray-200 text-gray-800 self-start rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-sm italic">AI is typing...</div>
        )}
      </div>

      <div className="flex mt-4 w-full">
        <input
          className="flex-1 p-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-r-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Wait..." : "Send"}
        </button>
      </div>
    </div>
  );
}
