@echo off
:: ============================================================
::  proxyfier.bat  - Quick launcher for proxyfier.ps1
::  Double-click or call from cmd.exe
::
::  Usage:
::    proxyfier          → auto-detect
::    proxyfier on       → force proxy ON
::    proxyfier off      → bypass (direct internet)
::    proxyfier status   → show current state
::    proxyfier off -p   → bypass + persist to user env
:: ============================================================

setlocal

set MODE=%1
if "%MODE%"=="" set MODE=auto

set PERSIST=
if "%2"=="-p" set PERSIST=-Persist

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\proxyfier.ps1" -Mode %MODE% %PERSIST%

pause
