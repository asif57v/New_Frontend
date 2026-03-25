import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./index.css";

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
      const res = await axios.post(
        "https://fullstack-2-a43n.onrender.com/ask",
        {
          question,
          history: messages,
        }
      );

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
    <div className="app-container">

      {/* Header */}
      <header className="header">
        Gemini AI Chat
      </header>

      {/* Chat Area */}
      <div className="chat-area">

        {messages.length === 0 && (
          <p className="empty-text">
            Start a conversation...
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-row ${
              msg.type === "user" ? "user-row" : "ai-row"
            }`}
          >
            <div
              className={`message-box ${
                msg.type === "user" ? "user-box" : "ai-box"
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Auto scroll */}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="input-area">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything..."
          className="input-box"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
}

export default App;