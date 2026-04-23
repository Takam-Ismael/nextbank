# start-expo.ps1 — Auto-detects your network IP and starts Expo
# Usage: .\start-expo.ps1  OR  npm start
#
# Parses 'ipconfig' to find your Wi-Fi / Mobile hotspot IP.
# Skips virtual adapters (VirtualBox, Docker, Hyper-V, etc.)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NextBank Mobile - Expo Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ip = $null

# Parse ipconfig line by line, tracking which adapter section we're in
$currentAdapter = ""
$skipAdapter = $false

foreach ($line in (ipconfig)) {
    # Detect adapter section headers
    if ($line -match "adapter (.+):$") {
        $currentAdapter = $Matches[1]
        # Skip virtual/docker adapters
        $skipAdapter = $currentAdapter -match "VirtualBox|Docker|Hyper-V|vEthernet|Loopback|Bluetooth|Connexion au r.seau local\*"
    }
    
    # Look for IPv4 addresses in non-virtual adapters
    if (-not $skipAdapter -and $line -match "IPv4.*:\s*(\d+\.\d+\.\d+\.\d+)") {
        $candidate = $Matches[1]
        if ($candidate -ne "127.0.0.1" -and $candidate -ne "192.168.56.1") {
            $ip = $candidate
            Write-Host "[NextBank] Found IP $ip on: $currentAdapter" -ForegroundColor Green
            break
        }
    }
}

if (-not $ip) {
    $ip = "127.0.0.1"
    Write-Host "[NextBank] WARNING: No network found, using localhost" -ForegroundColor Red
    Write-Host "[NextBank] Make sure you are connected to a network!" -ForegroundColor Red
}

# Set the env var for Expo
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $ip

# Update .env file so Expo also reads it
$envFile = Join-Path $PSScriptRoot ".env"
Set-Content -Path $envFile -Value "REACT_NATIVE_PACKAGER_HOSTNAME=$ip"

Write-Host "[NextBank] Expo will broadcast on: exp://${ip}:8088" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Expo on port 8088
npx expo start --port 8088
