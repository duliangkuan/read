# 部署指南

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问 http://localhost:3000

## Vercel 部署

### 方法一：通过 Vercel CLI

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

3. 部署：
```bash
vercel
```

### 方法二：通过 GitHub

1. 将代码推送到 GitHub 仓库

2. 在 Vercel 官网 (https://vercel.com) 登录

3. 点击 "New Project"

4. 导入你的 GitHub 仓库

5. 配置环境变量（如果需要）：
   - `DEEPSEEK_API_KEY`: DeepSeek API密钥

6. 点击 "Deploy"

### 环境变量

如果需要使用环境变量管理 API 密钥，在 Vercel 项目设置中添加：
- `DEEPSEEK_API_KEY`: sk-c0ccad5e135c483abee13bf0755eca16

## 功能说明

### 已实现功能

✅ 书架页面
- 书籍导入（txt, word, pdf）
- 书籍搜索
- 自定义书名和封面

✅ 阅读页面
- 三种背景色（明黄色、白色、漆黑色）
- 两种翻页方式（上下滑动、左右翻页）
- AI辅助阅读功能

✅ AI辅助阅读
- 三种布局模式（左右双栏、上下栏）
- Q-BOOK功能（选中文本引用）
- Q-TOC功能（章节引用）
- 可拖动分界线调整布局

✅ AI书记页面
- 查看对话记录
- 导出为Excel
- 导出为PDF
- 继续对话

✅ 心得帖功能
- 可拖动按钮
- 可调整大小浮窗
- 实时保存
- 导出为TXT

## 注意事项

1. 数据存储：目前使用 localStorage，数据仅存储在本地浏览器
2. 文件大小：大文件（>10MB）可能影响性能
3. PDF解析：复杂PDF可能需要较长时间解析

## 故障排除

### 导入失败
- 检查文件格式是否支持
- 检查文件大小是否过大
- 查看浏览器控制台错误信息

### AI对话失败
- 检查网络连接
- 检查API密钥是否正确
- 查看浏览器控制台错误信息

### 样式问题
- 清除浏览器缓存
- 检查 Tailwind CSS 是否正确加载



