// DeepSeek API集成

const DEEPSEEK_API_KEY = 'sk-c0ccad5e135c483abee13bf0755eca16';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function callDeepSeek(
  messages: DeepSeekMessage[],
  onStream?: (chunk: string) => void
): Promise<string> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepSeek API错误: ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '抱歉，没有收到回复。';
  } catch (error) {
    console.error('DeepSeek API调用失败:', error);
    throw error;
  }
}

// 构建带引用的消息
export function buildMessageWithQuote(
  userQuestion: string,
  quoteText?: string
): DeepSeekMessage[] {
  const messages: DeepSeekMessage[] = [];
  
  if (quoteText) {
    messages.push({
      role: 'system',
      content: '你是一个专业的阅读助手，帮助用户理解和分析书籍内容。',
    });
    
    messages.push({
      role: 'user',
      content: `以下是书籍原文内容：\n\n${quoteText}\n\n请根据以上内容回答我的问题：${userQuestion}`,
    });
  } else {
    messages.push({
      role: 'user',
      content: userQuestion,
    });
  }
  
  return messages;
}

