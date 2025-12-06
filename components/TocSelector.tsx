'use client';

import { useState } from 'react';
import { Book } from '@/lib/storage';
import { X, Check } from 'lucide-react';

interface TocSelectorProps {
  book: Book;
  selectedChapters: number[];
  onSelect: (chapters: number[]) => void;
  onClose: () => void;
}

export default function TocSelector({
  book,
  selectedChapters,
  onSelect,
  onClose,
}: TocSelectorProps) {
  const [tempSelected, setTempSelected] = useState<number[]>(selectedChapters);

  const toggleChapter = (index: number) => {
    if (tempSelected.includes(index)) {
      setTempSelected(tempSelected.filter(i => i !== index));
    } else {
      setTempSelected([...tempSelected, index]);
    }
  };

  const handleConfirm = () => {
    onSelect(tempSelected);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">选择章节</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {book.toc.map((chapter, index) => (
              <div
                key={index}
                onClick={() => toggleChapter(index)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  tempSelected.includes(index)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ paddingLeft: `${chapter.level * 20 + 12}px` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{chapter.title}</span>
                  {tempSelected.includes(index) && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            确定 ({tempSelected.length})
          </button>
        </div>
      </div>
    </div>
  );
}

