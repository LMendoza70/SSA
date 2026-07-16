# backup.ps1 — Respaldo de PostgreSQL y archivos multimedia
# Uso: .\scripts\backup.ps1 [-OutputDir <ruta>]
# Sin argumentos, usa ./backups/<fecha>/

param(
  [string]$OutputDir = ""
)

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

if (-not $OutputDir) {
  $timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
  $OutputDir = Join-Path $RootDir "backups\$timestamp"
}

New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
Write-Host "[...] Directorio de respaldo: $OutputDir" -ForegroundColor Cyan

# Cargar variables de entorno
$envFile = Join-Path $RootDir ".env"
if (-not (Test-Path $envFile)) {
  Write-Host "[ERROR] No existe .env en la raíz del proyecto" -ForegroundColor Red
  exit 1
}

$envContent = Get-Content $envFile
$dbUrl = ""
foreach ($line in $envContent) {
  if ($line -match '^DATABASE_URL="(.+)"$') {
    $dbUrl = $matches[1]
    break
  }
}

if (-not $dbUrl) {
  Write-Host "[ERROR] No se encontró DATABASE_URL en .env" -ForegroundColor Red
  exit 1
}

# Extraer componentes de la URL de conexión
$uri = [System.Uri]$dbUrl
$pgUser = $uri.UserInfo.Split(':')[0]
$pgPass = $uri.UserInfo.Split(':')[1]
$pgHost = $uri.Host
$pgPort = $uri.Port
$pgDb = $uri.AbsolutePath.TrimStart('/').Split('?')[0]

# 1. Respaldo de PostgreSQL
Write-Host "[...] Respaldando PostgreSQL ($pgDb)..." -ForegroundColor Cyan
$pgDumpFile = Join-Path $OutputDir "ssa_db.sql"
$env:PGPASSWORD = $pgPass
& pg_dump -h $pgHost -p $pgPort -U $pgUser -d $pgDb -F c -f "$pgDumpFile" 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "[ERROR] pg_dump falló. Verifica que PostgreSQL CLI esté instalado." -ForegroundColor Red
  exit 1
}
Write-Host "[OK] Base de datos respaldada: $pgDumpFile" -ForegroundColor Green

# 2. Respaldo de archivos multimedia
$uploadsDir = Join-Path $RootDir "uploads"
if (Test-Path $uploadsDir) {
  Write-Host "[...] Respaldando archivos multimedia..." -ForegroundColor Cyan
  $mediaFile = Join-Path $OutputDir "uploads.tar.gz"
  # Usar tar (disponible en Windows 10+ / PowerShell)
  tar -czf "$mediaFile" -C "$RootDir" "uploads" 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Multimedia respaldada: $mediaFile" -ForegroundColor Green
  } else {
    Write-Host "[WARN] No se pudo comprimir multimedia (tar no disponible?), copiando..." -ForegroundColor Yellow
    $mediaDir = Join-Path $OutputDir "uploads"
    Copy-Item -Recurse -Path $uploadsDir -Destination $mediaDir
    Write-Host "[OK] Multimedia copiada a: $mediaDir" -ForegroundColor Green
  }
} else {
  Write-Host "[INFO] No hay directorio uploads que respaldar" -ForegroundColor Yellow
}

Write-Host "=== Respaldo completado ===" -ForegroundColor Cyan
Write-Host "Ubicación: $OutputDir" -ForegroundColor White
