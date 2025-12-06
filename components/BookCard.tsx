'use client';

import { Book } from '@/lib/storage';
import { BookOpen, Trash2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick: () => void;
  onDelete: () => void;
}

export default function BookCard({ book, onClick, onDelete }: BookCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden relative group"
    >
      <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center relative">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen className="w-16 h-16 text-gray-400" />
        )}
        {/* 删除按钮 */}
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{book.name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(book.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
