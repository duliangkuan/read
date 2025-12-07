// 导出功能

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { ChatMessage } from './storage';

// 导出为Excel
export function exportToExcel(messages: ChatMessage[], bookName: string) {
  const data = messages.map(msg => ({
    OT: msg.ot || '',
    Q: msg.q,
    A: msg.a,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '对话记录');
  
  const fileName = `${bookName}_对话记录_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// 导出为PDF
export function exportToPDF(messages: ChatMessage[], bookName: string) {
  const doc = new jsPDF();
  let y = 20;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;
  const maxWidth = doc.internal.pageSize.width - 2 * margin;

  doc.setFontSize(16);
  doc.text(bookName + ' - AI对话记录', margin, y);
  y += 15;

  messages.forEach((msg, index) => {
    // 检查是否需要新页面
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`对话 ${index + 1}`, margin, y);
    y += 8;

    // 原文引用
    if (msg.ot) {
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 255);
      doc.text('OT（原文引用）：', margin, y);
      y += 6;
      
      doc.setTextColor(0, 0, 0);
      const otLines = doc.splitTextToSize(msg.ot, maxWidth);
      otLines.forEach((line: string) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      y += 3;
    }

    // 用户提问
    doc.setFontSize(10);
    doc.setTextColor(0, 100, 0);
    doc.text('Q（用户提问）：', margin, y);
    y += 6;
    
    doc.setTextColor(0, 0, 0);
    const qLines = doc.splitTextToSize(msg.q, maxWidth);
    qLines.forEach((line: string) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    y += 3;

    // AI回复
    doc.setFontSize(10);
    doc.setTextColor(150, 0, 0);
    doc.text('A（AI回复）：', margin, y);
    y += 6;
    
    doc.setTextColor(0, 0, 0);
    const aLines = doc.splitTextToSize(msg.a, maxWidth);
    aLines.forEach((line: string) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    y += 10;
  });

  const fileName = `${bookName}_对话记录_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

// 导出为TXT
export function exportToTXT(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const fullFileName = `${fileName}_${new Date().toISOString().split('T')[0]}.txt`;
  saveAs(blob, fullFileName);
}




