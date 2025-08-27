@echo off
echo ==============================================
echo  🐍 LOKASCORE Python FastAPI
echo ==============================================
echo.
echo Starting Python FastAPI server...
echo.
cd apps\api
python -m uvicorn simple_main:app --reload --port 8000
echo.
pause