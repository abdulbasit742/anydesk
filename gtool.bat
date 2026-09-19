@echo off
:: ============================================================
::  GTOOL Launcher - Abdul Basit Dev Toolkit
::  Double-click to open interactive menu, or run with arguments
:: ============================================================

setlocal
set "GTOOL_DIR=%~dp0"
set "PS1=%GTOOL_DIR%gtool.ps1"

if not exist "%PS1%" (
    echo ERROR: gtool.ps1 not found at %PS1%
    pause
    exit /b 1
)

if "%1" == "" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%"
) else (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Command "%1" -SubCmd "%2" -Arg1 "%3" -Arg2 "%4"
)
