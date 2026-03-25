import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);

  // 🔥 Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    const userMessage = { type: "user", text: question };

    setMessages((prev) => [...prev, userMessage]);

    try {
    const res = await axios.post("https://fullstack-2-a43n.onrender.com/ask", {
  question,
  history: messages,
});

      if (res.data._status) {
        const aiMessage = {
          type: "ai",
          text: res.data.finalData,
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.log(error);
    }

    setQuestion("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <header className="bg-black text-white text-center py-4 text-xl md:text-2xl font-semibold shadow">
        Gemini AI Chat
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 space-y-4">

        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Start a conversation...
          </p>
        )}


{messages.map((msg, index) => (
  <div
    key={index}
    className={`flex ${
      msg.type === "user" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`px-4 py-3 rounded-2xl max-w-[85%] md:max-w-[60%] text-sm md:text-base shadow ${
        msg.type === "user"
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-800 border"
      }`}
    >
      <ReactMarkdown>
        {msg.text}
      </ReactMarkdown>
    </div>
  </div>
))}

        {/* 👇 Auto scroll target */}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Box (Sticky like ChatGPT) */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t flex gap-2 md:gap-4"
      >
        <textarea
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  placeholder="Ask anything..."
  className="flex-1 resize-none border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-12 md:h-14"

  onKeyDown={(e) => {
    // 🔥 Press Enter → Send message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // stop new line
      handleSubmit(e);
    }
  }}
/>

        <button
          type="submit"
          className="bg-black text-white px-4 md:px-6 rounded-lg hover:bg-gray-800 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;