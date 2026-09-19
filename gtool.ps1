#Requires -Version 5.1
<#
.SYNOPSIS
    GTOOL v2.0.0 - Abdul Basit ka Personal Dev Toolkit
.DESCRIPTION
    All-in-one developer CLI: proxy, git, dev server, deploy, system tools, utils
.EXAMPLE
    .\gtool.ps1                    # Interactive menu
    .\gtool.ps1 proxy off          # Bypass eduroam proxy
    .\gtool.ps1 git push "msg"     # Quick commit and push
    .\gtool.ps1 kill 3000          # Kill process on port
    .\gtool.ps1 help               # Show all commands
#>
param(
    [string]$Command = "",
    [string]$SubCmd  = "",
    [string]$Arg1    = "",
    [string]$Arg2    = ""
)

$GTOOL_VERSION = "2.0.0"
$WORKSPACE     = "C:\Users\absh5\Documents\antigravity\fervent-planck"
$PROXYFIER     = "$WORKSPACE\scripts\proxyfier.ps1"
$PROXY_HOST    = "172.30.10.10"
$PROXY_PORT    = 3128
$GTOOL_LOG     = "$env:APPDATA\gtool\gtool.log"

function wr  ([string]$t, [ConsoleColor]$c = "White") { Write-Host $t -ForegroundColor $c }
function wrn ([string]$t, [ConsoleColor]$c = "White") { Write-Host $t -ForegroundColor $c -NoNewline }
function gok  ([string]$m) { Write-Host "  [OK]    $m" -ForegroundColor Green  }
function gerr ([string]$m) { Write-Host "  [ERROR] $m" -ForegroundColor Red    }
function ginf ([string]$m) { Write-Host "  [>>]    $m" -ForegroundColor Cyan   }
function gwrn ([string]$m) { Write-Host "  [WARN]  $m" -ForegroundColor Yellow }
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

function proxy-ok {
    return (Test-Connection -ComputerName $PROXY_HOST -Count 1 -Quiet -ErrorAction SilentlyContinue)
}

function get-public-ip {
    try {
        $r = Invoke-RestMethod -Uri "https://api.ipify.org?format=json" -TimeoutSec 4 -ErrorAction Stop
        return $r.ip
    } catch { return "N/A" }
}

function pause-key { br; Read-Host "  [Enter dabao to continue]" | Out-Null }

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
    } catch { gerr $_.Exception.Message }
}

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

# ====== MODULE 1: PROXY ======
function menu-proxy {
    banner
    wr "  [1] PROXY MANAGER" Yellow; div
    wr "  1. OFF         - Bypass eduroam (direct internet)" White
    wr "  2. ON          - Route through eduroam proxy"      White
    wr "  3. AUTO        - Auto-detect and configure"        White
    wr "  4. STATUS      - Show current state"               White
    wr "  5. PERSIST OFF - Bypass + save permanently"        White
    wr "  6. PERSIST ON  - Enable proxy + save permanently"  White
    wr "  0. Back"                                            DarkGray
    div
    $c = Read-Host "  Choose"
    switch ($c) {
        "1" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode off;    glog "proxy off" }
        "2" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode on;     glog "proxy on" }
        "3" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode auto;   glog "proxy auto" }
        "4" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode status }
        "5" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode off  -Persist }
        "6" { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode on   -Persist }
        "0" { return }
    }
    pause-key
}

# ====== MODULE 2: GIT ======
function menu-git {
    banner
    wr "  [2] GIT SHORTCUTS" Yellow; div
    wr "  1.  Status"                   White
    wr "  2.  Quick Commit + Push"       White
    wr "  3.  Pull"                      White
    wr "  4.  Log (last 15)"            White
    wr "  5.  List Branches"            White
    wr "  6.  New Branch + Switch"      White
    wr "  7.  Merge Branch"             White
    wr "  8.  Delete Branch"            White
    wr "  9.  Stash"                    White
    wr "  10. Stash Pop"                White
    wr "  11. Stash List"               White
    wr "  12. Clone Repo"               White
    wr "  13. Undo Last Commit (soft)"  White
    wr "  14. Diff"                     White
    wr "  0.  Back"                     DarkGray
    div
    $c = Read-Host "  Choose"
    Push-Location $WORKSPACE
    switch ($c) {
        "1"  { git status }
        "2"  {
                 $msg = Read-Host "  Commit message (Enter = auto)"
                 if ([string]::IsNullOrWhiteSpace($msg)) {
                     $changed = (git status --short | Measure-Object -Line).Lines
                     $msg = "gtool: update $changed files - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
                 }
                 git add -A; git commit -m $msg; git push
                 gok "Pushed! Message: $msg"; glog "git push: $msg"
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
        "9"  { $msg2 = Read-Host "  Stash name (optional)"; if ($msg2) { git stash push -m $msg2 } else { git stash }; gok "Stashed!" }
        "10" { git stash pop; gok "Stash popped!" }
        "11" { git stash list }
        "12" { $url = Read-Host "  Repo URL"; git clone $url; gok "Cloned!" }
        "13" {
                 $conf = Read-Host "  Undo last commit? Changes stay. (y/n)"
                 if ($conf -eq "y") { git reset --soft HEAD~1; gok "Commit undone (changes kept)" }
             }
        "14" { git diff }
        "0"  { Pop-Location; return }
    }
    Pop-Location; pause-key
}

# ====== MODULE 3: DEV SERVER ======
function menu-dev {
    banner
    wr "  [3] DEV SERVER" Yellow; div
    wr "  1.  Start Dev Server   (npm run dev)"     White
    wr "  2.  Build Production   (npm run build)"   White
    wr "  3.  Preview Build"                        White
    wr "  4.  Run Tests"                            White
    wr "  5.  npm install"                          White
    wr "  6.  Lint Code"                            White
    wr "  7.  Check Port"                           White
    wr "  8.  Kill Port"                            White
    wr "  9.  Open localhost in Browser"            White
    wr "  10. Show Active Dev Ports"               White
    wr "  0.  Back"                                 DarkGray
    div
    $c = Read-Host "  Choose"
    Push-Location $WORKSPACE
    switch ($c) {
        "1"  {
                 ginf "Starting dev server in new window..."
                 $devArg = "-NoProfile -NoExit -Command Set-Location '$WORKSPACE'; npm run dev"
                 Start-Process -FilePath "powershell.exe" -ArgumentList $devArg -WindowStyle Normal
                 Start-Sleep 1; gok "Dev server started! Check new window."
                 glog "dev server started"
             }
        "2"  { ginf "Building..."; npm run build; gok "Build complete! Check ./dist" }
        "3"  {
                 $prevArg = "-NoProfile -NoExit -Command Set-Location '$WORKSPACE'; npm run preview"
                 Start-Process -FilePath "powershell.exe" -ArgumentList $prevArg -WindowStyle Normal
                 gok "Preview started!"
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
                         ginf "  Process: $($proc.Name) PID $($_.OwningProcess)"
                     }
                 } else { gok "Port $port is FREE" }
             }
        "8"  { $p = Read-Host "  Port to kill"; kill-port $p }
        "9"  {
                 $port = Read-Host "  Port (default: 5173)"
                 if ([string]::IsNullOrWhiteSpace($port)) { $port = "5173" }
                 Start-Process "http://localhost:$port"; gok "Opened: localhost:$port"
             }
        "10" {
                 ginf "Active dev ports:"
                 @(3000,3001,4000,5000,5173,8000,8080,8888,9000) | ForEach-Object {
                     $conn2 = Get-NetTCPConnection -LocalPort $_ -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" }
                     if ($conn2) {
                         $proc = Get-Process -Id $conn2.OwningProcess -ErrorAction SilentlyContinue
                         Write-Host "  Port $_ -> $($proc.Name)" -ForegroundColor Yellow
                     }
                 }
             }
        "0"  { Pop-Location; return }
    }
    Pop-Location; pause-key
}

# ====== MODULE 4: DEPLOY ======
function menu-deploy {
    banner
    wr "  [4] BUILD & DEPLOY" Yellow; div
    wr "  1. Vite Build          - Production bundle"    White
    wr "  2. Vercel Deploy       - Production deploy"    White
    wr "  3. Vercel Preview      - Preview URL deploy"   White
    wr "  4. Android Debug APK"                          White
    wr "  5. Android Release APK"                        White
    wr "  6. Zip Project         - Backup to Desktop"    White
    wr "  7. Open dist Folder"                          White
    wr "  8. Clean Build Cache"                         White
    wr "  0. Back"                                       DarkGray
    div
    $c = Read-Host "  Choose"
    Push-Location $WORKSPACE
    switch ($c) {
        "1"  {
                 ginf "Building production bundle..."
                 npm run build
                 $size = (Get-ChildItem -Path "dist" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum / 1MB
                 gok "Build done! Size: $([math]::Round($size,2)) MB"
             }
        "2"  {
                 if (Get-Command vercel -ErrorAction SilentlyContinue) { vercel --prod }
                 else { gwrn "Installing Vercel CLI..."; npm install -g vercel; vercel --prod }
             }
        "3"  {
                 if (Get-Command vercel -ErrorAction SilentlyContinue) { vercel }
                 else { gwrn "Vercel not found. Run option 2 first." }
             }
        "4"  {
                 $ad = "$WORKSPACE\android-app"
                 if (Test-Path $ad) { Push-Location $ad; .\gradlew assembleDebug; gok "Debug APK built!"; Pop-Location }
                 else { gerr "android-app not found" }
             }
        "5"  {
                 $ad = "$WORKSPACE\android-app"
                 if (Test-Path $ad) { Push-Location $ad; .\gradlew assembleRelease; gok "Release APK built!"; Pop-Location }
                 else { gerr "android-app not found" }
             }
        "6"  {
                 $zipName = "gtool-backup-$(Get-Date -Format 'yyyy-MM-dd-HHmm').zip"
                 $outZip  = "$env:USERPROFILE\Desktop\$zipName"
                 ginf "Zipping project..."
                 $items = @("src","package.json","vite.config.js","gtool.ps1","scripts") |
                          ForEach-Object { "$WORKSPACE\$_" } | Where-Object { Test-Path $_ }
                 Compress-Archive -Path $items -DestinationPath $outZip -Force
                 gok "Zipped to Desktop: $zipName"
             }
        "7"  {
                 if (Test-Path "$WORKSPACE\dist") { explorer "$WORKSPACE\dist" }
                 else { gerr "dist/ not found. Build first!" }
             }
        "8"  {
                 ginf "Cleaning..."
                 Remove-Item "$WORKSPACE\dist" -Recurse -Force -ErrorAction SilentlyContinue
                 Remove-Item "$WORKSPACE\node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
                 gok "Cache cleared!"
             }
        "0"  { Pop-Location; return }
    }
    Pop-Location; pause-key
}

# ====== MODULE 5: SYSTEM ======
function menu-system {
    banner
    wr "  [5] SYSTEM TOOLS" Yellow; div
    wr "  1.  Network Info (IP, gateway, DNS)" White
    wr "  2.  All Listening Ports"             White
    wr "  3.  Kill Process on Port"            White
    wr "  4.  Disk Space"                      White
    wr "  5.  RAM Usage"                       White
    wr "  6.  CPU Usage"                       White
    wr "  7.  Flush DNS Cache"                 White
    wr "  8.  My Public IP"                    White
    wr "  9.  Ping a Host"                     White
    wr "  10. Top Processes"                   White
    wr "  11. Environment Variables"           White
    wr "  12. Firewall Status"                 White
    wr "  0.  Back"                            DarkGray
    div
    $c = Read-Host "  Choose"
    switch ($c) {
        "1"  {
                 ginf "Network Interfaces:"
                 Get-NetIPConfiguration | Where-Object { $_.IPv4Address -ne $null } | ForEach-Object {
                     br
                     Write-Host "  Interface : $($_.InterfaceAlias)" -ForegroundColor White
                     Write-Host "  IP Addr   : $($_.IPv4Address.IPAddress)" -ForegroundColor Cyan
                     if ($_.IPv4DefaultGateway) { Write-Host "  Gateway   : $($_.IPv4DefaultGateway.NextHop)" -ForegroundColor Cyan }
                     $dns = $_.DNSServer.ServerAddresses -join ", "
                     if ($dns) { Write-Host "  DNS       : $dns" -ForegroundColor DarkCyan }
                 }
                 br; ginf "Public IP: $(get-public-ip)"
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
                 $m = Get-CimInstance Win32_OperatingSystem
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
        "8"  { ginf "Public IP: $(get-public-ip)" }
        "9"  {
                 $h = Read-Host "  Host to ping"
                 $result = Test-Connection -ComputerName $h -Count 4 -ErrorAction SilentlyContinue
                 if ($result) {
                     $avg = [math]::Round(($result | Measure-Object ResponseTime -Average).Average, 1)
                     gok "$h reachable! Avg: $avg ms"
                 } else { gerr "$h is NOT reachable" }
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
                 @("HTTP_PROXY","HTTPS_PROXY","NO_PROXY","JAVA_HOME","ANDROID_HOME","PATH") | ForEach-Object {
                     $v = [System.Environment]::GetEnvironmentVariable($_, "User")
                     if (-not $v) { $v = [System.Environment]::GetEnvironmentVariable($_, "Machine") }
                     if ($v) { Write-Host "  $_ = $v" -ForegroundColor Cyan }
                     else    { Write-Host "  $_ = (not set)" -ForegroundColor DarkGray }
                 }
             }
        "12" {
                 Get-NetFirewallProfile | ForEach-Object {
                     $color = if ($_.Enabled) { "Yellow" } else { "Green" }
                     Write-Host "  Firewall $($_.Name): $(if($_.Enabled){'ENABLED'}else{'disabled'})" -ForegroundColor $color
                 }
             }
        "0"  { return }
    }
    pause-key
}

# ====== MODULE 6: TOOLS ======
function menu-utils {
    banner
    wr "  [6] QUICK TOOLS" Yellow; div
    wr "  1.  Password Generator"  White
    wr "  2.  Base64 Encode"       White
    wr "  3.  Base64 Decode"       White
    wr "  4.  UUID / GUID"         White
    wr "  5.  File Search"         White
    wr "  6.  Unix Timestamp"      White
    wr "  7.  JSON Pretty Print"   White
    wr "  8.  SHA256 File Hash"    White
    wr "  9.  URL Encode"          White
    wr "  10. URL Decode"          White
    wr "  11. Random Hex Color"    White
    wr "  12. Word / Line Counter" White
    wr "  13. Open System Apps"    White
    wr "  0.  Back"                DarkGray
    div
    $c = Read-Host "  Choose"
    switch ($c) {
        "1"  {
                 $len  = Read-Host "  Length (default 20)"
                 $spec = Read-Host "  Special chars? (y/n, default y)"
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
        "4"  { $u = [System.Guid]::NewGuid().ToString(); gok "UUID: $u"; $u | Set-Clipboard; ginf "Clipboard mein copy!" }
        "5"  {
                 $name = Read-Host "  File name (partial ok)"
                 $srch = Read-Host "  Search path (Enter = workspace)"
                 if ([string]::IsNullOrWhiteSpace($srch)) { $srch = $WORKSPACE }
                 ginf "Searching in $srch..."
                 $results = Get-ChildItem -Path $srch -Recurse -Filter "*$name*" -ErrorAction SilentlyContinue
                 if ($results) { $results | Select-Object FullName, @{N="KB";E={[math]::Round($_.Length/1KB,1)}}, LastWriteTime | Format-Table -AutoSize }
                 else          { gwrn "No files found: *$name*" }
             }
        "6"  {
                 $ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
                 $ms = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                 gok "Unix Seconds: $ts"
                 ginf "Unix Ms     : $ms"
                 $ts | Set-Clipboard
             }
        "7"  {
                 $j = Read-Host "  Paste JSON"
                 try   { $pretty = $j | ConvertFrom-Json | ConvertTo-Json -Depth 20; Write-Host $pretty -ForegroundColor Cyan }
                 catch { gerr "Invalid JSON" }
             }
        "8"  {
                 $f = Read-Host "  File path"
                 if (Test-Path $f) { $h = Get-FileHash -Path $f -Algorithm SHA256; gok "SHA256: $($h.Hash)"; $h.Hash | Set-Clipboard }
                 else              { gerr "File not found: $f" }
             }
        "9"  { $t = Read-Host "  URL to encode"; $e = [Uri]::EscapeDataString($t); gok "Encoded: $e"; $e | Set-Clipboard }
        "10" { $t = Read-Host "  URL to decode"; $d = [Uri]::UnescapeDataString($t); gok "Decoded: $d"; $d | Set-Clipboard }
        "11" {
                 $r = Get-Random -Max 255; $g = Get-Random -Max 255; $b_ = Get-Random -Max 255
                 $hex = "#{0:X2}{1:X2}{2:X2}" -f $r,$g,$b_
                 Write-Host "  Color: $hex  (R=$r G=$g B=$b_)" -ForegroundColor Magenta
                 $hex | Set-Clipboard
             }
        "12" {
                 $text = Read-Host "  Paste text or file path"
                 if (Test-Path $text) { $content = Get-Content $text -Raw }
                 else                 { $content = $text }
                 $words = ($content -split '\s+' | Where-Object { $_ -ne "" }).Count
                 $lines = ($content -split "`n").Count
                 ginf "Words: $words  |  Lines: $lines  |  Chars: $($content.Length)"
             }
        "13" {
                 wr "  1.Calculator  2.Notepad  3.Paint  4.Task Manager  5.Registry" White
                 $app = Read-Host "  Choose"
                 switch ($app) {
                     "1" { Start-Process calc }
                     "2" { Start-Process notepad }
                     "3" { Start-Process mspaint }
                     "4" { Start-Process taskmgr }
                     "5" { Start-Process regedit }
                 }
             }
        "0"  { return }
    }
    pause-key
}

# ====== MODULE 7: NPM ======
function menu-npm {
    banner
    wr "  [7] NPM / NODE TOOLS" Yellow; div
    wr "  1.  npm install"              White
    wr "  2.  npm update"              White
    wr "  3.  npm audit fix"           White
    wr "  4.  npm list (installed)"    White
    wr "  5.  Install package"         White
    wr "  6.  Remove package"          White
    wr "  7.  Clear npm cache"         White
    wr "  8.  Node + npm versions"     White
    wr "  9.  Global packages list"    White
    wr "  10. npx command"             White
    wr "  11. Run npm script"          White
    wr "  0.  Back"                    DarkGray
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
                 if ($dev -eq "y") { npm install --save-dev $pkg } else { npm install $pkg }
                 gok "Installed: $pkg"
             }
        "6"  { $pkg = Read-Host "  Package to remove"; npm uninstall $pkg; gok "Removed: $pkg" }
        "7"  { npm cache clean --force; gok "npm cache cleared!" }
        "8"  { ginf "Node: $(node --version)  |  npm: $(npm --version)" }
        "9"  { npm list -g --depth=0 }
        "10" { $cmd = Read-Host "  npx command (without 'npx')"; Invoke-Expression "npx $cmd" }
        "11" {
                 ginf "Available scripts:"; npm run 2>&1
                 $script_ = Read-Host "  Script name to run"
                 if ($script_) { npm run $script_ }
             }
        "0"  { Pop-Location; return }
    }
    Pop-Location; pause-key
}

# ====== MODULE 8: SETTINGS ======
function menu-settings {
    banner
    wr "  [8] SETTINGS & INFO" Yellow; div
    wr "  1. View gtool log"             White
    wr "  2. Clear gtool log"            White
    wr "  3. About gtool"                White
    wr "  4. Open workspace in Explorer" White
    wr "  5. Open workspace in VS Code"  White
    wr "  6. gtool.ps1 Quick Edit"       White
    wr "  0. Back"                       DarkGray
    div
    $c = Read-Host "  Choose"
    switch ($c) {
        "1"  { if (Test-Path $GTOOL_LOG) { Get-Content $GTOOL_LOG -Tail 50 } else { gwrn "No log file yet." } }
        "2"  { if (Test-Path $GTOOL_LOG) { Remove-Item $GTOOL_LOG -Force; gok "Log cleared!" } else { gwrn "No log." } }
        "3"  {
                 br; div2
                 Write-Host "   GTOOL v$GTOOL_VERSION  -  Abdul Basit Dev Toolkit" -ForegroundColor Cyan
                 Write-Host "   Built with PowerShell 5.1+" -ForegroundColor DarkGray
                 div2; br
                 ginf "Workspace : $WORKSPACE"
                 ginf "Script    : $WORKSPACE\gtool.ps1"
                 ginf "EXE       : $WORKSPACE\build\gtool.exe"
                 ginf "Log       : $GTOOL_LOG"
             }
        "4"  { explorer $WORKSPACE }
        "5"  { if (Get-Command code -ErrorAction SilentlyContinue) { code $WORKSPACE } else { gwrn "VS Code not in PATH" } }
        "6"  { if (Get-Command code -ErrorAction SilentlyContinue) { code "$WORKSPACE\gtool.ps1" } else { notepad "$WORKSPACE\gtool.ps1" } }
        "0"  { return }
    }
    pause-key
}

# ====== DIRECT COMMAND MODE ======
function run-direct {
    switch ($Command.ToLower()) {
        "proxy"   { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode $SubCmd }
        "git"     {
                      Push-Location $WORKSPACE
                      switch ($SubCmd.ToLower()) {
                          "push"   {
                                       $msg = if ($Arg1) { $Arg1 } else { "gtool: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
                                       git add -A; git commit -m $msg; git push
                                       gok "Pushed: $msg"; glog "git push: $msg"
                                   }
                          "pull"   { git pull }
                          "status" { git status }
                          "log"    { git log --oneline --graph -15 }
                          default  { git $SubCmd $Arg1 $Arg2 }
                      }
                      Pop-Location
                  }
        "kill"    { kill-port $SubCmd }
        "port"    { kill-port $SubCmd }
        "dev"     {
                      Push-Location $WORKSPACE
                      switch ($SubCmd.ToLower()) {
                          "start"   {
                                        $devA = "-NoProfile -NoExit -Command Set-Location '$WORKSPACE'; npm run dev"
                                        Start-Process -FilePath "powershell.exe" -ArgumentList $devA -WindowStyle Normal
                                        gok "Dev server started!"
                                    }
                          "build"   { npm run build }
                          "test"    { npm test }
                          "preview" {
                                        $prevA = "-NoProfile -NoExit -Command Set-Location '$WORKSPACE'; npm run preview"
                                        Start-Process -FilePath "powershell.exe" -ArgumentList $prevA -WindowStyle Normal
                                    }
                      }
                      Pop-Location
                  }
        "build"   { Push-Location $WORKSPACE; npm run build; Pop-Location }
        "install" { Push-Location $WORKSPACE; npm install; Pop-Location }
        "status"  { & powershell -NoProfile -ExecutionPolicy Bypass -File $PROXYFIER -Mode status }
        "log"     { if (Test-Path $GTOOL_LOG) { Get-Content $GTOOL_LOG -Tail 30 } else { gwrn "No log yet" } }
        "ip"      { ginf "Public IP: $(get-public-ip)" }
        "open"    { explorer $WORKSPACE }
        "code"    { code $WORKSPACE }
        "help"    {
                      br
                      Write-Host "  GTOOL v$GTOOL_VERSION - Quick Reference" -ForegroundColor Cyan
                      div
                      wr "  PROXY" Yellow
                      wr "    .\gtool.ps1 proxy off        Bypass eduroam"     White
                      wr "    .\gtool.ps1 proxy on         Enable proxy"        White
                      wr "    .\gtool.ps1 proxy auto       Auto-detect"         White
                      wr "    .\gtool.ps1 proxy status     Show status"         White
                      br
                      wr "  GIT" Yellow
                      wr "    .\gtool.ps1 git push msg     Commit + push"      White
                      wr "    .\gtool.ps1 git pull         Pull latest"         White
                      wr "    .\gtool.ps1 git status       Status"              White
                      wr "    .\gtool.ps1 git log          Last 15 commits"     White
                      br
                      wr "  DEV" Yellow
                      wr "    .\gtool.ps1 dev start        Start dev server"    White
                      wr "    .\gtool.ps1 dev build        Build project"       White
                      wr "    .\gtool.ps1 dev test         Run tests"           White
                      br
                      wr "  SYSTEM" Yellow
                      wr "    .\gtool.ps1 kill 3000        Kill port 3000"      White
                      wr "    .\gtool.ps1 status           System + proxy info" White
                      wr "    .\gtool.ps1 ip               Public IP"           White
                      wr "    .\gtool.ps1 open             Open workspace"      White
                      wr "    .\gtool.ps1 build            Production build"    White
                      div
                  }
        default   { gerr "Unknown: $Command"; br; wr "  Run: .\gtool.ps1 help" Yellow }
    }
}

# ====== MAIN LOOP ======
if ($Command -ne "") {
    run-direct
} else {
    glog "gtool opened"
    while ($true) {
        banner
        wr "  MAIN MENU" Yellow; div
        wr "  1. PROXY   - eduroam on / off / auto"         White
        wr "  2. GIT     - commit, push, pull, branch"      White
        wr "  3. DEV     - server, build, test, ports"      White
        wr "  4. DEPLOY  - vercel, android, backup zip"     White
        wr "  5. SYSTEM  - network, disk, RAM, DNS"         White
        wr "  6. TOOLS   - password, UUID, base64, JSON"    White
        wr "  7. NPM     - install, update, audit"          White
        wr "  8. SETTINGS / ABOUT"                          White
        div
        wr "  H. Help    Q. Quit" DarkGray
        div
        wr "  Direct: .\gtool.ps1 proxy off  |  .\gtool.ps1 git push  |  .\gtool.ps1 kill 3000" DarkGray
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
