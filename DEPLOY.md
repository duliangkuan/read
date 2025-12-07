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

### 方法二：通过 GitHub（推荐）

#### 步骤 1：上传代码到 GitHub

1. **在 GitHub 上创建新仓库**
   - 访问 https://github.com/new
   - 填写仓库名称（例如：`read-ai`）
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为本地已有代码）
   - 点击 "Create repository"

2. **将本地代码推送到 GitHub**
   
   在项目目录下执行以下命令（替换 `YOUR_USERNAME` 和 `YOUR_REPO_NAME` 为你的实际值）：
   
   ```bash
   # 添加远程仓库（如果还没有添加）
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   
   # 或者使用 SSH（如果你配置了 SSH key）
   # git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   
   # 将代码推送到 GitHub
   git branch -M main
   git push -u origin main
   ```

   如果遇到认证问题，可以使用 GitHub Personal Access Token：
   - 访问 https://github.com/settings/tokens
   - 生成新的 token（需要 `repo` 权限）
   - 使用 token 作为密码进行推送

#### 步骤 2：在 Vercel 上部署

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录（推荐）

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你刚创建的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Next.js（应该自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）
   - **Install Command**: `npm install`（默认）

4. **配置环境变量（如果需要）**
   - 在 "Environment Variables" 部分添加：
     - `DEEPSEEK_API_KEY`: 你的 DeepSeek API 密钥
   - 如果 API 密钥在代码中硬编码，可以跳过此步骤

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（通常需要 1-3 分钟）
   - 部署成功后，Vercel 会提供一个 URL（例如：`https://your-project.vercel.app`）

6. **自动部署**
   - 之后每次推送到 GitHub 的 `main` 分支，Vercel 会自动重新部署
   - 你可以在 Vercel 仪表板查看部署历史和状态

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



