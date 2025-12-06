'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, storage } from '@/lib/storage';
import BookShelf from '@/components/BookShelf';
import { Search, BookOpen, Plus } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'shelf' | 'ai'>('shelf');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = () => {
    const allBooks = storage.getBooks();
    setBooks(allBooks);
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">AI辅助阅读</h1>
            <div className="flex items-center gap-4">
              {/* 视图切换 */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('shelf')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentView === 'shelf'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  书架
                </button>
                <button
                  onClick={() => setCurrentView('ai')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    currentView === 'ai'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  AI书记
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'shelf' ? (
          <BookShelf
            books={filteredBooks}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBookClick={(book) => router.push(`/read/${book.id}`)}
            onBooksChange={loadBooks}
          />
        ) : (
          <div>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索书籍..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => router.push(`/ai-chat/${book.id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                >
                  <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {book.name}
                    </h3>
                    <span className="text-blue-600 text-sm font-medium">AI+</span>
                  </div>
                </div>
              ))}
            </div>
            {filteredBooks.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {searchQuery ? '没有找到匹配的书籍' : '还没有AI对话记录，先去书架导入书籍吧'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



