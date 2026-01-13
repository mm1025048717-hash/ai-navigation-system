# 🔧 故障排查指南

## 常见错误及解决方案

### 1. **端口占用错误**

**错误信息：**
```
Port 3000 is in use by an unknown process
```

**解决方案：**
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 终止进程（替换 PID 为实际进程ID）
taskkill /PID <PID> /F

# 或使用备用端口
npm run dev:alt
```

### 2. **锁文件错误**

**错误信息：**
```
Unable to acquire lock at .next/dev/lock, is another instance of next dev running?
```

**解决方案：**
```powershell
# 1. 终止所有 Node.js 进程
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# 2. 清理 .next 目录
Remove-Item -Recurse -Force .next

# 3. 重新启动
npm run dev
```

### 3. **环境变量错误（PowerShell）**

**错误信息：**
```
CommandNotFoundException: DEEPSEEK_API_KEY=sk-xxx
```

**原因：** PowerShell 不支持 `KEY=value` 语法

**解决方案：**

**方法 1：使用 .env.local 文件（推荐）**
```powershell
# 确保 .env.local 文件存在且格式正确
DEEPSEEK_API_KEY=sk-your-key-here
```

**方法 2：在 PowerShell 中设置环境变量**
```powershell
$env:DEEPSEEK_API_KEY="sk-your-key-here"
npm run dev
```

**方法 3：使用 cross-env（跨平台）**
```powershell
npm install --save-dev cross-env
```

然后修改 `package.json`：
```json
{
  "scripts": {
    "dev": "cross-env DEEPSEEK_API_KEY=sk-your-key-here next dev"
  }
}
```

### 4. **工作区根目录警告**

**错误信息：**
```
Next.js inferred your workspace root, but it may not be correct.
Detected multiple lockfiles
```

**解决方案：**

已在 `next.config.ts` 中配置，如果仍有警告：

1. 检查是否有多个 `package-lock.json` 文件
2. 删除不需要的 lockfile
3. 确保在正确的项目目录运行命令

### 5. **快速修复脚本**

创建 `fix.ps1`：
```powershell
# 终止所有 Node 进程
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# 清理构建文件
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
if (Test-Path node_modules\.cache) { Remove-Item -Recurse -Force node_modules\.cache }

# 检查环境变量
if (-not (Test-Path .env.local)) {
    Write-Host "警告: .env.local 文件不存在" -ForegroundColor Yellow
}

# 重新安装依赖（可选）
# npm install

Write-Host "修复完成！现在可以运行 npm run dev" -ForegroundColor Green
```

运行：
```powershell
.\fix.ps1
```

## 开发环境检查清单

- [ ] Node.js 版本 >= 18
- [ ] `.env.local` 文件存在且包含 `DEEPSEEK_API_KEY`
- [ ] 端口 3000 未被占用
- [ ] 没有其他 `next dev` 实例运行
- [ ] `.next` 目录可以正常创建

## 获取帮助

如果问题仍然存在：
1. 检查浏览器控制台（F12）的错误信息
2. 查看终端完整错误日志
3. 确认 `.env.local` 文件格式正确
4. 尝试清理并重新安装依赖：`rm -rf node_modules .next && npm install`
