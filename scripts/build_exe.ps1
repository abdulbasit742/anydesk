# ============================================================
#  GTOOL BUILD SCRIPT
#  Compiles gtool.ps1 -> gtool.exe using ps2exe
#  Run: .\scripts\build_exe.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$ROOT    = "C:\Users\absh5\Documents\antigravity\fervent-planck"
$SRC     = "$ROOT\gtool.ps1"
$BUILD   = "$ROOT\build"
$ICON    = "$BUILD\gtool.ico"
$OUT_EXE = "$BUILD\gtool.exe"
$DIST    = "$ROOT\dist-gtool"
$VERSION = "2.0.0"

Write-Host ""
Write-Host "  =================================================" -ForegroundColor Cyan
Write-Host "   GTOOL EXE BUILDER v$VERSION" -ForegroundColor Cyan
Write-Host "  =================================================" -ForegroundColor Cyan
Write-Host ""

# Create directories
if (-not (Test-Path $BUILD)) { New-Item -Path $BUILD -ItemType Directory -Force | Out-Null }
if (-not (Test-Path $DIST))  { New-Item -Path $DIST  -ItemType Directory -Force | Out-Null }

# Step 1: Check ps2exe
Write-Host "  [1/5] Checking ps2exe..." -ForegroundColor Cyan
$ps2exeModule = Get-Module -ListAvailable -Name ps2exe -ErrorAction SilentlyContinue
if (-not $ps2exeModule) {
    Write-Host "  [!!]  ps2exe not found. Installing..." -ForegroundColor Yellow
    try {
        Install-Module -Name ps2exe -Scope CurrentUser -Force -AllowClobber
        Write-Host "  [OK]  ps2exe installed!" -ForegroundColor Green
    } catch {
        Write-Host "  [ERR] Could not install ps2exe: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  [>>]  Trying alternative method..." -ForegroundColor Cyan

        # Try downloading directly from GitHub
        $ps2exeUrl = "https://raw.githubusercontent.com/MScholtes/PS2EXE/master/Module/ps2exe.ps1"
        $ps2exeLocal = "$BUILD\ps2exe.ps1"
        try {
            Invoke-WebRequest -Uri $ps2exeUrl -OutFile $ps2exeLocal -UseBasicParsing
            Write-Host "  [OK]  ps2exe downloaded from GitHub!" -ForegroundColor Green
            $useLocalPs2exe = $true
        } catch {
            Write-Host "  [ERR] Could not download ps2exe." -ForegroundColor Red
            Write-Host "  [>>]  Falling back to self-extracting batch wrapper..." -ForegroundColor Yellow
            $useLocalPs2exe = $false
            $useBatchFallback = $true
        }
    }
} else {
    Write-Host "  [OK]  ps2exe v$($ps2exeModule.Version) found!" -ForegroundColor Green
    Import-Module ps2exe -Force
}

# Step 2: Validate source
Write-Host "  [2/5] Validating source file..." -ForegroundColor Cyan
if (-not (Test-Path $SRC)) {
    Write-Host "  [ERR] gtool.ps1 not found at: $SRC" -ForegroundColor Red
    exit 1
}
$lineCount = (Get-Content $SRC | Measure-Object -Line).Lines
Write-Host "  [OK]  gtool.ps1 found! Lines: $lineCount" -ForegroundColor Green

# Test PS syntax
$syntaxErrors = $null
$null = [System.Management.Automation.Language.Parser]::ParseFile($SRC, [ref]$null, [ref]$syntaxErrors)
if ($syntaxErrors.Count -gt 0) {
    Write-Host "  [ERR] Syntax errors in gtool.ps1:" -ForegroundColor Red
    $syntaxErrors | ForEach-Object { Write-Host "        $($_.Message) (line $($_.Extent.StartLineNumber))" -ForegroundColor Red }
    exit 1
}
Write-Host "  [OK]  Syntax check passed!" -ForegroundColor Green

# Step 3: Compile to EXE
Write-Host "  [3/5] Compiling to EXE..." -ForegroundColor Cyan

$compileParams = @{
    inputFile    = $SRC
    outputFile   = $OUT_EXE
    title        = "GTOOL"
    description  = "Abdul Basit Dev Toolkit"
    company      = "AbdulBasit"
    version      = $VERSION
    copyright    = "2026 AbdulBasit"
    requireAdmin = $false
    noConsole    = $false
    noOutput     = $false
    noError      = $false
}
if (Test-Path $ICON) {
    $compileParams.iconFile = $ICON
}

$compiled = $false

try {
    if ($useLocalPs2exe) {
        # Use locally downloaded ps2exe.ps1
        $ps2exeLocalPath = "$BUILD\ps2exe.ps1"
        & $ps2exeLocalPath @compileParams
    } else {
        # Use installed module
        Invoke-ps2exe @compileParams
    }
    $compiled = $true
    Write-Host "  [OK]  EXE compiled!" -ForegroundColor Green
} catch {
    Write-Host "  [ERR] Compilation failed: $($_.Exception.Message)" -ForegroundColor Red
    $useBatchFallback = $true
}

# Step 4: Batch wrapper fallback if ps2exe failed
if ($useBatchFallback -or -not $compiled) {
    Write-Host "  [3/5] Creating self-contained batch+PS1 launcher..." -ForegroundColor Yellow
    
    # Create a .bat that embeds the PS1 call - this is a common "EXE-like" approach
    $batchContent = @"
@echo off
:: GTOOL v$VERSION - Abdul Basit Dev Toolkit
:: Self-contained launcher
setlocal
set "GTOOL_DIR=%~dp0"
set "PS1=%GTOOL_DIR%gtool.ps1"
if not exist "%PS1%" (
    echo ERROR: gtool.ps1 not found next to this batch file.
    pause
    exit /b 1
)
set CMD=%1
set SUB=%2
set A1=%3
if "%CMD%"=="" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%"
) else (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Command %CMD% -SubCmd %SUB% -Arg1 %A1%
)
"@
    Set-Content -Path "$BUILD\gtool.exe.bat" -Value $batchContent -Encoding ASCII
    Set-Content -Path "$ROOT\gtool.bat"      -Value $batchContent -Encoding ASCII
    
    # Also create a VBS wrapper that runs without showing cmd window briefly
    $vbsContent = @"
Set WshShell = CreateObject("WScript.Shell")
strArgs = ""
For i = 1 To WScript.Arguments.Count
    strArgs = strArgs & " " & WScript.Arguments(i-1)
Next
WshShell.Run "powershell.exe -NoProfile -ExecutionPolicy Bypass -File """ & CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\gtool.ps1""" & strArgs, 1, False
"@
    Set-Content -Path "$BUILD\gtool_launcher.vbs" -Value $vbsContent
    Set-Content -Path "$ROOT\gtool.vbs"           -Value $vbsContent
    
    Write-Host "  [OK]  Batch + VBS launcher created (EXE fallback)" -ForegroundColor Green
    $OUT_EXE = "$BUILD\gtool.exe.bat"
}

# Step 5: Create dist package
Write-Host "  [4/5] Creating distribution package..." -ForegroundColor Cyan

# Copy files to dist
$filesToDist = @($SRC, "$ROOT\scripts\proxyfier.ps1", "$ROOT\gtool.bat")
if (Test-Path "$BUILD\gtool.exe") { $filesToDist += "$BUILD\gtool.exe" }
if (Test-Path "$BUILD\gtool.ico") { $filesToDist += "$BUILD\gtool.ico" }
if (Test-Path "$ROOT\gtool.vbs")  { $filesToDist += "$ROOT\gtool.vbs" }

$scriptsDir = "$DIST\scripts"
if (-not (Test-Path $scriptsDir)) { New-Item -Path $scriptsDir -ItemType Directory -Force | Out-Null }

foreach ($f in $filesToDist) {
    if (Test-Path $f) {
        $destName = Split-Path $f -Leaf
        if ($destName -eq "proxyfier.ps1") {
            Copy-Item $f "$scriptsDir\$destName" -Force
        } else {
            Copy-Item $f "$DIST\$destName" -Force
        }
    }
}

# Create README for the dist
$readme = @"
=================================================
 GTOOL v$VERSION - Abdul Basit Dev Toolkit
=================================================

INSTALLATION:
  1. Run gtool-setup.bat as Administrator (adds to PATH)
     OR
  2. Double-click gtool.exe (or gtool.bat) directly

USAGE (Interactive Menu):
  gtool.exe             -- Opens interactive menu
  gtool.exe proxy off   -- Bypass eduroam proxy
  gtool.exe proxy on    -- Enable eduroam proxy
  gtool.exe git push    -- Quick commit + push
  gtool.exe kill 3000   -- Kill port 3000
  gtool.exe dev start   -- Start dev server
  gtool.exe help        -- Show all commands

MODULES:
  1. PROXY   - eduroam on/off/auto/persist
  2. GIT     - commit, push, pull, branch, stash
  3. DEV     - server, build, test, ports
  4. DEPLOY  - vercel, android, backup
  5. SYSTEM  - network, disk, RAM, DNS, processes
  6. TOOLS   - password, UUID, base64, JSON, hash
  7. NPM     - install, update, audit, packages
  8. SETTINGS - log, about, workspace

Made with love for Abdul Basit
=================================================
"@
Set-Content -Path "$DIST\README.txt" -Value $readme

# Create installer script
$installerContent = @"
@echo off
:: GTOOL INSTALLER - Adds gtool to system PATH
echo.
echo  ================================================
echo   GTOOL v$VERSION Installer
echo  ================================================
echo.

:: Check admin
net session >nul 2>&1
if errorlevel 1 (
    echo  [!!] Please run as Administrator for PATH installation
    echo  [>>] Trying user-level PATH instead...
)

:: Copy to user's tools folder
set "TOOLS=%USERPROFILE%\tools"
if not exist "%TOOLS%" mkdir "%TOOLS%"

:: Copy all files
xcopy /Y /Q "%~dp0*.*" "%TOOLS%\" >nul
if exist "%~dp0scripts" xcopy /Y /Q /E "%~dp0scripts\*.*" "%TOOLS%\scripts\" >nul

:: Add to user PATH
set "CURRENT_PATH="
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v PATH 2^>nul') do set "CURRENT_PATH=%%b"
echo %CURRENT_PATH% | find /i "%TOOLS%" >nul
if errorlevel 1 (
    reg add "HKCU\Environment" /v PATH /t REG_EXPAND_SZ /d "%CURRENT_PATH%;%TOOLS%" /f >nul
    echo  [OK]  Added %TOOLS% to your PATH
    echo  [>>]  Restart your terminal then type: gtool
) else (
    echo  [OK]  Already in PATH: %TOOLS%
)

echo.
echo  [OK]  Installation complete!
echo  [>>]  Type 'gtool' in any new terminal window
echo.
pause
"@
Set-Content -Path "$DIST\gtool-setup.bat" -Value $installerContent -Encoding ASCII

# Zip the dist
Write-Host "  [5/5] Zipping dist package..." -ForegroundColor Cyan
$zipPath = "$ROOT\build\gtool-v$VERSION-windows.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$DIST\*" -DestinationPath $zipPath -Force
Write-Host "  [OK]  Package created: $zipPath" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "  =================================================" -ForegroundColor Cyan
Write-Host "   BUILD COMPLETE!" -ForegroundColor Green
Write-Host "  =================================================" -ForegroundColor Cyan
Write-Host ""
if (Test-Path "$BUILD\gtool.exe") {
    $exeSize = [math]::Round((Get-Item "$BUILD\gtool.exe").Length / 1KB, 1)
    Write-Host "  EXE     : $BUILD\gtool.exe ($exeSize KB)" -ForegroundColor White
}
Write-Host "  Package : $zipPath" -ForegroundColor White
Write-Host "  Dist    : $DIST" -ForegroundColor White
Write-Host ""
Write-Host "  To install system-wide:" -ForegroundColor Yellow
Write-Host "    Run: $DIST\gtool-setup.bat as Administrator" -ForegroundColor White
Write-Host ""

# Open build folder
explorer $BUILD
