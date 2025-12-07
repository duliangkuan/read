# GitHub 上传快速指南

## 前提条件

✅ Git 仓库已初始化（已完成）
✅ 初始提交已创建（已完成）

## 上传步骤

### 1. 在 GitHub 上创建新仓库

1. 访问 https://github.com/new
2. 填写仓库名称（例如：`read-ai`）
3. 选择 Public 或 Private
4. **重要**：不要勾选任何初始化选项（README、.gitignore、license）
5. 点击 "Create repository"

### 2. 连接本地仓库到 GitHub

在项目目录下执行（替换为你的实际仓库地址）：

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 或者使用 SSH（如果已配置 SSH key）
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 3. 推送代码到 GitHub

```bash
# 确保分支名为 main
git branch -M main

# 推送代码
git push -u origin main
```

### 4. 如果遇到认证问题

如果提示需要用户名和密码：

1. **使用 Personal Access Token**（推荐）：
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写 Note（例如：`read-ai-deploy`）
   - 选择过期时间
   - 勾选 `repo` 权限
   - 点击 "Generate token"
   - 复制生成的 token（只显示一次，请保存好）
   - 推送时，用户名输入你的 GitHub 用户名，密码输入 token

2. **或者使用 GitHub CLI**：
   ```bash
   # 安装 GitHub CLI（如果还没有）
   # Windows: winget install GitHub.cli
   
   # 登录
   gh auth login
   
   # 创建仓库并推送
   gh repo create read-ai --public --source=. --remote=origin --push
   ```

## 验证上传

上传成功后，访问你的 GitHub 仓库页面，应该能看到所有项目文件。

## 下一步：部署到 Vercel

参考 `DEPLOY.md` 文件中的 "方法二：通过 GitHub" 部分。


