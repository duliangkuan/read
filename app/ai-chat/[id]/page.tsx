'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Book, storage, ChatMessage } from '@/lib/storage';
import { callDeepSeek } from '@/lib/deepseek';
import { exportToExcel, exportToPDF, exportToTXT } from '@/lib/export';
import { Send, Download, FileText, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import NoteButton from '@/components/NoteButton';

export default function AIChatPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bookData = storage.getBook(bookId);
    if (bookData) {
      setBook(bookData);
      const history = storage.getBookChat(bookId);
      setMessages(history);
    } else {
      router.push('/');
    }
  }, [bookId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuestion = input.trim();
    setLoading(true);

    try {
      const aiResponse = await callDeepSeek([{ role: 'user', content: userQuestion }]);

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        q: userQuestion,
        a: aiResponse,
        timestamp: Date.now(),
      };

      storage.saveChatMessage(bookId, newMessage);
      setMessages([...messages, newMessage]);
      setInput('');
    } catch (error: any) {
      console.error('发送消息失败:', error);
      alert('发送失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExportExcel = () => {
    if (window.confirm('确认导出为Excel文件？')) {
      exportToExcel(messages, book?.name || '对话记录');
    }
  };

  const handleExportPDF = () => {
    if (window.confirm('确认导出为PDF文件？')) {
      exportToPDF(messages, book?.name || '对话记录');
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">{book.name} - AI对话记录</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                导出为Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                导出为PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div
          ref={chatContainerRef}
          className="space-y-6 mb-24"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
              <p className="text-lg">还没有对话记录</p>
              <p className="text-sm mt-2">开始与AI对话吧</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {/* 原文引用 */}
              {msg.ot && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <div className="font-semibold text-blue-700 mb-2">OT（原文引用）：</div>
                  <div className="text-gray-800 whitespace-pre-wrap">{msg.ot}</div>
                </div>
              )}

              {/* 用户提问 */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg px-6 py-3 max-w-[70%]">
                  <div className="font-semibold mb-1 text-xs opacity-90">Q（用户提问）：</div>
                  <div className="whitespace-pre-wrap">{msg.q}</div>
                </div>
              </div>

              {/* AI回复 */}
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-6 py-3 max-w-[70%] shadow-sm">
                  <div className="font-semibold mb-1 text-xs text-gray-500">A（AI回复）：</div>
                  <div className="text-gray-800 whitespace-pre-wrap">{msg.a}</div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入框 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 心得帖按钮 */}
      <NoteButton bookId={bookId} />
    </div>
  );
}




