@echo off
call npm run buildApp
IF ERRORLEVEL 1 GOTO Error
echo ******************************** INSTALLED **********************************
echo Installation Completed, Starting Server now
start temp1.bat
call npm run start
IF ERRORLEVEL 1 GOTO Error
goto SUCCESS

:Error
echo.
echo ******************************** FAILED **********************************
echo opps.. something went wrong.
echo please try to again.
echo if still getting Error contact to developer: radioactivenaredra@gmail.com
echo.


:SUCCESS
pause