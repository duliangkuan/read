'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Book, storage, ChatMessage } from '@/lib/storage';
import { callDeepSeek, buildMessageWithQuote } from '@/lib/deepseek';
import ReadingControls from './ReadingControls';
import TocSelector from './TocSelector';
import NoteButton from './NoteButton';
import { ArrowLeft, Send, BookOpen } from 'lucide-react';

interface ReadingViewProps {
  book: Book;
}

type BackgroundColor = 'yellow' | 'white' | 'black';
type PageMode = 'scroll' | 'flip';
type LayoutDirection = 'normal' | 'reversed';

export default function ReadingView({ book }: ReadingViewProps) {
  const router = useRouter();
  const [aiEnabled, setAiEnabled] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>('yellow');
  const [chatBgColor, setChatBgColor] = useState<BackgroundColor>('white');
  const [pageMode, setPageMode] = useState<PageMode>('scroll');
  const [layoutDirection, setLayoutDirection] = useState<LayoutDirection>('normal');
  const [splitPosition, setSplitPosition] = useState(50);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [qBookEnabled, setQBookEnabled] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showTocSelector, setShowTocSelector] = useState(false);
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const readingRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);

  useEffect(() => {
    const history = storage.getBookChat(book.id);
    setMessages(history);
  }, [book.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTextColor = (bg: BackgroundColor) => {
    return bg === 'black' ? 'text-white' : 'text-black';
  };

  const getBgClass = (bg: BackgroundColor) => {
    switch (bg) {
      case 'yellow': return 'bg-yellow-50';
      case 'white': return 'bg-white';
      case 'black': return 'bg-black';
      default: return 'bg-yellow-50';
    }
  };

  const getCurrentContent = () => {
    if (book.toc.length === 0) return book.content;
    if (currentChapterIndex >= book.toc.length) return '';
    
    const chapter = book.toc[currentChapterIndex];
    return book.content.substring(chapter.startIndex, chapter.endIndex);
  };

  const handleTextSelection = () => {
    if (!qBookEnabled) return;
    
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      // 高亮选中文本
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = '#3b82f6';
      span.style.color = '#ffffff';
      try {
        range.surroundContents(span);
      } catch (e) {
        // 如果无法包围，尝试其他方法
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);
      }
      selection.removeAllRanges();
    }
  };

  const handleChapterSelect = (chapters: number[]) => {
    setSelectedChapters(chapters);
    setShowTocSelector(false);
  };

  const getSelectedChapterContent = () => {
    if (selectedChapters.length === 0) return '';
    return selectedChapters
      .map(index => {
        const chapter = book.toc[index];
        return book.content.substring(chapter.startIndex, chapter.endIndex);
      })
      .join('\n\n');
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    setLoading(true);

    let quoteText = '';
    if (selectedText) {
      quoteText = selectedText;
      setSelectedText('');
    } else if (selectedChapters.length > 0) {
      quoteText = getSelectedChapterContent();
    }

    try {
      const deepSeekMessages = buildMessageWithQuote(question, quoteText);
      const response = await callDeepSeek(deepSeekMessages);

      const message: ChatMessage = {
        id: Date.now().toString(),
        ot: quoteText || undefined,
        q: question,
        a: response,
        timestamp: Date.now(),
      };

      storage.saveChatMessage(book.id, message);
      setMessages([...messages, message]);
    } catch (error: any) {
      console.error('发送消息失败:', error);
      alert('发送失败：' + (error.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const handleSplitDrag = (e: React.MouseEvent) => {
    if (!aiEnabled) return;
    
    isDraggingRef.current = true;
    const startX = e.clientX;
    dragStartRef.current = startX;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const current = e.clientX;
      const container = readingRef.current?.parentElement?.clientWidth || window.innerWidth;
      
      const delta = current - dragStartRef.current;
      const percentage = (delta / container) * 100;
      setSplitPosition(prev => Math.max(10, Math.min(90, prev + percentage)));
      dragStartRef.current = current;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderReadingArea = () => {
    const content = getCurrentContent();
    
    // 上下滑动模式
    if (pageMode === 'scroll') {
      return (
        <div
          ref={readingRef}
          className={`flex-1 overflow-y-auto ${getBgClass(backgroundColor)} ${getTextColor(backgroundColor)}`}
          onMouseUp={handleTextSelection}
          style={{
            userSelect: qBookEnabled ? 'text' : 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="max-w-4xl mx-auto p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // 左右翻页模式
    return (
      <div
        ref={readingRef}
        className={`flex-1 overflow-hidden ${getBgClass(backgroundColor)} ${getTextColor(backgroundColor)}`}
        onMouseUp={handleTextSelection}
        style={{
          userSelect: qBookEnabled ? 'text' : 'none',
        }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="max-w-4xl w-full p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChatArea = () => (
    <div
      ref={chatRef}
      className={`flex-1 flex flex-col ${getBgClass(chatBgColor)} ${getTextColor(chatBgColor)}`}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {msg.ot && (
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg text-sm">
                <div className="font-semibold mb-1">OT（原文引用）：</div>
                <div className="whitespace-pre-wrap">{msg.ot}</div>
              </div>
            )}
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-[80%]">
                {msg.q}
              </div>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg max-w-[80%]">
              {msg.a}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => setQBookEnabled(!qBookEnabled)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              qBookEnabled
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Q-BOOK
          </button>
          <button
            onClick={() => setShowTocSelector(true)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Q-TOC
          </button>
        </div>
        {selectedText && (
          <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded text-sm">
            已选中：{selectedText.substring(0, 50)}...
          </div>
        )}
        {selectedChapters.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded text-sm">
            已选择 {selectedChapters.length} 个章节
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入问题..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '发送中...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderLayout = () => {
    if (!aiEnabled) {
      return renderReadingArea();
    }

    const leftContent = layoutDirection === 'normal' ? renderReadingArea() : renderChatArea();
    const rightContent = layoutDirection === 'normal' ? renderChatArea() : renderReadingArea();
    
    return (
      <div className="flex h-full">
        <div 
          style={{ width: `${splitPosition}%` }} 
          className="flex flex-col h-full min-w-0"
        >
          {leftContent}
        </div>
        <div
          className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors flex-shrink-0"
          onMouseDown={handleSplitDrag}
        />
        <div 
          style={{ width: `${100 - splitPosition}%` }} 
          className="flex flex-col h-full min-w-0"
        >
          {rightContent}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-white dark:bg-gray-800 border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{book.name}</h1>
        </div>
        <ReadingControls
          aiEnabled={aiEnabled}
          onAiToggle={setAiEnabled}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={setBackgroundColor}
          chatBgColor={chatBgColor}
          onChatBgColorChange={setChatBgColor}
          pageMode={pageMode}
          onPageModeChange={setPageMode}
          layoutDirection={layoutDirection}
          onLayoutDirectionChange={setLayoutDirection}
          book={book}
          currentChapterIndex={currentChapterIndex}
          onChapterChange={setCurrentChapterIndex}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-hidden">
        {renderLayout()}
      </div>

      {/* 心得帖按钮 */}
      <NoteButton bookId={book.id} />

      {/* 目录选择器 */}
      {showTocSelector && (
        <TocSelector
          book={book}
          selectedChapters={selectedChapters}
          onSelect={handleChapterSelect}
          onClose={() => setShowTocSelector(false)}
        />
      )}
    </div>
  );
}
