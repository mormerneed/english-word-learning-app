"use client";
import { useState, useEffect } from "react";
import vocabularyData from "./../../vocabulary.json"; // 导入JSON文件

export default function ChatBox() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("Travel");
  const [vocabulary, setVocabulary] = useState<{ [key: string]: string[] }>({});
  const [topics, setTopics] = useState<string[]>([]); // 用来存储主题列表

  useEffect(() => {
    // 从文件中加载词汇表，并提取主题
    setVocabulary(vocabularyData);
    setTopics(Object.keys(vocabularyData)); // 获取主题
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          topic,
          words: vocabulary[topic],
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.reply.content }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", content: "发生了错误。" }]);
    }

    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg flex flex-col space-y-4">
      {/* 主题选择 */}
      <div className="flex justify-between items-center">
        <label className="text-gray-700 font-semibold">选择主题：</label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="p-2 border rounded-md focus:ring focus:ring-indigo-300"
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* 消息列表 */}
      <div className="h-64 overflow-y-auto p-3 bg-gray-50 rounded-md space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end text-right"
                : "bg-gray-200 text-gray-900 self-start text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* 输入框 & 按钮 */}
      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:ring focus:ring-indigo-300"
          placeholder="输入你的消息..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
        >
          发送
        </button>
      </div>
    </div>
  );
}
