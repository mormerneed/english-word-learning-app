import ChatBox from "../../components/ChatBox";

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">AI 对话</h1>
      <p className="mb-4">在这里你可以与 AI 进行对话，练习英语口语。</p>
      
      {/* AI 聊天框 */}
      <ChatBox />

      {/* 返回首页按钮 */}
      <div className="mt-4">
        <a href="/" className="px-4 py-2 bg-gray-500 text-white rounded">返回首页</a>
      </div>
    </div>
  );
}