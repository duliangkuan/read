'use client';

import { Book } from '@/lib/storage';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useState } from 'react';

type BackgroundColor = 'yellow' | 'white' | 'black';
type PageMode = 'scroll' | 'flip';
type LayoutDirection = 'normal' | 'reversed';

interface ReadingControlsProps {
  aiEnabled: boolean;
  onAiToggle: (value: boolean) => void;
  backgroundColor: BackgroundColor;
  onBackgroundColorChange: (value: BackgroundColor) => void;
  chatBgColor: BackgroundColor;
  onChatBgColorChange: (value: BackgroundColor) => void;
  pageMode: PageMode;
  onPageModeChange: (value: PageMode) => void;
  layoutDirection: LayoutDirection;
  onLayoutDirectionChange: (value: LayoutDirection) => void;
  book: Book;
  currentChapterIndex: number;
  onChapterChange: (value: number) => void;
}

export default function ReadingControls({
  aiEnabled,
  onAiToggle,
  backgroundColor,
  onBackgroundColorChange,
  chatBgColor,
  onChatBgColorChange,
  pageMode,
  onPageModeChange,
  layoutDirection,
  onLayoutDirectionChange,
  book,
  currentChapterIndex,
  onChapterChange,
}: ReadingControlsProps) {
  const [showSettings, setShowSettings] = useState(false);

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      onChapterChange(currentChapterIndex - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < book.toc.length - 1) {
      onChapterChange(currentChapterIndex + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* 章节导航 */}
      {book.toc.length > 0 && (
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <button
            onClick={handlePrevChapter}
            disabled={currentChapterIndex === 0}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="上一章"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm px-2 min-w-[100px] text-center">
            {book.toc[currentChapterIndex]?.title || '无章节'}
          </span>
          <button
            onClick={handleNextChapter}
            disabled={currentChapterIndex >= book.toc.length - 1}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="下一章"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* AI 开关 */}
      <button
        onClick={() => onAiToggle(!aiEnabled)}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          aiEnabled
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        AI 助手
      </button>

      {/* 设置按钮 */}
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="设置"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* 设置面板 */}
        {showSettings && (
          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[280px] z-50">
            <div className="space-y-4">
              {/* 翻页模式 */}
              <div>
                <label className="block text-sm font-medium mb-2">翻页方式</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => onPageModeChange('scroll')}
                    className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                      pageMode === 'scroll'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    上下滑动
                  </button>
                  <button
                    onClick={() => onPageModeChange('flip')}
                    className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                      pageMode === 'flip'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    左右翻页
                  </button>
                </div>
              </div>

              {/* 阅读背景颜色 */}
              <div>
                <label className="block text-sm font-medium mb-2">阅读背景</label>
                <div className="flex gap-2">
                  {(['yellow', 'white', 'black'] as BackgroundColor[]).map((color) => (
                    <button
                      key={color}
                      onClick={() => onBackgroundColorChange(color)}
                      className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                        backgroundColor === color
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {color === 'yellow' ? '明黄色' : color === 'white' ? '白色' : '漆黑色'}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI 布局设置 */}
              {aiEnabled && (
                <>
                  {/* 布局方向 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">布局方向</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onLayoutDirectionChange('normal')}
                        className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                          layoutDirection === 'normal'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        阅读-对话
                      </button>
                      <button
                        onClick={() => onLayoutDirectionChange('reversed')}
                        className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                          layoutDirection === 'reversed'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        对话-阅读
                      </button>
                    </div>
                  </div>

                  {/* 对话背景颜色 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">对话背景</label>
                    <div className="flex gap-2">
                      {(['yellow', 'white', 'black'] as BackgroundColor[]).map((color) => (
                        <button
                          key={color}
                          onClick={() => onChatBgColorChange(color)}
                          className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                            chatBgColor === color
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {color === 'yellow' ? '明黄色' : color === 'white' ? '白色' : '漆黑色'}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
