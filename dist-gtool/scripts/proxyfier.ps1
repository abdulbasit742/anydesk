
# ============================================================
#  PROXYFIER - eduroam Proxy Manager for Dev Tools
#  Usage:
#    .\scripts\proxyfier.ps1 -Mode on      # Route tools THROUGH eduroam proxy
#    .\scripts\proxyfier.ps1 -Mode off     # BYPASS proxy (direct internet)
#    .\scripts\proxyfier.ps1 -Mode auto    # Auto-detect eduroam and decide
#    .\scripts\proxyfier.ps1 -Mode status  # Show current state
#    Add -Persist to save settings permanently
# ============================================================

param(
    [ValidateSet("on","off","auto","status")]
    [string]$Mode = "auto",
    [string]$ProxyHost = "172.30.10.10",
    [int]$ProxyPort = 3128,
    [switch]$Persist
)

$ErrorActionPreference = "Stop"
$PROXY_URL = "http://$($ProxyHost):$($ProxyPort)"

# Colors and output helpers
function Write-Header  { Write-Host "`n  PROXYFIER - eduroam Dev Proxy Manager" -ForegroundColor Cyan }
function Write-OK  ($msg) { Write-Host "  [OK]   $msg" -ForegroundColor Green }
function Write-WARN($msg) { Write-Host "  [WARN] $msg" -ForegroundColor Yellow }
function Write-INFO($msg) { Write-Host "  [INFO] $msg" -ForegroundColor Cyan }
function Write-ERR ($msg) { Write-Host "  [ERR]  $msg" -ForegroundColor Red }
function Write-Sep        { Write-Host "  -----------------------------------------------" -ForegroundColor DarkGray }

# Detect if on eduroam network
function Test-OnEduroam {
    try {
        $ping = Test-Connection -ComputerName $ProxyHost -Count 1 -Quiet -ErrorAction SilentlyContinue
        return $ping
    } catch {
        return $false
    }
}

# Set/clear environment variables for current process and optionally user scope
function Set-ProxyEnvVars([bool]$Enable) {
    $vars = @("HTTP_PROXY","HTTPS_PROXY","http_proxy","https_proxy","ALL_PROXY","all_proxy")
    if ($Enable) {
        foreach ($v in $vars) {
            [System.Environment]::SetEnvironmentVariable($v, $PROXY_URL, "Process")
            if ($Persist) { [System.Environment]::SetEnvironmentVariable($v, $PROXY_URL, "User") }
        }
        $noProxy = "localhost,127.0.0.1,::1,.local,192.168.0.0/16,10.0.0.0/8"
        [System.Environment]::SetEnvironmentVariable("NO_PROXY", $noProxy, "Process")
        [System.Environment]::SetEnvironmentVariable("no_proxy", $noProxy, "Process")
        if ($Persist) {
            [System.Environment]::SetEnvironmentVariable("NO_PROXY", $noProxy, "User")
            [System.Environment]::SetEnvironmentVariable("no_proxy", $noProxy, "User")
        }
        Write-OK "Env vars set to $PROXY_URL"
    } else {
        foreach ($v in ($vars + @("NO_PROXY","no_proxy"))) {
            [System.Environment]::SetEnvironmentVariable($v, $null, "Process")
            if ($Persist) { [System.Environment]::SetEnvironmentVariable($v, $null, "User") }
        }
        Write-OK "Env vars cleared (direct access)"
    }
}

# Windows Internet Settings (WinINET - affects IE/Edge/Chrome)
function Set-WindowsProxy([bool]$Enable) {
    $regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
    try {
        if ($Enable) {
            Set-ItemProperty -Path $regPath -Name ProxyEnable   -Value 1
            Set-ItemProperty -Path $regPath -Name ProxyServer   -Value "$($ProxyHost):$($ProxyPort)"
            Set-ItemProperty -Path $regPath -Name ProxyOverride -Value "localhost;127.0.0.1;<local>"
            Write-OK "WinINET proxy enabled"
        } else {
            Set-ItemProperty -Path $regPath -Name ProxyEnable -Value 0
            Write-OK "WinINET proxy disabled"
        }
    } catch { Write-WARN "WinINET: $($_.Exception.Message)" }
}

# WinHTTP proxy (used by Windows Update, .NET, etc.)
function Set-WinHTTP([bool]$Enable) {
    try {
        if ($Enable) {
            $null = netsh winhttp set proxy "$($ProxyHost):$($ProxyPort)" "localhost;127.0.0.1;<local>"
            Write-OK "WinHTTP proxy enabled"
        } else {
            $null = netsh winhttp reset proxy
            Write-OK "WinHTTP proxy reset to direct"
        }
    } catch { Write-WARN "WinHTTP (may need admin): $($_.Exception.Message)" }
}

# npm
function Set-NpmProxy([bool]$Enable) {
    try {
        if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { return }
        if ($Enable) {
            npm config set proxy       $PROXY_URL --global 2>&1 | Out-Null
            npm config set https-proxy $PROXY_URL --global 2>&1 | Out-Null
            npm config set strict-ssl  false      --global 2>&1 | Out-Null
            Write-OK "npm proxy set"
        } else {
            npm config delete proxy       --global 2>&1 | Out-Null
            npm config delete https-proxy --global 2>&1 | Out-Null
            npm config set    strict-ssl  true     --global 2>&1 | Out-Null
            Write-OK "npm proxy cleared"
        }
    } catch { Write-WARN "npm: $($_.Exception.Message)" }
}

# yarn
function Set-YarnProxy([bool]$Enable) {
    try {
        if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) { return }
        if ($Enable) {
            yarn config set proxy       $PROXY_URL 2>&1 | Out-Null
            yarn config set https-proxy $PROXY_URL 2>&1 | Out-Null
            Write-OK "yarn proxy set"
        } else {
            yarn config delete proxy       2>&1 | Out-Null
            yarn config delete https-proxy 2>&1 | Out-Null
            Write-OK "yarn proxy cleared"
        }
    } catch { Write-WARN "yarn: $($_.Exception.Message)" }
}

# pnpm
function Set-PnpmProxy([bool]$Enable) {
    try {
        if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) { return }
        if ($Enable) {
            pnpm config set proxy       $PROXY_URL 2>&1 | Out-Null
            pnpm config set https-proxy $PROXY_URL 2>&1 | Out-Null
            Write-OK "pnpm proxy set"
        } else {
            pnpm config delete proxy       2>&1 | Out-Null
            pnpm config delete https-proxy 2>&1 | Out-Null
            Write-OK "pnpm proxy cleared"
        }
    } catch { Write-WARN "pnpm: $($_.Exception.Message)" }
}

# git
function Set-GitProxy([bool]$Enable) {
    try {
        if (-not (Get-Command git -ErrorAction SilentlyContinue)) { return }
        if ($Enable) {
            git config --global http.proxy  $PROXY_URL 2>&1 | Out-Null
            git config --global https.proxy $PROXY_URL 2>&1 | Out-Null
            Write-OK "git proxy set"
        } else {
            git config --global --unset http.proxy  2>&1 | Out-Null
            git config --global --unset https.proxy 2>&1 | Out-Null
            Write-OK "git proxy cleared"
        }
    } catch { Write-WARN "git: $($_.Exception.Message)" }
}

# pip / python
function Set-PipProxy([bool]$Enable) {
    try {
        if (-not (Get-Command pip -ErrorAction SilentlyContinue)) { return }
        $pipDir = "$env:APPDATA\pip"
        $pipIni = "$pipDir\pip.ini"
        if ($Enable) {
            if (-not (Test-Path $pipDir)) { New-Item -Path $pipDir -ItemType Directory -Force | Out-Null }
            Set-Content -Path $pipIni -Value "[global]`nproxy = $PROXY_URL`n"
            Write-OK "pip proxy set ($pipIni)"
        } else {
            if (Test-Path $pipIni) { Remove-Item $pipIni -Force }
            Write-OK "pip proxy cleared"
        }
    } catch { Write-WARN "pip: $($_.Exception.Message)" }
}

# curl (~/.curlrc)
function Set-CurlProxy([bool]$Enable) {
    $curlrc = "$env:USERPROFILE\.curlrc"
    try {
        if ($Enable) {
            Set-Content -Path $curlrc -Value "proxy = $PROXY_URL"
            Write-OK "curl proxy set (.curlrc)"
        } else {
            if (Test-Path $curlrc) { Remove-Item $curlrc -Force }
            Write-OK "curl proxy cleared"
        }
    } catch { Write-WARN "curl: $($_.Exception.Message)" }
}

# gradle (~/.gradle/gradle.properties)
function Set-GradleProxy([bool]$Enable) {
    $gradleDir   = "$env:USERPROFILE\.gradle"
    $gradleProps = "$gradleDir\gradle.properties"
    try {
        if (-not (Test-Path $gradleDir)) { return }
        if ($Enable) {
            $block = @"

# == PROXYFIER BEGIN ==
systemProp.http.proxyHost=$ProxyHost
systemProp.http.proxyPort=$ProxyPort
systemProp.https.proxyHost=$ProxyHost
systemProp.https.proxyPort=$ProxyPort
systemProp.http.nonProxyHosts=localhost|127.0.0.1|*.local
# == PROXYFIER END ==
"@
            # Remove old block first
            if (Test-Path $gradleProps) {
                $txt = Get-Content $gradleProps -Raw
                $txt = $txt -replace "(?s)# == PROXYFIER BEGIN ==.*?# == PROXYFIER END ==\s*", ""
                Set-Content $gradleProps $txt
            }
            Add-Content -Path $gradleProps -Value $block
            Write-OK "gradle proxy set"
        } else {
            if (Test-Path $gradleProps) {
                $txt = Get-Content $gradleProps -Raw
                $txt = $txt -replace "(?s)# == PROXYFIER BEGIN ==.*?# == PROXYFIER END ==\s*", ""
                Set-Content $gradleProps $txt.TrimEnd()
                Write-OK "gradle proxy cleared"
            }
        }
    } catch { Write-WARN "gradle: $($_.Exception.Message)" }
}

# Add proxy block to PowerShell profile (for persistent new-terminal support)
function Set-PSProfileProxy([bool]$Enable) {
    $profilePath = $PROFILE
    $marker    = "# === PROXYFIER BEGIN ==="
    $endMarker = "# === PROXYFIER END ==="
    try {
        $profileDir = Split-Path $profilePath -Parent
        if (-not (Test-Path $profileDir)) {
            New-Item -Path $profileDir -ItemType Directory -Force | Out-Null
        }
        $existing = if (Test-Path $profilePath) { Get-Content $profilePath -Raw } else { "" }
        # Strip old block
        $existing = $existing -replace "(?s)$([regex]::Escape($marker)).*?$([regex]::Escape($endMarker))\s*", ""
        if ($Enable) {
            $block = @"
$marker
`$env:HTTP_PROXY  = "$PROXY_URL"
`$env:HTTPS_PROXY = "$PROXY_URL"
`$env:http_proxy  = "$PROXY_URL"
`$env:https_proxy = "$PROXY_URL"
`$env:NO_PROXY    = "localhost,127.0.0.1,::1,.local"
`$env:no_proxy    = "localhost,127.0.0.1,::1,.local"
$endMarker
"@
            Set-Content $profilePath ($existing.TrimEnd() + "`n`n$block`n")
            Write-OK "PowerShell profile proxy block added ($profilePath)"
        } else {
            Set-Content $profilePath $existing.TrimEnd()
            Write-OK "PowerShell profile proxy block removed"
        }
    } catch { Write-WARN "PS profile: $($_.Exception.Message)" }
}

# Apply settings to all tools
function Apply-All([bool]$Enable) {
    $action = if ($Enable) { "ENABLING proxy -> $PROXY_URL" } else { "BYPASSING proxy (direct internet access)" }
    Write-Header
    Write-Sep
    Write-INFO $action
    Write-Sep

    Set-ProxyEnvVars $Enable
    Set-WindowsProxy $Enable
    Set-WinHTTP      $Enable
    Set-NpmProxy     $Enable
    Set-YarnProxy    $Enable
    Set-PnpmProxy    $Enable
    Set-GitProxy     $Enable
    Set-PipProxy     $Enable
    Set-CurlProxy    $Enable
    Set-GradleProxy  $Enable

    if ($Persist) {
        Set-PSProfileProxy $Enable
    }

    Write-Sep
    if ($Enable) {
        Write-OK  "All tools routed through eduroam proxy: $PROXY_URL"
    } else {
        Write-OK  "All tools set to DIRECT (bypass) mode"
    }
    Write-INFO "Tip: Restart any open terminals to pick up env changes."
    Write-Host ""
}

# Show current proxy status across all tools
function Show-Status {
    Write-Header
    Write-Sep
    Write-INFO "Proxy target: $PROXY_URL"
    Write-Sep

    $onEduroam = Test-OnEduroam
    if ($onEduroam) { Write-WARN "Network: eduroam proxy is REACHABLE" }
    else            { Write-OK   "Network: eduroam proxy NOT reachable (likely on direct internet)" }

    # WinINET
    $regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
    $reg = Get-ItemProperty -Path $regPath -ErrorAction SilentlyContinue
    if ($reg.ProxyEnable -eq 1) {
        Write-INFO "WinINET    : ENABLED -> $($reg.ProxyServer)"
    } else {
        Write-INFO "WinINET    : disabled"
    }

    # WinHTTP
    $winhttp = (netsh winhttp show proxy 2>&1) -join " "
    if ($winhttp -match "no proxy server|Direct access") {
        Write-INFO "WinHTTP    : direct (no proxy)"
    } else {
        Write-INFO "WinHTTP    : $winhttp"
    }

    # Env vars
    foreach ($v in @("HTTP_PROXY","HTTPS_PROXY","NO_PROXY")) {
        $val = [System.Environment]::GetEnvironmentVariable($v, "User")
        if ($val) { Write-INFO "Env $v : $val" }
        else      { Write-INFO "Env $v : (not set)" }
    }

    # npm
    try {
        if (Get-Command npm -ErrorAction SilentlyContinue) {
            $npmProxy = npm config get proxy 2>&1
            if ($npmProxy -and $npmProxy -ne "null") { Write-INFO "npm proxy  : $npmProxy" }
            else { Write-INFO "npm proxy  : not set" }
        }
    } catch {}

    # git
    try {
        if (Get-Command git -ErrorAction SilentlyContinue) {
            $gProxy = git config --global http.proxy 2>&1
            if ($gProxy -and $gProxy -notmatch "error") { Write-INFO "git proxy  : $gProxy" }
            else { Write-INFO "git proxy  : not set" }
        }
    } catch {}

    Write-Sep
}

# ── Entry point ──────────────────────────────────────────────
switch ($Mode) {
    "on"     { Apply-All $true  }
    "off"    { Apply-All $false }
    "status" { Show-Status      }
    "auto"   {
        Write-Header
        Write-Sep
        Write-INFO "Auto-detecting network..."
        $onEduroam = Test-OnEduroam
        if ($onEduroam) {
            Write-WARN "eduroam proxy is reachable -> enabling proxy for all tools"
            Apply-All $true
        } else {
            Write-OK  "eduroam proxy NOT reachable -> bypassing proxy (direct mode)"
            Apply-All $false
        }
    }
}
