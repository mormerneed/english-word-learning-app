"use client";

import React, { useState, useEffect } from 'react';
import WordCard from '@/components/WordCard';
import { useRouter } from 'next/navigation';

interface Word {
  id: number;
  english: string;
  chinese: string;
  example: string | null;
  status: string;
  mastery: number;
  nextReview: string;
}

export default function Review() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 获取token
  useEffect(() => {
    // 确保在客户端环境中
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        router.push('/login');
      } else {
        setToken(storedToken);
      }
    }
  }, [router]);

  // 获取单词列表
  useEffect(() => {
    if (!token) return;

    async function fetchWords() {
      try {
        setLoading(true);
        const response = await fetch(`/api/words?status=${filter}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('获取单词失败');
        }

        const data = await response.json();
        setWords(data);
        setFilteredWords(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('未知错误');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWords();
  }, [token, filter, router]);

  // 更新单词状态
  const handleMarkWord = async (wordId: number, status: 'mastered' | 'learning' | 'difficult') => {
    if (!token) return;

    try {
      const response = await fetch(`/api/words/${wordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('更新单词状态失败');
      }

      // 更新本地状态
      setWords(prevWords => prevWords.map(word => {
        if (word.id === wordId) {
          return {
            ...word,
            status,
            mastery: status === 'mastered' ? 100 : status === 'learning' ? 50 : 25
          };
        }
        return word;
      }));

      // 如果当前有筛选，也要更新筛选后的列表
      setFilteredWords(prevWords => prevWords.map(word => {
        if (word.id === wordId) {
          return {
            ...word,
            status,
            mastery: status === 'mastered' ? 100 : status === 'learning' ? 50 : 25
          };
        }
        return word;
      }));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('未知错误');
      }
    }
  };

  // 处理筛选
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">单词复习</h1>
        <a href="/" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          返回首页
        </a>
      </div>

      {/* 筛选器 */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('all')}
          >
            全部单词
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'learning' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('learning')}
          >
            学习中
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'mastered' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('mastered')}
          >
            已掌握
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'difficult' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('difficult')}
          >
            困难
          </button>
        </div>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      )}

      {/* 没有单词时 */}
      {!loading && filteredWords.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-600">当前没有{filter === 'all' ? '' : filter === 'mastered' ? '已掌握的' : filter === 'learning' ? '学习中的' : '困难的'}单词</p>
        </div>
      )}

      {/* 单词列表 */}
      <div className="space-y-6">
        {filteredWords.map(word => (
          <WordCard
            key={word.id}
            english={word.english}
            chinese={word.chinese}
            example={word.example || undefined}
            mastery={word.mastery}
            onMark={(status) => handleMarkWord(word.id, status)}
          />
        ))}
      </div>
    </div>
  );
}
  