'use client';

import { useState } from 'react';
import { Book, storage } from '@/lib/storage';
import { parseBook } from '@/lib/fileParser';
import BookCard from './BookCard';
import ImportBookModal from './ImportBookModal';
import { Search, Plus } from 'lucide-react';

interface BookShelfProps {
  books: Book[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBookClick: (book: Book) => void;
  onBooksChange: () => void;
}

export default function BookShelf({
  books,
  searchQuery,
  onSearchChange,
  onBookClick,
  onBooksChange,
}: BookShelfProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleImport = async (file: File, name: string, cover?: string) => {
    setImporting(true);
    try {
      const { content, toc } = await parseBook(file);
      const fileType = file.name.endsWith('.pdf') ? 'pdf' : 
                      file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc' : 'txt';
      
      const book: Book = {
        id: Date.now().toString(),
        name: name || file.name.replace(/\.[^/.]+$/, ''),
        cover,
        content,
        toc,
        fileType,
        createdAt: Date.now(),
      };

      storage.saveBook(book);
      onBooksChange();
      setShowImportModal(false);
    } catch (error: any) {
      console.error('导入失败:', error);
      alert('导入失败：' + (error.message || '未知错误'));
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('确认删除这本书？')) {
      storage.deleteBook(bookId);
      onBooksChange();
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索书籍..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            导入书籍
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => onBookClick(book)}
            onDelete={() => handleDeleteBook(book.id)}
          />
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {searchQuery ? '没有找到匹配的书籍' : '还没有书籍，点击"导入书籍"开始吧'}
        </div>
      )}

      {showImportModal && (
        <ImportBookModal
          onImport={handleImport}
          onClose={() => setShowImportModal(false)}
          importing={importing}
        />
      )}
    </>
  );
}
