@echo off
TITLE How Cooked Am I? - Dev Server
color 0B

echo ===================================================
echo     STARTING: HOW COOKED AM I? DIAGNOSTIC SCANNER
echo ===================================================
echo.

cd /d "%~dp0"

IF NOT EXIST "node_modules\" (
    echo [SYS] First run detected. Installing dependencies...
    call npm install
    echo [SYS] Dependencies installed successfully.
    echo.
)

echo [SYS] Initializing development server...
echo [SYS] A browser window should open automatically.
echo.

call npm run dev -- --open

pause
