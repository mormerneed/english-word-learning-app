import React from 'react';

interface WordCardProps {
  english: string;
  chinese: string;
  example?: string;
  mastery: number; // 0-100
  onMark: (status: 'mastered' | 'learning' | 'difficult') => void;
}

export default function WordCard({ english, chinese, example, mastery, onMark }: WordCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all hover:shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600">{english}</h2>
        <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {mastery}% 掌握
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 font-medium">{chinese}</p>
        {example && (
          <p className="text-gray-500 italic mt-2 text-sm">
            例句: {example}
          </p>
        )}
      </div>

      {/* 进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${mastery}%` }}
        ></div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2 mt-4">
        <button
          onClick={() => onMark('difficult')}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          困难
        </button>
        <button
          onClick={() => onMark('learning')}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
        >
          再学习
        </button>
        <button
          onClick={() => onMark('mastered')}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          已掌握
        </button>
        <button
          onClick={() => playAudio(english)}
          className="ml-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          🔊 发音
        </button>
      </div>
    </div>
  );
}

// 使用Web Speech API进行文本朗读
function playAudio(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
} 