// 文件解析工具

import mammoth from 'mammoth';

export interface ParsedBook {
  content: string;
  toc: Chapter[];
}

export interface Chapter {
  title: string;
  level: number;
  startIndex: number;
  endIndex: number;
  children?: Chapter[];
}

// 解析TXT文件
export async function parseTxt(file: File): Promise<ParsedBook> {
  const text = await file.text();
  const toc = extractTocFromText(text);
  return { content: text, toc };
}

// 解析Word文件
export async function parseDocx(file: File): Promise<ParsedBook> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;
  const toc = extractTocFromText(text);
  return { content: text, toc };
}

// 解析PDF文件
export async function parsePdf(file: File): Promise<ParsedBook> {
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  const toc = extractTocFromText(fullText);
  return { content: fullText, toc };
}

// 从文本中提取目录
function extractTocFromText(text: string): Chapter[] {
  const lines = text.split('\n');
  const toc: Chapter[] = [];
  let currentIndex = 0;
  
  // 简单的目录提取逻辑：识别标题行（通常较短，且可能包含数字编号）
  const titlePatterns = [
    /^第[一二三四五六七八九十\d]+章\s+.+$/,
    /^第[一二三四五六七八九十\d]+节\s+.+$/,
    /^\d+\.\d*\s+.+$/,
    /^[一二三四五六七八九十]+、.+$/,
  ];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) return;
    
    // 检查是否是标题
    const isTitle = titlePatterns.some(pattern => pattern.test(trimmedLine)) ||
                   (trimmedLine.length < 50 && trimmedLine.length > 2 && 
                    (trimmedLine.includes('章') || trimmedLine.includes('节') || 
                     /^\d+[\.、]/.test(trimmedLine)));
    
    if (isTitle) {
      const startIndex = currentIndex;
      const endIndex = currentIndex + line.length;
      
      // 判断层级（简单判断）
      let level = 1;
      if (trimmedLine.includes('章')) level = 1;
      else if (trimmedLine.includes('节')) level = 2;
      else if (/^\d+\./.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+)\./);
        if (match) {
          const num = match[1];
          level = num.split('.').length;
        }
      }
      
      toc.push({
        title: trimmedLine,
        level,
        startIndex,
        endIndex,
      });
    }
    
    currentIndex += line.length + 1; // +1 for newline
  });
  
  // 如果没有找到目录，创建一个默认章节
  if (toc.length === 0) {
    toc.push({
      title: '全文',
      level: 1,
      startIndex: 0,
      endIndex: text.length,
    });
  } else {
    // 更新每个章节的endIndex为下一个章节的startIndex
    for (let i = 0; i < toc.length - 1; i++) {
      toc[i].endIndex = toc[i + 1].startIndex;
    }
    toc[toc.length - 1].endIndex = text.length;
  }
  
  return toc;
}

// 根据文件类型选择解析器
export async function parseBook(file: File): Promise<ParsedBook> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.txt')) {
    return parseTxt(file);
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return parseDocx(file);
  } else if (fileName.endsWith('.pdf')) {
    return parsePdf(file);
  } else {
    throw new Error('不支持的文件格式');
  }
}



