# تشغيل Backend و Frontend

Write-Host "🚀 Starting Backend Server on port 5001..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "cd 'c:\Users\admin\Downloads\tradnig\backend'; node mock-server.js" -NoNewWindow

Start-Sleep -Seconds 3

Write-Host "🌐 Starting Frontend Server on port 3001..." -ForegroundColor Green
Start-Process PowerShell -ArgumentList "cd 'c:\Users\admin\Downloads\tradnig\website'; npm run dev" -NoNewWindow

Write-Host "✅ Both servers are starting..." -ForegroundColor Yellow
Write-Host "📍 Backend: http://localhost:5001" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:3001" -ForegroundColor Cyan
