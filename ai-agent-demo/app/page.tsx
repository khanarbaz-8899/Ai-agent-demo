"use client";

import { useState } from "react";

export default function Page() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">AI Agent Demo</h1>

      <div className="w-full max-w-md h-[400px] bg-white p-4 rounded-lg shadow overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 p-2 rounded ${
              msg.role === "user" ? "bg-blue-100 self-end" : "bg-green-100 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-500">AI is typing...</div>}
      </div>

      <div className="flex mt-4 w-full max-w-md">
        <input
          className="flex-1 p-2 border rounded-l"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
      <div className="bg-red-500 text-white p-4">
  Tailwind is working!
</div>
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

    </div>
  );
}
