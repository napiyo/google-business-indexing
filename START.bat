start temp1.bat
call npm start
IF ERRORLEVEL 1 GOTO Error
goto SUCCESS

:Error
echo.
echo ******************************** FAILED **********************************
echo opps.. something went wrong.
echo please try to run INSTALL_AND_BUILD.bat
echo if still getting Error contact to developer: radioactivenaredra@gmail.com
echo.



:SUCCESS
pause
