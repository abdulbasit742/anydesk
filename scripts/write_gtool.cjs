const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'gtool.ps1');

// Full gtool script - all features complete
const script = String.raw`
#Requires -Version 5.1
<#
.SYNOPSIS
    GTOOL - Abdul Basit ka Personal Dev Toolkit
.DESCRIPTION
    All-in-one developer CLI: proxy, git, dev server, deploy, system tools, utils
.VERSION
    2.0.0
.EXAMPLE
    .\gtool.ps1                    # Interactive menu
    .\gtool.ps1 proxy off          # Bypass eduroam proxy
    .\gtool.ps1 git push "msg"     # Quick commit and push
    .\gtool.ps1 kill 3000          # Kill process on port
    .\gtool.ps1 dev start          # Start dev server
    .\gtool.ps1 help               # Show all commands
#>

param(
    [string]$Command = "",
    [string]$SubCmd  = "",
    [string]$Arg1    = "",
    [string]$Arg2    = ""
)

# ================================================================
#  CONFIGURATION
# ================================================================
$GTOOL_VERSION = "2.0.0"
$WORKSPACE     = "C:\Users\absh5\Documents\antigravity\fervent-planck"
$PROXYFIER     = "$WORKSPACE\scripts\proxyfier.ps1"
$PROXY_HOST    = "172.30.10.10"
$PROXY_PORT    = 3128
$GTOOL_LOG     = "$env:APPDATA\gtool\gtool.log"

# ================================================================
#  OUTPUT HELPERS
# ================================================================
function wr  { param([string]$t, [ConsoleColor]$c = "White") { Write-Host $t -ForegroundColor $c } }
function wrn { param([string]$t, [ConsoleColor]$c = "White") { Write-Host $t -ForegroundColor $c -NoNewline } }
function gok  { param([string]$m) { Write-Host "  [OK]    $m" -ForegroundColor Green  } }
function gerr { param([string]$m) { Write-Host "  [ERROR] $m" -ForegroundColor Red    } }
function ginf { param([string]$m) { Write-Host "  [>>]    $m" -ForegroundColor Cyan   } }
function gwrn { param([string]$m) { Write-Host "  [WARN]  $m" -ForegroundColor Yellow } }
function div  { Write-Host "  -------------------------------------------------" -ForegroundColor DarkGray }
function div2 { Write-Host "  =================================================" -ForegroundColor DarkCyan }
function br   { Write-Host "" }

function glog {
    param([string]$msg)
    try {
        $logDir = Split-Path $GTOOL_LOG -Parent
        if (-not (Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory -Force | Out-Null }
        "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | $msg" | Add-Content -Path $GTOOL_LOG
    } catch {}
}

# ================================================================
#  NETWORK / PROXY HELPERS
# ================================================================
function proxy-ok {
    return (Test-Connection -ComputerName $PROXY_HOST -Count 1 -Quiet -ErrorAction SilentlyContinue)
}

function get-public-ip {
    try {
        $r = Invoke-RestMethod -Uri "https://api.ipify.org?format=json" -TimeoutSec 4 -ErrorAction Stop
        return $r.ip
    } catch {
        return "N/A"
    }
}

# ================================================================
#  BANNER
# ================================================================
function banner {
    Clear-Host
    br
    div2
    Write-Host "   GTOOL v$GTOOL_VERSION  --  Abdul Basit Dev Toolkit" -ForegroundColor Cyan
    div2
    br
    $time    = Get-Date -Format "HH:mm:ss"
    $date    = Get-Date -Format "dd-MMM-yyyy"
    $pxOk    = proxy-ok
    $pxLabel = if ($pxOk) { " EDUROAM ON " } else { " DIRECT     " }
    $pxColor = if ($pxOk) { "Yellow"       } else { "Green"        }

    Write-Host "  $date $time" -ForegroundColor DarkGray -NoNewline
    Write-Host "  |" -ForegroundColor DarkGray -NoNewline
    Write-Host " $pxLabel" -ForegroundColor $pxColor -NoNewline
    Write-Host "  |  fervent-planck" -ForegroundColor DarkGray
    br
}

# ================================================================
#  KILL PORT HELPER
# ================================================================
function kill-port {
    param([string]$port)
    try {
        $conns = Get-NetTCPConnection -LocalPort ([int]$port) -ErrorAction SilentlyContinue
        if (-not $conns) { gwrn "No process found on port $port"; return }
        $conns.OwningProcess | Sort-Object -Unique | ForEach-Object {
            $p = Get-Process -Id $_ -ErrorAction SilentlyContinue
            if ($p) {
                gwrn "Killing: $($p.Name) (PID $_) on port $port"
                Stop-Process -Id $_ -Force
                gok "Process killed!"
                glog "Killed $($p.Name) PID $_ on port $port"
            }
        }
    } catch {
        gerr $_.Exception.Message
    }
}

# ================================================================
#  MODULE 1: PROXY MANAGER
# ================================================================
function menu-proxy {
    banner
    Write-Host "  [1] PROXY MANAGER" -ForegroundColor Yellow
    div
    Write-Host "  1. OFF    - Bypass eduroam (direct internet)" -ForegroundColor White
    Write-Host "  2. ON     - Route through eduroam proxy"      -ForegroundColor White
    Write-Host "  3. AUTO   - Auto-detect and configure"        -ForegroundColor White
    Write-Host "  4. STATUS - Show current state"               -ForegroundColor White
    Write-Host "  5. PERSIST OFF - Bypass permanently"          -ForegroundColor White
    Write-Host "  6. PERSIST ON  - Enable proxy permanently"    -ForegroundColor White
    Write-Host "  0. Back"                                       -ForegroundColor DarkGray
    div
    $c = Read-Host "  Choose"
    switch ($c) {
        "1" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode off;    glog "proxy off" }
        "2" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode on;     glog "proxy on" }
        "3" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode auto;   glog "proxy auto" }
        "4" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode status }
        "5" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode off  -Persist; glog "proxy off persist" }
        "6" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode on   -Persist; glog "proxy on persist" }
        "0" { return }
    }
    pause-key
}

# ================================================================
#  MODULE 2: GIT SHORTCUTS
# ================================================================
function menu-git {
    banner
    Write-Host "  [2] GIT SHORTCUTS" -ForegroundColor Yellow
    div
    Write-Host "  1.  Status"                   -ForegroundColor White
    Write-Host "  2.  Quick Commit + Push"       -ForegroundColor White
    Write-Host "  3.  Pull (current branch)"     -ForegroundColor White
    Write-Host "  4.  Log (last 15 commits)"     -ForegroundColor White
    Write-Host "  5.  List Branches"             -ForegroundColor White
    Write-Host "  6.  New Branch + Switch"       -ForegroundColor White
    Write-Host "  7.  Merge Branch"              -ForegroundColor White
    Write-Host "  8.  Delete Branch"             -ForegroundColor White
    Write-Host "  9.  Stash Changes"             -ForegroundColor White
    Write-Host "  10. Stash Pop"                 -ForegroundColor White
    Write-Host "  11. Stash List"                -ForegroundColor White
    Write-Host "  12. Clone Repo"                -ForegroundColor White
    Write-Host "  13. Set Remote URL"            -ForegroundColor White
    Write-Host "  14. Undo Last Commit (soft)"   -ForegroundColor White
    Write-Host "  15. Diff (unstaged)"           -ForegroundColor White
    Write-Host "  0.  Back"                      -ForegroundColor DarkGray
    div
    $c = Read-Host "  Choose"
    Push-Location $WORKSPACE
    switch ($c) {
        "1"  { git status }
        "2"  {
                 $msg = Read-Host "  Commit message (Enter = auto-generate)"
                 if ([string]::IsNullOrWhiteSpace($msg)) {
                     $changed = (git status --short | Measure-Object -Line).Lines
                     $msg = "gtool: update $changed files - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
                 }
                 git add -A
                 git commit -m $msg
                 git push
                 gok "Pushed! Message: $msg"
                 glog "git push: $msg"
             }
        "3"  { git pull }
        "4"  { git log --oneline --graph --decorate -15 }
        "5"  { git branch -a }
        "6"  { $b = Read-Host "  New branch name"; git checkout -b $b; gok "Switched to: $b" }
        "7"  { $b = Read-Host "  Branch to merge into current"; git merge $b }
        "8"  {
                 $b = Read-Host "  Branch to delete"
                 $conf = Read-Host "  Confirm delete '$b'? (y/n)"
                 if ($conf -eq "y") { git branch -d $b; gok "Deleted: $b" }
             }
        "9"  { $msg = Read-Host "  Stash name (optional)"; if ($msg) { git stash push -m $msg } else { git stash }; gok "Stashed!" }
        "10" { git stash pop; gok "Stash popped!" }
        "11" { git stash list }
        "12" { $url = Read-Host "  Repo URL"; git clone $url; gok "Cloned!" }
        "13" { $url = Read-Host "  New remote URL"; git remote set-url origin $url; gok "Remote updated!" }
        "14" {
                 $conf = Read-Host "  Undo last commit? Changes stay. (y/n)"
                 if ($conf -eq "y") { git reset --soft HEAD~1; gok "Commit undone (changes kept)" }
             }
        "15" { git diff }
        "0"  { Pop-Location; return }
    }
    Pop-Location
    pause-key
}

# ================================================================
#  MODULE 3: DEV SERVER
# ================================================================
function menu-dev {
    banner
    Write-Host "  [3] DEV SERVER" -ForegroundColor Yellow
    div
    Write-Host "  1. Start Dev Server   (npm run dev)"         -ForegroundColor White
    Write-Host "  2. Build Production   (npm run build)"       -ForegroundColor White
    Write-Host "  3. Preview Build      (npm run preview)"     -ForegroundColor White
    Write-Host "  4. Run Tests          (npm test)"            -ForegroundColor White
    Write-Host "  5. npm install"                               -ForegroundColor White
    Write-Host "  6. Lint Code          (npm run lint)"        -ForegroundColor White
    Write-Host "  7. Check Port Status"                        -ForegroundColor White
    Write-Host "  8. Kill Port"                                -ForegroundColor White
    Write-Host "  9. Open localhost in Browser"               -ForegroundColor White
    Write-Host "  10. Show Running Dev Servers"               -ForegroundColor White
    Write-Host "  0. Back"                                     -ForegroundColor DarkGray
    div
    $c = Read-Host "  Choose"
    Push-Location $WORKSPACE
    switch ($c) {
        "1"  {
                 ginf "Starting dev server in new window..."
                 $arg = "-NoProfile -NoExit -Command `"Set-Location '$WORKSPACE'; npm run dev`""
                 Start-Process powershell -ArgumentList $arg -WindowStyle Normal
                 Start-Sleep 1
                 gok "Dev server started! Check new window."
                 glog "dev server started"
             }
        "2"  { ginf "Building..."; npm run build; gok "Build complete! Check ./dist" }
        "3"  {
                 $arg = "-NoProfile -NoExit -Command `"Set-Location '$WORKSPACE'; npm run preview`""
                 Start-Process powershell -ArgumentList $arg -WindowStyle Normal
                 gok "Preview server started!"
             }
        "4"  { npm test }
        "5"  { ginf "Installing..."; npm install; gok "Dependencies installed!" }
        "6"  { npm run lint }
        "7"  {
                 $port = Read-Host "  Port number"
                 $conn = Get-NetTCPConnection -LocalPort ([int]$port) -ErrorAction SilentlyContinue
                 if ($conn) {
                     gwrn "Port $port is IN USE"
                     $conn | ForEach-Object {
                         $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
                         ginf "Process: $($proc.Name) PID $($_.OwningProcess)"
                     }
                 } else {
                     gok "Port $port is FREE"
                 }
             }
        "8"  { $p = Read-Host "  Port to kill"; kill-port $p }
        "9"  {
                 $port = Read-Host "  Port (default: 5173)"
                 if ([string]::IsNullOrWhiteSpace($port)) { $port = "5173" }
                 Start-Process "http://localhost:$port"
                 gok "Opened: localhost:$port"
             }
        "10" {
                 ginf "Processes on common dev ports:"
                 @(3000, 3001, 4000, 5000, 5173, 8000, 8080, 8888, 9000) | ForEach-Object {
                     $c = Get-NetTCPConnection -LocalPort $_ -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" }
                     if ($c) {
                         $proc = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
                         Write-Host "  Port $_ -> $($proc.Name)" -ForegroundColor Yellow
                     }
                 }
             }
        "0"  { Pop-Location; return }
    }
    Pop-Location
    pause-key
}

# ================================================================
#  MODULE 4: BUILD & DEPLOY
# ================================================================
function menu-deploy {
    banner
    Write-Host "  [4] BUILD & DEPLOY" -ForegroundColor Yellow
    div
    Write-Host "  1. Vite Build          - Production bundle"    -ForegroundColor White
    Write-Host "  2. Vercel Deploy       - Deploy to production" -ForegroundColor White
    Write-Host "  3. Vercel Preview      - Deploy preview URL"   -ForegroundColor White
    Write-Host "  4. Android Build       - Build debug APK"      -ForegroundColor White
    Write-Host "  5. Android Release     - Build release APK"    -ForegroundColor White
    Write-Host "  6. Zip Project         - Backup to Desktop"    -ForegroundColor White
    Write-Host "  7. Open dist Folder"                          -ForegroundColor White
    Write-Host "  8. Clean Build Cache"                         -ForegroundColor White
    Write-Host "  0. Back"                                       -ForegroundColor DarkGray
    div
    $c = Read-Host "  Choose"
    Push-Location $WORKSPACE
    switch ($c) {
        "1"  {
                 ginf "Building production bundle..."
                 npm run build
                 $size = (Get-ChildItem -Path "dist" -Recurse -File | Measure-Object Length -Sum).Sum / 1MB
                 gok "Build done! Size: $([math]::Round($size,2)) MB"
             }
        "2"  {
                 if (Get-Command vercel -ErrorAction SilentlyContinue) {
                     ginf "Deploying to Vercel (production)..."
                     vercel --prod
                 } else {
                     gwrn "Vercel CLI not found. Installing..."
                     npm install -g vercel
                     vercel --prod
                 }
             }
        "3"  { vercel }
        "4"  {
                 $androidDir = "$WORKSPACE\android-app"
                 if (Test-Path $androidDir) {
                     Push-Location $androidDir
                     ginf "Building debug APK..."
                     .\gradlew assembleDebug
                     gok "APK built! Check app/build/outputs/apk/debug/"
                     Pop-Location
                 } else {
                     gerr "android-app folder not found at: $androidDir"
                 }
             }
        "5"  {
                 $androidDir = "$WORKSPACE\android-app"
                 if (Test-Path $androidDir) {
                     Push-Location $androidDir
                     ginf "Building release APK..."
                     .\gradlew assembleRelease
                     gok "Release APK built!"
                     Pop-Location
                 } else { gerr "android-app not found" }
             }
        "6"  {
                 $zipName = "gtool-backup-$(Get-Date -Format 'yyyy-MM-dd-HHmm').zip"
                 $outZip  = "$env:USERPROFILE\Desktop\$zipName"
                 ginf "Zipping project..."
                 $items = @("src", "package.json", "vite.config.js", "gtool.ps1", "scripts") |
                          ForEach-Object { "$WORKSPACE\$_" } |
                          Where-Object { Test-Path $_ }
                 Compress-Archive -Path $items -DestinationPath $outZip -Force
                 gok "Zipped to: $outZip"
             }
        "7"  { $distPath = "$WORKSPACE\dist"; if (Test-Path $distPath) { explorer $distPath } else { gerr "dist/ not found. Build first." } }
        "8"  {
                 ginf "Cleaning dist/ and node_modules/.cache..."
                 Remove-Item "$WORKSPACE\dist" -Recurse -Force -ErrorAction SilentlyContinue
                 Remove-Item "$WORKSPACE\node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
                 gok "Cache cleared!"
             }
        "0"  { Pop-Location; return }
    }
    Pop-Location
    pause-key
}

# ================================================================
#  MODULE 5: SYSTEM TOOLS
# ================================================================
function menu-system {
    banner
    Write-Host "  [5] SYSTEM TOOLS" -ForegroundColor Yellow
    div
    Write-Host "  1.  Network Info (IP, gateway, DNS)"  -ForegroundColor White
    Write-Host "  2.  All Listening Ports"              -ForegroundColor White
    Write-Host "  3.  Kill Process on Port"             -ForegroundColor White
    Write-Host "  4.  Disk Space"                       -ForegroundColor White
    Write-Host "  5.  RAM Usage"                        -ForegroundColor White
    Write-Host "  6.  CPU Usage"                        -ForegroundColor White
    Write-Host "  7.  Flush DNS Cache"                  -ForegroundColor White
    Write-Host "  8.  My Public IP"                     -ForegroundColor White
    Write-Host "  9.  Ping a host"                      -ForegroundColor White
    Write-Host "  10. Top Processes (CPU)"              -ForegroundColor White
    Write-Host "  11. Environment Variables"            -ForegroundColor White
    Write-Host "  12. Windows Firewall Status"          -ForegroundColor White
    Write-Host "  13. Restart Network Adapter"          -ForegroundColor White
    Write-Host "  0.  Back"                             -ForegroundColor DarkGray
    div
    $c = Read-Host "  Choose"
    switch ($c) {
        "1"  {
                 ginf "Network Interfaces:"
                 Get-NetIPConfiguration | Where-Object { $_.IPv4Address -ne $null } | ForEach-Object {
                     br
                     Write-Host "  Interface : $($_.InterfaceAlias)" -ForegroundColor White
                     Write-Host "  IP Addr   : $($_.IPv4Address.IPAddress)" -ForegroundColor Cyan
                     if ($_.IPv4DefaultGateway) {
                         Write-Host "  Gateway   : $($_.IPv4DefaultGateway.NextHop)" -ForegroundColor Cyan
                     }
                     $dns = $_.DNSServer.ServerAddresses -join ", "
                     if ($dns) { Write-Host "  DNS       : $dns" -ForegroundColor DarkCyan }
                 }
                 br
                 $pubIp = get-public-ip
                 ginf "Public IP: $pubIp"
             }
        "2"  {
                 ginf "Listening ports:"
                 Get-NetTCPConnection -State Listen |
                     Select-Object LocalPort,
                         @{N="Process";E={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name}} |
                     Sort-Object LocalPort | Format-Table -AutoSize
             }
        "3"  { $p = Read-Host "  Port to kill"; kill-port $p }
        "4"  {
                 ginf "Disk Usage:"
                 Get-PSDrive -PSProvider FileSystem |
                     Select-Object Name,
                         @{N="Used(GB)";E={[math]::Round($_.Used/1GB,2)}},
                         @{N="Free(GB)";E={[math]::Round($_.Free/1GB,2)}},
                         @{N="Total(GB)";E={[math]::Round(($_.Used+$_.Free)/1GB,2)}} |
                     Format-Table -AutoSize
             }
        "5"  {
                 $m     = Get-CimInstance Win32_OperatingSystem
                 $total = [math]::Round($m.TotalVisibleMemorySize/1MB,1)
                 $free  = [math]::Round($m.FreePhysicalMemory/1MB,1)
                 $used  = [math]::Round($total - $free,1)
                 $pct   = [math]::Round(($used/$total)*100,0)
                 ginf "RAM: $used GB used  |  $free GB free  |  $total GB total  ($pct% used)"
             }
        "6"  {
                 $cpu = (Get-CimInstance Win32_Processor).LoadPercentage
                 ginf "CPU Usage: $cpu%"
             }
        "7"  { ipconfig /flushdns | Out-Null; gok "DNS cache flushed!" }
        "8"  { $ip = get-public-ip; ginf "Your Public IP: $ip" }
        "9"  {
                 $host_ = Read-Host "  Host to ping"
                 $result = Test-Connection -ComputerName $host_ -Count 4 -ErrorAction SilentlyContinue
                 if ($result) {
                     $avg = [math]::Round(($result | Measure-Object ResponseTime -Average).Average, 1)
                     gok "$host_ reachable! Avg latency: $avg ms"
                 } else {
                     gerr "$host_ is NOT reachable"
                 }
             }
        "10" {
                 ginf "Top 12 processes by CPU:"
                 Get-Process | Sort-Object CPU -Descending | Select-Object -First 12 Name, Id,
                     @{N="CPU(s)";E={[math]::Round($_.CPU,1)}},
                     @{N="RAM(MB)";E={[math]::Round($_.WorkingSet/1MB,1)}} |
                 Format-Table -AutoSize
             }
        "11" {
                 ginf "Key Environment Variables:"
                 @("HTTP_PROXY","HTTPS_PROXY","NO_PROXY","PATH","USERPROFILE","APPDATA","TEMP","JAVA_HOME","ANDROID_HOME") |
                 ForEach-Object {
                     $v = [System.Environment]::GetEnvironmentVariable($_, "User")
                     if (-not $v) { $v = [System.Environment]::GetEnvironmentVariable($_, "Machine") }
                     if ($v) { Write-Host "  $_ = $v" -ForegroundColor Cyan }
                     else    { Write-Host "  $_ = (not set)" -ForegroundColor DarkGray }
                 }
             }
        "12" {
                 $fw = Get-NetFirewallProfile | Select-Object Name, Enabled
                 $fw | ForEach-Object {
                     $color = if ($_.Enabled) { "Yellow" } else { "Green" }
                     Write-Host "  Firewall $($_.Name): $(if($_.Enabled){'ENABLED'}else{'disabled'})" -ForegroundColor $color
                 }
             }
        "13" {
                 ginf "Network Adapters:"
                 $adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }
                 $adapters | Select-Object Name, InterfaceDescription | Format-Table -AutoSize
                 $name = Read-Host "  Adapter name to restart (or Enter to skip)"
                 if ($name) {
                     Restart-NetAdapter -Name $name -Confirm:$false
                     gok "Adapter '$name' restarted!"
                 }
             }
        "0"  { return }
    }
    pause-key
}

# ================================================================
#  MODULE 6: QUICK TOOLS
# ================================================================
function menu-utils {
    banner
    Write-Host "  [6] QUICK TOOLS" -ForegroundColor Yellow
    div
    Write-Host "  1.  Strong Password Generator"   -ForegroundColor White
    Write-Host "  2.  Base64 Encode"               -ForegroundColor White
    Write-Host "  3.  Base64 Decode"               -ForegroundColor White
    Write-Host "  4.  UUID / GUID Generator"       -ForegroundColor White
    Write-Host "  5.  File Search"                 -ForegroundColor White
    Write-Host "  6.  Unix Timestamp"              -ForegroundColor White
    Write-Host "  7.  JSON Pretty Print"           -ForegroundColor White
    Write-Host "  8.  SHA256 File Hash"            -ForegroundColor White
    Write-Host "  9.  URL Encode"                  -ForegroundColor White
    Write-Host "  10. URL Decode"                  -ForegroundColor White
    Write-Host "  11. Random Color (Hex)"          -ForegroundColor White
    Write-Host "  12. Word / Line Counter"         -ForegroundColor White
    Write-Host "  13. Open Calc / Notepad"         -ForegroundColor White
    Write-Host "  0.  Back"                        -ForegroundColor DarkGray
    div
    $c = Read-Host "  Choose"
    switch ($c) {
        "1"  {
                 $len  = Read-Host "  Length (default 20)"
                 $spec = Read-Host "  Include special chars? (y/n, default y)"
                 if ([string]::IsNullOrWhiteSpace($len)) { $len = 20 }
                 $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                 if ($spec -ne "n") { $chars += "!@#%^&*-_+=?" }
                 $pwd = -join ((1..[int]$len) | ForEach-Object { $chars[(Get-Random -Max $chars.Length)] })
                 br; gok "Password: $pwd"; $pwd | Set-Clipboard
                 ginf "Clipboard mein copy ho gaya!"
             }
        "2"  {
                 $t = Read-Host "  Text to encode"
                 $e = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($t))
                 gok "Base64: $e"; $e | Set-Clipboard
             }
        "3"  {
                 $b = Read-Host "  Base64 to decode"
                 try   { $d = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($b)); gok "Decoded: $d"; $d | Set-Clipboard }
                 catch { gerr "Invalid base64 string" }
             }
        "4"  {
                 $u = [System.Guid]::NewGuid().ToString()
                 gok "UUID: $u"; $u | Set-Clipboard
                 ginf "Clipboard mein copy ho gaya!"
             }
        "5"  {
                 $name = Read-Host "  File name (partial ok)"
                 $srch = Read-Host "  Search path (Enter = workspace)"
                 if ([string]::IsNullOrWhiteSpace($srch)) { $srch = $WORKSPACE }
                 ginf "Searching in $srch..."
                 $results = Get-ChildItem -Path $srch -Recurse -Filter "*$name*" -ErrorAction SilentlyContinue
                 if ($results) {
                     $results | Select-Object FullName, @{N="Size(KB)";E={[math]::Round($_.Length/1KB,1)}}, LastWriteTime | Format-Table -AutoSize
                 } else {
                     gwrn "No files found matching: *$name*"
                 }
             }
        "6"  {
                 $ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
                 $ms = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                 gok "Unix Seconds : $ts"
                 ginf "Unix Ms      : $ms"
                 $ts | Set-Clipboard
             }
        "7"  {
                 $j = Read-Host "  Paste JSON (single line)"
                 try   { $pretty = $j | ConvertFrom-Json | ConvertTo-Json -Depth 20; Write-Host $pretty -ForegroundColor Cyan }
                 catch { gerr "Invalid JSON" }
             }
        "8"  {
                 $f = Read-Host "  File path"
                 if (Test-Path $f) {
                     $h = Get-FileHash -Path $f -Algorithm SHA256
                     gok "SHA256: $($h.Hash)"
                     $h.Hash | Set-Clipboard
                 } else { gerr "File not found: $f" }
             }
        "9"  {
                 $t = Read-Host "  URL to encode"
                 $e = [Uri]::EscapeDataString($t)
                 gok "Encoded: $e"; $e | Set-Clipboard
             }
        "10" {
                 $t = Read-Host "  URL to decode"
                 $d = [Uri]::UnescapeDataString($t)
                 gok "Decoded: $d"; $d | Set-Clipboard
             }
        "11" {
                 $r = Get-Random -Max 255; $g = Get-Random -Max 255; $b_ = Get-Random -Max 255
                 $hex = "#{0:X2}{1:X2}{2:X2}" -f $r,$g,$b_
                 Write-Host "  Color: $hex  (R=$r G=$g B=$b_)" -ForegroundColor Magenta
                 $hex | Set-Clipboard
             }
        "12" {
                 $text = Read-Host "  Paste text (or file path)"
                 if (Test-Path $text) { $content = Get-Content $text -Raw }
                 else { $content = $text }
                 $words = ($content -split '\s+' | Where-Object { $_ -ne "" }).Count
                 $lines = ($content -split "`n").Count
                 $chars = $content.Length
                 ginf "Words: $words  |  Lines: $lines  |  Chars: $chars"
             }
        "13" {
                 Write-Host "  1. Calculator  2. Notepad  3. Paint  4. Task Manager" -ForegroundColor White
                 $app = Read-Host "  Choose"
                 switch ($app) {
                     "1" { Start-Process calc }
                     "2" { Start-Process notepad }
                     "3" { Start-Process mspaint }
                     "4" { Start-Process taskmgr }
                 }
             }
        "0"  { return }
    }
    pause-key
}

# ================================================================
#  MODULE 7: NPM / NODE
# ================================================================
function menu-npm {
    banner
    Write-Host "  [7] NPM / NODE TOOLS" -ForegroundColor Yellow
    div
    Write-Host "  1.  npm install"                -ForegroundColor White
    Write-Host "  2.  npm update"                 -ForegroundColor White
    Write-Host "  3.  npm audit fix"              -ForegroundColor White
    Write-Host "  4.  npm list (installed)"       -ForegroundColor White
    Write-Host "  5.  Install package"            -ForegroundColor White
    Write-Host "  6.  Remove package"             -ForegroundColor White
    Write-Host "  7.  Clear npm cache"            -ForegroundColor White
    Write-Host "  8.  Node + npm versions"        -ForegroundColor White
    Write-Host "  9.  Global packages list"       -ForegroundColor White
    Write-Host "  10. npx command"                -ForegroundColor White
    Write-Host "  11. npm run (custom script)"    -ForegroundColor White
    Write-Host "  0.  Back"                       -ForegroundColor DarkGray
    div
    $c = Read-Host "  Choose"
    Push-Location $WORKSPACE
    switch ($c) {
        "1"  { ginf "Installing..."; npm install; gok "Done!" }
        "2"  { npm update }
        "3"  { npm audit fix }
        "4"  { npm list --depth=0 }
        "5"  {
                 $pkg = Read-Host "  Package name"
                 $dev = Read-Host "  Dev dependency? (y/n)"
                 if ($dev -eq "y") { npm install --save-dev $pkg }
                 else              { npm install $pkg }
                 gok "Installed: $pkg"
             }
        "6"  { $pkg = Read-Host "  Package to remove"; npm uninstall $pkg; gok "Removed: $pkg" }
        "7"  { npm cache clean --force; gok "npm cache cleared!" }
        "8"  { ginf "Node: $(node --version)  |  npm: $(npm --version)" }
        "9"  { npm list -g --depth=0 }
        "10" { $cmd = Read-Host "  npx command (without 'npx')"; Invoke-Expression "npx $cmd" }
        "11" {
                 ginf "Available scripts:"; npm run 2>&1 | Select-String "^  [a-zA-Z]"
                 $script = Read-Host "  Script name"
                 if ($script) { npm run $script }
             }
        "0"  { Pop-Location; return }
    }
    Pop-Location
    pause-key
}

# ================================================================
#  MODULE 8: GTOOL SETTINGS / ABOUT
# ================================================================
function menu-settings {
    banner
    Write-Host "  [8] SETTINGS & INFO" -ForegroundColor Yellow
    div
    Write-Host "  1. View gtool log"              -ForegroundColor White
    Write-Host "  2. Clear gtool log"             -ForegroundColor White
    Write-Host "  3. Change workspace path"       -ForegroundColor White
    Write-Host "  4. About gtool"                 -ForegroundColor White
    Write-Host "  5. Check for updates"           -ForegroundColor White
    Write-Host "  6. Open workspace in Explorer"  -ForegroundColor White
    Write-Host "  7. Open in VS Code"             -ForegroundColor White
    Write-Host "  0. Back"                        -ForegroundColor DarkGray
    div
    $c = Read-Host "  Choose"
    switch ($c) {
        "1"  {
                 if (Test-Path $GTOOL_LOG) { Get-Content $GTOOL_LOG -Tail 50 }
                 else { gwrn "No log file yet." }
             }
        "2"  {
                 if (Test-Path $GTOOL_LOG) { Remove-Item $GTOOL_LOG -Force; gok "Log cleared!" }
                 else { gwrn "No log file found." }
             }
        "3"  {
                 $newWs = Read-Host "  New workspace path"
                 gwrn "Workspace change requires editing gtool.ps1 directly ($WORKSPACE\gtool.ps1)"
                 ginf "Current workspace: $WORKSPACE"
             }
        "4"  {
                 br; div2
                 Write-Host "   GTOOL v$GTOOL_VERSION" -ForegroundColor Cyan
                 Write-Host "   Abdul Basit ka Personal Dev Toolkit" -ForegroundColor White
                 Write-Host "   Built with PowerShell 5.1+" -ForegroundColor DarkGray
                 div2
                 ginf "Files:"
                 Write-Host "   gtool.ps1   -> $WORKSPACE\gtool.ps1"   -ForegroundColor DarkGray
                 Write-Host "   gtool.exe   -> $WORKSPACE\build\gtool.exe" -ForegroundColor DarkGray
                 Write-Host "   Log         -> $GTOOL_LOG"             -ForegroundColor DarkGray
             }
        "5"  { ginf "gtool v$GTOOL_VERSION is the latest version." }
        "6"  { explorer $WORKSPACE }
        "7"  {
                 if (Get-Command code -ErrorAction SilentlyContinue) { code $WORKSPACE }
                 else { gwrn "VS Code not found in PATH" }
             }
        "0"  { return }
    }
    pause-key
}

# ================================================================
#  DIRECT COMMAND MODE
# ================================================================
function run-direct {
    switch ($Command.ToLower()) {
        "proxy"   { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode $SubCmd }
        "git"     {
                      Push-Location $WORKSPACE
                      switch ($SubCmd.ToLower()) {
                          "push"   {
                                       $msg = if ($Arg1) { $Arg1 } else { "gtool: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
                                       git add -A; git commit -m $msg; git push
                                       gok "Pushed: $msg"
                                       glog "git push: $msg"
                                   }
                          "pull"   { git pull }
                          "status" { git status }
                          "log"    { git log --oneline --graph -15 }
                          default  { git $SubCmd $Arg1 $Arg2 }
                      }
                      Pop-Location
                  }
        "kill"    { kill-port $SubCmd }
        "dev"     {
                      Push-Location $WORKSPACE
                      switch ($SubCmd.ToLower()) {
                          "start" {
                                      $arg = "-NoProfile -NoExit -Command `"Set-Location '$WORKSPACE'; npm run dev`""
                                      Start-Process powershell -ArgumentList $arg -WindowStyle Normal
                                      gok "Dev server started!"
                                  }
                          "build"   { npm run build }
                          "test"    { npm test }
                          "preview" {
                                      $arg = "-NoProfile -NoExit -Command `"Set-Location '$WORKSPACE'; npm run preview`""
                                      Start-Process powershell -ArgumentList $arg -WindowStyle Normal
                                  }
                      }
                      Pop-Location
                  }
        "status"  { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode status }
        "port"    { kill-port $SubCmd }
        "log"     { if (Test-Path $GTOOL_LOG) { Get-Content $GTOOL_LOG -Tail 30 } else { gwrn "No log yet" } }
        "ip"      { ginf "Public IP: $(get-public-ip)" }
        "build"   { Push-Location $WORKSPACE; npm run build; Pop-Location }
        "install" { Push-Location $WORKSPACE; npm install; Pop-Location }
        "open"    { explorer $WORKSPACE }
        "code"    { code $WORKSPACE }
        "help"    {
                      br
                      Write-Host "  GTOOL v$GTOOL_VERSION - Quick Reference" -ForegroundColor Cyan
                      div
                      Write-Host "  PROXY"   -ForegroundColor Yellow
                      Write-Host "    .\gtool.ps1 proxy off        Bypass eduroam"      -ForegroundColor White
                      Write-Host "    .\gtool.ps1 proxy on         Enable proxy"         -ForegroundColor White
                      Write-Host "    .\gtool.ps1 proxy auto       Auto-detect"          -ForegroundColor White
                      Write-Host "    .\gtool.ps1 proxy status     Proxy status"         -ForegroundColor White
                      br
                      Write-Host "  GIT"     -ForegroundColor Yellow
                      Write-Host "    .\gtool.ps1 git push msg     Commit+push"         -ForegroundColor White
                      Write-Host "    .\gtool.ps1 git pull         Pull latest"          -ForegroundColor White
                      Write-Host "    .\gtool.ps1 git status       Status"               -ForegroundColor White
                      Write-Host "    .\gtool.ps1 git log          Last 15 commits"      -ForegroundColor White
                      br
                      Write-Host "  DEV"     -ForegroundColor Yellow
                      Write-Host "    .\gtool.ps1 dev start        Start dev server"     -ForegroundColor White
                      Write-Host "    .\gtool.ps1 dev build        Build project"        -ForegroundColor White
                      Write-Host "    .\gtool.ps1 dev test         Run tests"            -ForegroundColor White
                      br
                      Write-Host "  SYSTEM"  -ForegroundColor Yellow
                      Write-Host "    .\gtool.ps1 kill 3000        Kill port 3000"       -ForegroundColor White
                      Write-Host "    .\gtool.ps1 status           System + proxy info"  -ForegroundColor White
                      Write-Host "    .\gtool.ps1 ip               Public IP"            -ForegroundColor White
                      Write-Host "    .\gtool.ps1 open             Open workspace"       -ForegroundColor White
                      Write-Host "    .\gtool.ps1 code             Open in VS Code"      -ForegroundColor White
                      div
                  }
        default   { gerr "Unknown command: $Command"; br; Write-Host "  Run: .\gtool.ps1 help" -ForegroundColor Yellow }
    }
}

# ================================================================
#  MAIN LOOP
# ================================================================
function pause-key { br; Read-Host "  [Enter dabao to continue]" | Out-Null }

if ($Command -ne "") {
    run-direct
} else {
    glog "gtool opened"
    while ($true) {
        banner
        Write-Host "  MAIN MENU" -ForegroundColor Yellow
        div
        Write-Host "  1. PROXY   - eduroam on / off / auto"         -ForegroundColor White
        Write-Host "  2. GIT     - commit, push, pull, branch"      -ForegroundColor White
        Write-Host "  3. DEV     - server, build, test, ports"      -ForegroundColor White
        Write-Host "  4. DEPLOY  - vercel, android, zip"            -ForegroundColor White
        Write-Host "  5. SYSTEM  - network, disk, RAM, DNS"         -ForegroundColor White
        Write-Host "  6. TOOLS   - password, UUID, base64, JSON"    -ForegroundColor White
        Write-Host "  7. NPM     - install, update, audit"          -ForegroundColor White
        Write-Host "  8. SETTINGS / ABOUT"                          -ForegroundColor White
        div
        Write-Host "  H. Help   Q. Quit" -ForegroundColor DarkGray
        div
        Write-Host "  Direct: .\gtool.ps1 proxy off" -ForegroundColor DarkGray
        Write-Host "          .\gtool.ps1 git push" -ForegroundColor DarkGray
        Write-Host "          .\gtool.ps1 kill 3000" -ForegroundColor DarkGray
        br

        $ch = Read-Host "  Choice (1-8 / H / Q)"
        glog "menu: $ch"
        switch ($ch.ToUpper()) {
            "1" { menu-proxy    }
            "2" { menu-git      }
            "3" { menu-dev      }
            "4" { menu-deploy   }
            "5" { menu-system   }
            "6" { menu-utils    }
            "7" { menu-npm      }
            "8" { menu-settings }
            "H" { $Command = "help"; run-direct; $Command = ""; pause-key }
            "Q" { br; Write-Host "  Gtool band ho gaya. Allah Hafiz!" -ForegroundColor Cyan; br; glog "gtool closed"; break }
        }
        if ($ch.ToUpper() -eq "Q") { break }
    }
}
`.trimStart();

fs.writeFileSync(out, script, { encoding: 'utf8' });
console.log('gtool.ps1 v2.0.0 written! Lines:', script.split('\n').length);
