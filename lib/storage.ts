// 数据存储工具类

export interface Book {
  id: string;
  name: string;
  cover?: string;
  content: string;
  toc: Chapter[];
  fileType: 'txt' | 'doc' | 'pdf';
  createdAt: number;
}

export interface Chapter {
  title: string;
  level: number;
  startIndex: number;
  endIndex: number;
  children?: Chapter[];
}

export interface ChatMessage {
  id: string;
  ot?: string; // 原文引用
  q: string; // 用户提问
  a: string; // AI回复
  timestamp: number;
}

export interface BookChat {
  bookId: string;
  messages: ChatMessage[];
}

export interface BookNote {
  bookId: string;
  content: string;
  updatedAt: number;
}

class StorageManager {
  private readonly BOOKS_KEY = 'read_ai_books';
  private readonly CHATS_KEY = 'read_ai_chats';
  private readonly NOTES_KEY = 'read_ai_notes';
  private readonly SETTINGS_KEY = 'read_ai_settings';

  // 书籍管理
  getBooks(): Book[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.BOOKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveBook(book: Book): void {
    const books = this.getBooks();
    const index = books.findIndex(b => b.id === book.id);
    if (index >= 0) {
      books[index] = book;
    } else {
      books.push(book);
    }
    localStorage.setItem(this.BOOKS_KEY, JSON.stringify(books));
  }

  deleteBook(bookId: string): void {
    const books = this.getBooks().filter(b => b.id !== bookId);
    localStorage.setItem(this.BOOKS_KEY, JSON.stringify(books));
    // 同时删除相关的聊天记录和笔记
    this.deleteBookChat(bookId);
    this.deleteBookNote(bookId);
  }

  getBook(bookId: string): Book | undefined {
    return this.getBooks().find(b => b.id === bookId);
  }

  // 聊天记录管理
  getBookChat(bookId: string): ChatMessage[] {
    if (typeof window === 'undefined') return [];
    const chats = this.getAllChats();
    return chats.find(c => c.bookId === bookId)?.messages || [];
  }

  getAllChats(): BookChat[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.CHATS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveChatMessage(bookId: string, message: ChatMessage): void {
    const chats = this.getAllChats();
    let bookChat = chats.find(c => c.bookId === bookId);
    
    if (!bookChat) {
      bookChat = { bookId, messages: [] };
      chats.push(bookChat);
    }
    
    bookChat.messages.push(message);
    localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
  }

  deleteBookChat(bookId: string): void {
    const chats = this.getAllChats().filter(c => c.bookId !== bookId);
    localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
  }

  // 笔记管理
  getBookNote(bookId: string): BookNote | null {
    if (typeof window === 'undefined') return null;
    const notes = this.getAllNotes();
    return notes.find(n => n.bookId === bookId) || null;
  }

  getAllNotes(): BookNote[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.NOTES_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveBookNote(bookId: string, content: string): void {
    const notes = this.getAllNotes();
    const index = notes.findIndex(n => n.bookId === bookId);
    const note: BookNote = {
      bookId,
      content,
      updatedAt: Date.now(),
    };
    
    if (index >= 0) {
      notes[index] = note;
    } else {
      notes.push(note);
    }
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
  }

  deleteBookNote(bookId: string): void {
    const notes = this.getAllNotes().filter(n => n.bookId !== bookId);
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
  }

  // 设置管理
  getSettings(): any {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : {};
  }

  saveSettings(settings: any): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}

export const storage = new StorageManager();



