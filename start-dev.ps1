# 开发服务器启动脚本
Write-Host "正在检查依赖..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "依赖未安装，正在安装..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "依赖安装失败！" -ForegroundColor Red
        exit 1
    }
}

Write-Host "正在启动开发服务器..." -ForegroundColor Green
Write-Host "服务器启动后，请在浏览器访问: http://localhost:3000" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Gray
Write-Host ""

npm run dev



