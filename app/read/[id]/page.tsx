'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Book, storage } from '@/lib/storage';
import ReadingView from '@/components/ReadingView';
import { ArrowLeft } from 'lucide-react';

export default function ReadPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const bookData = storage.getBook(bookId);
    if (bookData) {
      setBook(bookData);
    } else {
      router.push('/');
    }
  }, [bookId, router]);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ReadingView book={book} />
    </div>
  );
}



