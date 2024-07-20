@echo off
setlocal

set ping_count=5
echo "Checking Server status, and trying to open browser"
ping localhost -n %ping_count% -w 1000 >nul
if %ERRORLEVEL% EQU 0 (
  start http://localhost:5125
  exit
) else (
 
  echo "localhost:5110 is not responding"
  pause
)

