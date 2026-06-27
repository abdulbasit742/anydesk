# ============================================================
#  start-live-demo.ps1  —  RemoteDesk Full Launch Automation
#  Save this file at:  C:\RemoteDeskLive\start-live-demo.ps1
#  Run with:
#    PowerShell -ExecutionPolicy Bypass -File C:\RemoteDeskLive\start-live-demo.ps1
# ============================================================

$ErrorActionPreference = "Stop"

function Write-Green($m)  { Write-Host $m -ForegroundColor Green }
function Write-Yellow($m) { Write-Host $m -ForegroundColor Yellow }
function Write-Red($m)    { Write-Host $m -ForegroundColor Red }
function Write-Cyan($m)   { Write-Host $m -ForegroundColor Cyan }

Write-Cyan "`n=================================================="
Write-Cyan "   RemoteDesk Live Demo Launcher"
Write-Cyan "   $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Cyan "==================================================`n"

# ─── 1. Validate repo paths ──────────────────────────────────
$API_DIR  = "C:\RemoteDeskLive\anydesk"
$DASH_DIR = "C:\RemoteDeskLive\anydesklovable"

foreach ($dir in @($API_DIR, $DASH_DIR)) {
    if (-not (Test-Path $dir)) {
        Write-Red "FATAL: Repo not found: $dir"
        Write-Yellow "Clone the repo there and re-run."
        exit 1
    }
}
Write-Green "[1] Repo paths validated."

# ─── 2. Detect cloudflared ───────────────────────────────────
$CLOUDFLARED_OK = $false
try {
    $cfv = (& cloudflared --version 2>&1) -join " "
    if ($cfv -match "cloudflared") {
        $CLOUDFLARED_OK = $true
        Write-Green "[2] cloudflared found: $cfv"
    }
} catch {
    Write-Yellow "[2] cloudflared not found — LAN-only mode."
}

# ─── 3. Kill old RemoteDesk processes on demo ports ──────────
Write-Cyan "[3] Clearing old processes on demo ports..."
$DEMO_PORTS        = @(4000,8080,8081,8082,8083,8084,8085)
$SAFE_PIDS         = @(0,4)
$DEMO_PROC_NAMES   = @("node","npm","vite","tsx","pnpm","npx")

foreach ($port in $DEMO_PORTS) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($c in $conns) {
            $pid_ = $c.OwningProcess
            if ($pid_ -in $SAFE_PIDS) { continue }
            try {
                $proc = Get-Process -Id $pid_ -ErrorAction SilentlyContinue
                if ($proc -and ($proc.Name -in $DEMO_PROC_NAMES)) {
                    Write-Yellow "  Killing $($proc.Name) PID $pid_ (port $port)"
                    Stop-Process -Id $pid_ -Force -ErrorAction SilentlyContinue
                }
            } catch {}
        }
    }
}
Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue |
    ForEach-Object { Write-Yellow "  Killing cloudflared PID $($_.Id)"; Stop-Process -Id $_.Id -Force }
Start-Sleep -Seconds 2
Write-Green "[3] Port cleanup done."

# ─── 4. Patch Vite config for Cloudflare tunnel hosts ────────
Write-Cyan "[4] Checking Vite config for Cloudflare allowedHosts..."
$VITE_CONFIG = "$DASH_DIR\vite.config.ts"
if (Test-Path $VITE_CONFIG) {
    $vc = Get-Content $VITE_CONFIG -Raw
    if ($vc -notmatch "trycloudflare") {
        if ($vc -match "vite:\s*\{" -and $vc -notmatch "server:\s*\{") {
            # @lovable.dev/vite-tanstack-config style
            $vc = $vc -replace "(vite:\s*\{)", "`$1`n      server: {`n        host: '0.0.0.0',`n        allowedHosts: ['.trycloudflare.com']`n      },"
        } elseif ($vc -match "export default defineConfig" -and $vc -notmatch "server:\s*\{") {
            $vc = $vc -replace "(export default defineConfig\s*\(\s*\{)", "`$1`n  server: {`n    host: '0.0.0.0',`n    allowedHosts: ['.trycloudflare.com']`n  },"
        } else {
            Write-Yellow "  Could not auto-patch vite.config.ts — add allowedHosts manually if tunnel URL is blocked."
        }
        Set-Content $VITE_CONFIG -Value $vc -Encoding UTF8
        Write-Green "  vite.config.ts patched."
    } else {
        Write-Green "  vite.config.ts already allows Cloudflare hosts."
    }
} else {
    Write-Yellow "  vite.config.ts not found at $VITE_CONFIG — skipping."
}

# ─── 5. Write initial API .env & start API ───────────────────
Write-Cyan "[5] Writing API .env and starting API on port 4000..."
$API_ENV_PATH = "$API_DIR\apps\api\.env"
@"
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
JWT_SECRET=dev-access-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
BETA_SOCKET_ENABLED=true
BETA_WEBRTC_SIGNALING_ENABLED=true
DEV_IN_MEMORY_FALLBACK=true
"@ | Set-Content -Path $API_ENV_PATH -Encoding UTF8

$API_JOB = Start-Job -Name "RemoteDesk-API" -ScriptBlock {
    param($d); Set-Location $d; npm run dev --workspace=apps/api 2>&1
} -ArgumentList $API_DIR

Write-Yellow "  Waiting for API /health (up to 60s)..."
$API_READY = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 2
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:4000/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($r.StatusCode -eq 200) { $API_READY = $true; break }
    } catch {}
}

if ($API_READY) { Write-Green "  API healthy at http://localhost:4000" }
else {
    Write-Red "  API failed to start. Last output:"
    Receive-Job $API_JOB | Select-Object -Last 30 | ForEach-Object { Write-Host "    $_" }
    exit 1
}

# ─── 6. API Cloudflare tunnel ────────────────────────────────
$API_PUBLIC_URL = $null
$TUNNEL_BLOCKED = $false

if ($CLOUDFLARED_OK) {
    Write-Cyan "[6] Starting Cloudflare tunnel for API..."
    $API_LOG = "$env:TEMP\rd_api_tunnel.log"
    if (Test-Path $API_LOG) { Remove-Item $API_LOG }

    $API_TUNNEL_JOB = Start-Job -Name "RemoteDesk-API-Tunnel" -ScriptBlock {
        param($log); cloudflared tunnel --url http://localhost:4000 2>&1 | Tee-Object -FilePath $log
    } -ArgumentList $API_LOG

    $deadline = (Get-Date).AddSeconds(30)
    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Seconds 2
        if (Test-Path $API_LOG) {
            $txt = Get-Content $API_LOG -Raw -ErrorAction SilentlyContinue
            if ($txt -match "(https://[a-z0-9\-]+\.trycloudflare\.com)") { $API_PUBLIC_URL = $Matches[1]; break }
            if ($txt -match "context deadline|ERR_PROXY|403 Forbidden|connection refused|timeout") { $TUNNEL_BLOCKED = $true; break }
        }
    }

    if ($API_PUBLIC_URL) {
        Write-Green "  API public URL: $API_PUBLIC_URL"
    } else {
        $TUNNEL_BLOCKED = $true
        Write-Yellow "  API tunnel blocked/timed out — continuing in LAN mode."
        Stop-Job $API_TUNNEL_JOB -ErrorAction SilentlyContinue
        Remove-Job $API_TUNNEL_JOB -ErrorAction SilentlyContinue
    }
} else {
    Write-Yellow "[6] Skipping API tunnel (cloudflared unavailable)."
}

# ─── Detect LAN IP ───────────────────────────────────────────
$LAN_IP = (Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.InterfaceAlias -notmatch "Loopback|Pseudo|Bluetooth|vEthernet" -and $_.IPAddress -notmatch "^169\." } |
    Sort-Object PrefixLength -Descending | Select-Object -First 1).IPAddress
if (-not $LAN_IP) { $LAN_IP = "127.0.0.1" }
Write-Cyan "  Detected LAN IP: $LAN_IP"

# ─── 7. Dashboard .env ───────────────────────────────────────
Write-Cyan "[7] Writing dashboard .env..."
$VITE_API = if ($API_PUBLIC_URL) { $API_PUBLIC_URL } else { "http://localhost:4000" }
@"
VITE_API_URL=$VITE_API
VITE_SIGNALING_URL=$VITE_API
"@ | Set-Content -Path "$DASH_DIR\.env" -Encoding UTF8
Write-Green "  Dashboard .env  →  VITE_API_URL=$VITE_API"

# ─── 8. Start dashboard & detect port ────────────────────────
Write-Cyan "[8] Starting dashboard (npm run dev)..."
$DASH_LOG = "$env:TEMP\rd_dash.log"
if (Test-Path $DASH_LOG) { Remove-Item $DASH_LOG }

$DASH_JOB = Start-Job -Name "RemoteDesk-Dashboard" -ScriptBlock {
    param($d, $log); Set-Location $d; npm run dev 2>&1 | Tee-Object -FilePath $log
} -ArgumentList $DASH_DIR, $DASH_LOG

$DASH_PORT = $null
$deadline  = (Get-Date).AddSeconds(40)
while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 2
    if (Test-Path $DASH_LOG) {
        $txt = Get-Content $DASH_LOG -Raw -ErrorAction SilentlyContinue
        if ($txt -match "Local:\s+http://localhost:(\d+)") { $DASH_PORT = $Matches[1]; break }
    }
}
if (-not $DASH_PORT) { $DASH_PORT = "8080" }
Write-Green "  Dashboard on port $DASH_PORT  →  http://localhost:$DASH_PORT"

# ─── 9. Dashboard Cloudflare tunnel ──────────────────────────
$DASH_PUBLIC_URL = $null
if ($API_PUBLIC_URL -and -not $TUNNEL_BLOCKED) {
    Write-Cyan "[9] Starting Cloudflare tunnel for dashboard (port $DASH_PORT)..."
    $DASH_TLOG = "$env:TEMP\rd_dash_tunnel.log"
    if (Test-Path $DASH_TLOG) { Remove-Item $DASH_TLOG }

    $DASH_TUNNEL_JOB = Start-Job -Name "RemoteDesk-Dash-Tunnel" -ScriptBlock {
        param($port,$log); cloudflared tunnel --url "http://localhost:$port" 2>&1 | Tee-Object -FilePath $log
    } -ArgumentList $DASH_PORT, $DASH_TLOG

    $deadline = (Get-Date).AddSeconds(30)
    while ((Get-Date) -lt $deadline) {
        Start-Sleep -Seconds 2
        if (Test-Path $DASH_TLOG) {
            $txt = Get-Content $DASH_TLOG -Raw -ErrorAction SilentlyContinue
            if ($txt -match "(https://[a-z0-9\-]+\.trycloudflare\.com)") { $DASH_PUBLIC_URL = $Matches[1]; break }
            if ($txt -match "context deadline|ERR_PROXY|403|timeout") { break }
        }
    }
    if ($DASH_PUBLIC_URL) { Write-Green "  Dashboard public URL: $DASH_PUBLIC_URL" }
    else                  { Write-Yellow "  Dashboard tunnel failed; using local/LAN mode." }
}

# ─── 10. Update API CORS & restart if dashboard got public URL ─
if ($DASH_PUBLIC_URL) {
    Write-Cyan "[10] Updating API CORS_ORIGIN → $DASH_PUBLIC_URL and restarting API..."
    @"
PORT=4000
NODE_ENV=development
CORS_ORIGIN=$DASH_PUBLIC_URL
JWT_SECRET=dev-access-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
BETA_SOCKET_ENABLED=true
BETA_WEBRTC_SIGNALING_ENABLED=true
DEV_IN_MEMORY_FALLBACK=true
"@ | Set-Content -Path $API_ENV_PATH -Encoding UTF8

    Stop-Job  $API_JOB -ErrorAction SilentlyContinue
    Remove-Job $API_JOB -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    $API_JOB = Start-Job -Name "RemoteDesk-API-v2" -ScriptBlock {
        param($d); Set-Location $d; npm run dev --workspace=apps/api 2>&1
    } -ArgumentList $API_DIR

    $healthBase = if ($API_PUBLIC_URL) { $API_PUBLIC_URL } else { "http://localhost:4000" }
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 2
        try {
            $r = Invoke-WebRequest -Uri "$healthBase/health" -UseBasicParsing -TimeoutSec 4 -ErrorAction SilentlyContinue
            if ($r.StatusCode -eq 200) { Write-Green "  API restarted and healthy."; break }
        } catch {}
    }
}

# ─── 11. LAN summary ─────────────────────────────────────────
if (-not $API_PUBLIC_URL) {
    Write-Yellow "`n[11] Running in LAN / Local mode:"
    Write-Yellow "  API:       http://$LAN_IP`:4000"
    Write-Yellow "  Dashboard: http://$LAN_IP`:$DASH_PORT"
}

# ─── 12. API route verification ──────────────────────────────
Write-Cyan "`n[12] Verifying API endpoints..."
$BASE = if ($API_PUBLIC_URL) { $API_PUBLIC_URL } else { "http://localhost:4000" }

function Invoke-Check($method, $uri, $body=$null, $hdrs=$null) {
    try {
        $p = @{ Method=$method; Uri=$uri; UseBasicParsing=$true; TimeoutSec=10; ErrorAction="SilentlyContinue" }
        if ($hdrs) { $p.Headers = $hdrs }
        if ($body) { $p.Body = ($body | ConvertTo-Json -Compress); $p.ContentType = "application/json" }
        $r = Invoke-WebRequest @p
        return @{ code=$r.StatusCode; body=$r.Content }
    } catch {
        $c = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 0 }
        return @{ code=$c; body=$_.Exception.Message }
    }
}

$ts    = [int](Get-Date -UFormat %s)
$email = "demo$ts@remotedesk.test"
$pw    = "Demo@1234!"

$h  = Invoke-Check "GET"  "$BASE/health"
$s  = Invoke-Check "POST" "$BASE/api/auth/signup" @{email=$email;password=$pw;name="Demo User"}
$l  = Invoke-Check "POST" "$BASE/api/auth/login"  @{email=$email;password=$pw}

$TOKEN = $null
try   { $TOKEN = ($l.body | ConvertFrom-Json).accessToken } catch {}
if (-not $TOKEN) { try { $TOKEN = ($l.body | ConvertFrom-Json).token } catch {} }
$AH = if ($TOKEN) { @{Authorization="Bearer $TOKEN";"Content-Type"="application/json"} } else { @{} }

$dv  = Invoke-Check "GET" "$BASE/api/devices"             -hdrs $AH
$sh  = Invoke-Check "GET" "$BASE/api/sessions/history"    -hdrs $AH
$cat = Invoke-Check "GET" "$BASE/api/connectors/catalog"  -hdrs $AH
$lr  = Invoke-Check "GET" "$BASE/api/launch/readiness"    -hdrs $AH

Write-Host "  GET  /health                → $($h.code)"
Write-Host "  POST /api/auth/signup       → $($s.code)"
Write-Host "  POST /api/auth/login        → $($l.code)"
Write-Host "  GET  /api/devices           → $($dv.code)"
Write-Host "  GET  /api/sessions/history  → $($sh.code)"
Write-Host "  GET  /api/connectors/catalog→ $($cat.code)"
Write-Host "  GET  /api/launch/readiness  → $($lr.code)"

# ─── 13. Dashboard signup links ──────────────────────────────
Write-Cyan "`n[13] Dashboard access:"
Write-Green "  Local:  http://localhost:$DASH_PORT/signup"
Write-Green "  LAN:    http://$LAN_IP`:$DASH_PORT/signup"
if ($DASH_PUBLIC_URL) { Write-Green "  Public: $DASH_PUBLIC_URL/signup" }

# ─── 14. Write status report ─────────────────────────────────
$tunnelResult = if ($DASH_PUBLIC_URL -and $API_PUBLIC_URL) { "SUCCESS – both tunnels active" }
                elseif ($TUNNEL_BLOCKED)                   { "BLOCKED – university proxy (403/timeout); use phone hotspot or home Wi-Fi" }
                elseif ($API_PUBLIC_URL)                   { "PARTIAL – API tunnel OK, dashboard tunnel failed" }
                else                                       { "FAILED – cloudflared not available or network blocked" }

$nextStep = if ($DASH_PUBLIC_URL)   { "Public demo live: share $DASH_PUBLIC_URL" }
            elseif ($TUNNEL_BLOCKED) { "Connect to phone hotspot / home Wi-Fi and re-run script" }
            else                     { "Use LAN URL on same network: http://$LAN_IP`:$DASH_PORT" }

$md = @"
# RemoteDesk — Live Demo Status
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## URLs

| Endpoint          | URL |
|-------------------|-----|
| API Local         | http://localhost:4000 |
| API LAN           | http://$LAN_IP`:4000 |
| API Public        | $(if($API_PUBLIC_URL){$API_PUBLIC_URL}else{'N/A'}) |
| Dashboard Local   | http://localhost:$DASH_PORT |
| Dashboard LAN     | http://$LAN_IP`:$DASH_PORT |
| Dashboard Public  | $(if($DASH_PUBLIC_URL){$DASH_PUBLIC_URL}else{'N/A'}) |

## API Verification

| Route | Status |
|-------|--------|
| GET /health | $($h.code) |
| POST /api/auth/signup | $($s.code) |
| POST /api/auth/login | $($l.code) |
| GET /api/devices | $($dv.code) |
| GET /api/sessions/history | $($sh.code) |
| GET /api/connectors/catalog | $($cat.code) |
| GET /api/launch/readiness | $($lr.code) |

Test email: $email

## Tunnel Result
$tunnelResult

## Next Step
$nextStep

## Remaining Blockers
1. University Wi-Fi blocks public tunnels (cloudflared/ngrok/SSH) — use phone hotspot.
2. No TURN server — WebRTC won't cross strict NAT in production.
3. DEV_IN_MEMORY_FALLBACK=true — data resets on restart; add PostgreSQL for persistence.
4. HTTP-only LAN demo — browser may block screen/cam share; deploy to HTTPS for production.
"@

New-Item -ItemType Directory -Force -Path "C:\RemoteDeskLive" | Out-Null
$md | Set-Content -Path "C:\RemoteDeskLive\LIVE_DEMO_STATUS.md" -Encoding UTF8
Write-Green "`n[14] Status report saved: C:\RemoteDeskLive\LIVE_DEMO_STATUS.md"

# ─── 15. Final summary ───────────────────────────────────────
Write-Cyan "`n=================================================="
Write-Cyan "   COMPLETE"
Write-Cyan "==================================================`n"
Write-Host "Script:            C:\RemoteDeskLive\start-live-demo.ps1"
Write-Host "API local:         http://localhost:4000"
if ($API_PUBLIC_URL)  { Write-Host "API public:        $API_PUBLIC_URL" -ForegroundColor Green }
Write-Host "Dashboard local:   http://localhost:$DASH_PORT"
Write-Host "Dashboard LAN:     http://$LAN_IP`:$DASH_PORT" -ForegroundColor Cyan
if ($DASH_PUBLIC_URL) { Write-Host "Dashboard public:  $DASH_PUBLIC_URL" -ForegroundColor Green }
Write-Host "Signup result:     $($s.code)"
Write-Host "Login  result:     $($l.code)"
Write-Host "Tunnel:            $tunnelResult"
Write-Host ""
Write-Yellow "Next: $nextStep"
Write-Host ""
Write-Green "Open: http://localhost:$DASH_PORT/signup"
