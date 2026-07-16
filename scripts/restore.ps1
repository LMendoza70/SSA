# restore.ps1 — Restauración de PostgreSQL y archivos multimedia
# Uso: .\scripts\restore.ps1 -BackupDir <ruta>
# ¡PRECAUCIÓN! Esto SOBRESCRIBE la base de datos y los archivos multimedia actuales.

param(
  [Parameter(Mandatory=$true)]
  [string]$BackupDir
)

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

if (-not (Test-Path $BackupDir)) {
  Write-Host "[ERROR] El directorio de respaldo no existe: $BackupDir" -ForegroundColor Red
  exit 1
}

Write-Host "=== RESTAURACIÓN DE RESPALDO ===" -ForegroundColor Red
Write-Host "Origen: $BackupDir" -ForegroundColor Yellow
Write-Host "ADVERTENCIA: Esto sobrescribirá la base de datos y archivos actuales." -ForegroundColor Red
$confirm = Read-Host "¿Continuar? (s/N)"
if ($confirm -ne "s") {
  Write-Host "Restauración cancelada." -ForegroundColor Yellow
  exit 0
}

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

$uri = [System.Uri]$dbUrl
$pgUser = $uri.UserInfo.Split(':')[0]
$pgPass = $uri.UserInfo.Split(':')[1]
$pgHost = $uri.Host
$pgPort = $uri.Port
$pgDb = $uri.AbsolutePath.TrimStart('/').Split('?')[0]

# 1. Restaurar PostgreSQL
$pgDumpFile = Join-Path $BackupDir "ssa_db.sql"
if (Test-Path $pgDumpFile) {
  Write-Host "[...] Restaurando PostgreSQL..." -ForegroundColor Cyan
  $env:PGPASSWORD = $pgPass
  & pg_restore -h $pgHost -p $pgPort -U $pgUser -d $pgDb --clean --if-exists -F c "$pgDumpFile" 2>&1
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] pg_restore falló" -ForegroundColor Red
    exit 1
  }
  Write-Host "[OK] Base de datos restaurada" -ForegroundColor Green
} else {
  Write-Host "[WARN] No se encontró archivo de base de datos: $pgDumpFile" -ForegroundColor Yellow
}

# 2. Restaurar multimedia
$mediaFile = Join-Path $BackupDir "uploads.tar.gz"
$mediaDir = Join-Path $BackupDir "uploads"
if (Test-Path $mediaFile) {
  Write-Host "[...] Restaurando multimedia desde tar.gz..." -ForegroundColor Cyan
  tar -xzf "$mediaFile" -C "$RootDir" 2>&1
  Write-Host "[OK] Multimedia restaurada" -ForegroundColor Green
} elseif (Test-Path $mediaDir) {
  Write-Host "[...] Restaurando multimedia desde directorio..." -ForegroundColor Cyan
  $targetDir = Join-Path $RootDir "uploads"
  if (Test-Path $targetDir) {
    Remove-Item -Recurse -Force $targetDir
  }
  Copy-Item -Recurse -Path $mediaDir -Destination $targetDir
  Write-Host "[OK] Multimedia restaurada" -ForegroundColor Green
} else {
  Write-Host "[INFO] No hay multimedia en el respaldo" -ForegroundColor Yellow
}

Write-Host "=== Restauración completada ===" -ForegroundColor Cyan
Write-Host "Se recomienda verificar la aplicación y los datos." -ForegroundColor White
