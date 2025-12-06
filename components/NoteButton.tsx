'use client';

import { useState, useEffect, useRef } from 'react';
import { storage, BookNote } from '@/lib/storage';
import { exportToTXT } from '@/lib/export';
import { FileText, X, Maximize2, Minimize2 } from 'lucide-react';

interface NoteButtonProps {
  bookId: string;
}

export default function NoteButton({ bookId }: NoteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [note, setNote] = useState<BookNote | null>(null);
  
  // 按钮位置
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isDraggingButton, setIsDraggingButton] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  
  // 浮窗位置和大小
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const [windowSize, setWindowSize] = useState({ width: 500, height: 400 });
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [windowDragOffset, setWindowDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // 加载笔记
  useEffect(() => {
    const savedNote = storage.getBookNote(bookId);
    if (savedNote) {
      setNote(savedNote);
      setContent(savedNote.content);
    }
    
    // 设置按钮默认位置（黄金比例位置）
    if (typeof window !== 'undefined') {
      const defaultX = window.innerWidth * 0.618 - 30;
      const defaultY = window.innerHeight * 0.618 - 30;
      setButtonPosition({ x: defaultX, y: defaultY });
    }
  }, [bookId]);

  // 实时保存
  useEffect(() => {
    if (isOpen && content !== undefined) {
      const timer = setTimeout(() => {
        storage.saveBookNote(bookId, content);
      }, 500); // 防抖，500ms后保存
      return () => clearTimeout(timer);
    }
  }, [content, bookId, isOpen]);

  // 按钮拖拽
  useEffect(() => {
    if (!isDraggingButton) return;

    const handleMouseMove = (e: MouseEvent) => {
      setButtonPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDraggingButton(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingButton, dragOffset]);

  // 浮窗拖拽
  useEffect(() => {
    if (!isDraggingWindow) return;

    const handleMouseMove = (e: MouseEvent) => {
      setWindowPosition({
        x: e.clientX - windowDragOffset.x,
        y: e.clientY - windowDragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDraggingWindow(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingWindow, windowDragOffset]);

  // 浮窗调整大小
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        const newWidth = Math.max(300, e.clientX - rect.left);
        const newHeight = Math.max(200, e.clientY - rect.top);
        setWindowSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDraggingButton(true);
    }
  };

  const handleWindowMouseDown = (e: React.MouseEvent) => {
    if (e.target === resizeRef.current) {
      setIsResizing(true);
      return;
    }
    
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setWindowDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDraggingWindow(true);
    }
  };

  const handleSave = () => {
    storage.saveBookNote(bookId, content);
    alert('保存成功！');
  };

  const handleExport = () => {
    if (window.confirm('确认导出为TXT文件？')) {
      const book = storage.getBook(bookId);
      const fileName = book ? `${book.name}_心得帖` : '心得帖';
      exportToTXT(content, fileName);
    }
  };

  return (
    <>
      {/* 心得帖按钮 */}
      <div
        ref={buttonRef}
        onMouseDown={handleButtonMouseDown}
        onClick={() => !isDraggingButton && setIsOpen(true)}
        style={{
          position: 'fixed',
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`,
          zIndex: 1000,
          cursor: 'move',
        }}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <FileText className="w-6 h-6" />
      </div>

      {/* 心得帖浮窗 */}
      {isOpen && (
        <div
          ref={windowRef}
          onMouseDown={handleWindowMouseDown}
          style={{
            position: 'fixed',
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            width: isMinimized ? 'auto' : `${windowSize.width}px`,
            height: isMinimized ? 'auto' : `${windowSize.height}px`,
            zIndex: 1001,
          }}
          className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg cursor-move">
            <h3 className="font-semibold text-gray-800">心得帖</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* 内容区域 */}
              <div className="flex-1 p-4 overflow-auto">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="记录您的阅读心得..."
                  className="w-full h-full border-none outline-none resize-none text-gray-800"
                  style={{ minHeight: '200px' }}
                />
              </div>

              {/* 底部按钮栏 */}
              <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  保存
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  导出为TXT
                </button>
              </div>

              {/* 调整大小手柄 */}
              <div
                ref={resizeRef}
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '20px',
                  height: '20px',
                  cursor: 'nwse-resize',
                }}
                className="bg-gray-300 hover:bg-gray-400 transition-colors"
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
