@echo off
echo ==============================================
echo  🎯 LOKASCORE Development Server Launcher
echo ==============================================
echo.

echo [1/2] Starting Next.js Web App (Port 3000)...
start "LOKASCORE Web App" cmd /k "cd apps\web && npm run dev"

echo.
echo [2/2] Starting Python FastAPI (Port 8000)...
start "LOKASCORE API" cmd /k "cd apps\api && python -m uvicorn simple_main:app --reload --port 8000"

echo.
echo ✅ Both services are starting...
echo.
echo 🌐 Web App:      http://localhost:3000
echo 🐍 Python API:  http://localhost:8000
echo 📊 Admin Panel: http://localhost:3000/admin/dashboard
echo 📖 API Docs:    http://localhost:8000/docs
echo.
echo Press any key to exit...
pause > nul