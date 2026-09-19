@echo off
:: ================================================================
::  GTOOL INSTALLER v2.0.0
::  Abdul Basit Dev Toolkit - System-Wide Installer
::  Run as Administrator for best results
:: ================================================================

echo.
echo  =================================================
echo   GTOOL v2.0.0 - Installer
echo   Abdul Basit Dev Toolkit
echo  =================================================
echo.

:: Detect admin
net session >nul 2>&1
if errorlevel 1 (
    echo  [WARN] Not running as Administrator.
    echo  [>>]   Will install to user-level PATH only.
    echo.
)

:: Set install path
set "TOOLS=%USERPROFILE%\tools\gtool"
echo  [>>]  Installing to: %TOOLS%
echo.

:: Create directories
if not exist "%TOOLS%" mkdir "%TOOLS%"
if not exist "%TOOLS%\scripts" mkdir "%TOOLS%\scripts"

:: Copy files
echo  [1/4] Copying files...
copy /Y "%~dp0gtool.exe"            "%TOOLS%\gtool.exe"           >nul 2>&1
copy /Y "%~dp0gtool.ps1"            "%TOOLS%\gtool.ps1"           >nul 2>&1
copy /Y "%~dp0gtool.ico"            "%TOOLS%\gtool.ico"           >nul 2>&1
copy /Y "%~dp0scripts\proxyfier.ps1" "%TOOLS%\scripts\proxyfier.ps1" >nul 2>&1

:: Also update WORKSPACE path in gtool.ps1 copy
echo  [2/4] Configuring workspace path...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "(Get-Content '%TOOLS%\gtool.ps1') -replace 'C:\\\\Users\\\\absh5\\\\Documents\\\\antigravity\\\\fervent-planck', '%USERPROFILE%\tools\gtool' | Set-Content '%TOOLS%\gtool.ps1'"

:: Add to user PATH
echo  [3/4] Adding to PATH...
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v PATH 2^>nul') do set "CURR_PATH=%%b"
echo %CURR_PATH% | find /i "%TOOLS%" >nul 2>&1
if errorlevel 1 (
    reg add "HKCU\Environment" /v PATH /t REG_EXPAND_SZ /d "%CURR_PATH%;%TOOLS%" /f >nul
    echo  [OK]  Added to PATH: %TOOLS%
) else (
    echo  [OK]  Already in PATH.
)

:: Create Desktop shortcut
echo  [4/4] Creating Desktop shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ws = New-Object -ComObject WScript.Shell; $sc = $ws.CreateShortcut('%USERPROFILE%\Desktop\GTOOL.lnk'); $sc.TargetPath = '%TOOLS%\gtool.exe'; $sc.WorkingDirectory = '%TOOLS%'; $sc.IconLocation = '%TOOLS%\gtool.ico'; $sc.Description = 'Abdul Basit Dev Toolkit'; $sc.Save()"

echo.
echo  =================================================
echo   [OK]  INSTALLATION COMPLETE!
echo  =================================================
echo.
echo   How to use:
echo     1. Open a NEW terminal and type:  gtool
echo     2. Or double-click GTOOL on your Desktop
echo     3. Direct commands:
echo        gtool proxy off      (bypass eduroam)
echo        gtool git push       (quick push)
echo        gtool kill 3000      (kill port)
echo        gtool help           (all commands)
echo.
echo  =================================================
echo.
pause
