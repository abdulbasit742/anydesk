param(
  [string]$Owner = "abdulbasit742",
  [string]$Root = (Resolve-Path "$PSScriptRoot\..").Path
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Assert-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) { throw "Missing command: $Name" }
}

function Import-Repo([string]$Repo, [string]$Destination, [string]$Branch = "main") {
  $target = Join-Path $Root $Destination
  if (Test-Path $target) {
    Write-Host "SKIP $Destination already exists"
    return
  }
  $temp = Join-Path $env:TEMP ("skydesk-" + $Repo + "-" + [guid]::NewGuid().ToString("N"))
  git clone --depth 1 --branch $Branch "https://github.com/$Owner/$Repo.git" $temp
  Remove-Item (Join-Path $temp ".git") -Recurse -Force
  Get-ChildItem $temp -Force -File -Filter ".env*" | Where-Object { $_.Name -ne ".env.example" } | Remove-Item -Force
  New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
  Move-Item $temp $target
  Write-Host "IMPORTED $Repo -> $Destination"
}

function Import-Local([string]$Source, [string]$Destination) {
  if (-not (Test-Path $Source)) { Write-Host "SKIP local source missing: $Source"; return }
  $target = Join-Path $Root $Destination
  if (Test-Path $target) { Write-Host "SKIP $Destination already exists"; return }
  New-Item -ItemType Directory -Force -Path $target | Out-Null
  robocopy $Source $target /E /XD .git node_modules .next dist build venv .venv sessions recordings /XF .env *.key *.pem kaggle.json *token*.json | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "robocopy failed for $Source with $LASTEXITCODE" }
  Write-Host "IMPORTED local $Source -> $Destination"
}

Assert-Command git
Set-Location $Root

Import-Repo "anydesklovable" "legacy/dashboard-lovable"
Import-Repo "remotedesk-mobile" "apps/mobile" "master"
Import-Repo "anydeskantigravity1" "legacy/antigravity-prototype"
Import-Local "C:\RemoteDeskLive" "legacy/browser-mvp"
Import-Local "C:\skydesk_android" "legacy/android-native"

$forbidden = Get-ChildItem $Root -Recurse -Force -File | Where-Object {
  $_.FullName -notmatch "\\.git\\" -and (
    $_.Name -eq ".env" -or $_.Name -match "(?i)(token|secret|credential).*\.json$" -or $_.Extension -in ".pem", ".key"
  )
}
if ($forbidden) {
  $forbidden.FullName | ForEach-Object { Write-Error "Forbidden secret-like file: $_" }
  throw "Consolidation stopped: remove secret-like files before commit"
}

$nestedGit = Get-ChildItem $Root -Recurse -Force -Directory -Filter ".git" | Where-Object { $_.FullName -ne (Join-Path $Root ".git") }
if ($nestedGit) { throw "Nested .git directories found: $($nestedGit.FullName -join ', ')" }

@{
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  canonical = "$Owner/anydesk"
  imported = @("anydesklovable", "remotedesk-mobile", "anydeskantigravity1", "RemoteDeskLive", "skydesk_android")
  skippedDuplicate = @("longworking")
} | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $Root "docs/consolidation-manifest.json")

Write-Host "SkyDesk sources consolidated safely. Review git status, run tests, then commit."
