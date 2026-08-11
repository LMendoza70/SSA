# setup.ps1 — Configuración inicial del proyecto para desarrollo local
# Uso: .\scripts\setup.ps1
# Requisitos: PowerShell 5.1+, Node.js 22+, pnpm 10+, docker (opcional para PostgreSQL)

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

Write-Host "=== Configuración del proyecto SSA ===" -ForegroundColor Cyan

# 1. Verificar PostgreSQL
$pgAvailable = $false
try {
  $pgVersion = & psql --version 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] PostgreSQL CLI detectado: $pgVersion" -ForegroundColor Green
    $pgAvailable = $true
  }
} catch {
  Write-Host "[INFO] PostgreSQL CLI no encontrado" -ForegroundColor Yellow
}

$dockerAvailable = $false
try {
  $dv = & docker compose version 2>&1
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Docker Compose detectado" -ForegroundColor Green
    $dockerAvailable = $true
  }
} catch {
  Write-Host "[INFO] Docker Compose no disponible" -ForegroundColor Yellow
}

if (-not $pgAvailable -and -not $dockerAvailable) {
  Write-Host "[WARN] No hay PostgreSQL ni Docker disponibles." -ForegroundColor Yellow
  Write-Host "       Instala PostgreSQL manualmente o instala Docker Desktop." -ForegroundColor Yellow
  Write-Host "       Luego ejecuta: docker compose up -d" -ForegroundColor Yellow
}

# 2. Levantar PostgreSQL con Docker si está disponible
if ($dockerAvailable -and -not $pgAvailable) {
  $existing = & docker container inspect ssa-postgres --format "{{.State.Status}}" 2>&1
  if ($LASTEXITCODE -ne 0 -or $existing -ne "running") {
    Write-Host "[...] Levantando PostgreSQL con Docker..." -ForegroundColor Cyan
    & docker compose up -d
    Start-Sleep -Seconds 5
    Write-Host "[OK] PostgreSQL iniciado" -ForegroundColor Green
  } else {
    Write-Host "[OK] PostgreSQL ya está corriendo (Docker)" -ForegroundColor Green
  }
}

# 3. Variables de entorno
if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "[OK] Archivo .env creado desde .env.example" -ForegroundColor Green
} else {
  Write-Host "[OK] .env ya existe" -ForegroundColor Green
}

# 4. Instalar dependencias
Write-Host "[...] Instalando dependencias (pnpm install)..." -ForegroundColor Cyan
pnpm install
if ($LASTEXITCODE -ne 0) { throw "pnpm install falló" }
Write-Host "[OK] Dependencias instaladas" -ForegroundColor Green

# 5. Generar cliente Prisma
Write-Host "[...] Generando cliente Prisma..." -ForegroundColor Cyan
pnpm --filter @ssa/api exec prisma generate
if ($LASTEXITCODE -ne 0) { throw "prisma generate falló" }
Write-Host "[OK] Cliente Prisma generado" -ForegroundColor Green

# 6. Ejecutar migraciones
Write-Host "[...] Ejecutando migraciones Prisma..." -ForegroundColor Cyan
pnpm exec prisma migrate deploy
if ($LASTEXITCODE -ne 0) { throw "prisma migrate deploy falló" }
Write-Host "[OK] Migraciones ejecutadas" -ForegroundColor Green

# 7. Sembrar datos
Write-Host "[...] Sembrando datos iniciales..." -ForegroundColor Cyan
pnpm exec prisma db seed
if ($LASTEXITCODE -ne 0) { throw "prisma db seed falló" }
Write-Host "[OK] Datos iniciales sembrados" -ForegroundColor Green

Write-Host "=== Configuración completada ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor White
Write-Host "  pnpm dev          Inicia API y web en paralelo" -ForegroundColor White
Write-Host "  pnpm dev:api      Solo API (http://localhost:3001)" -ForegroundColor White
Write-Host "  pnpm dev:web      Solo web (http://localhost:5173)" -ForegroundColor White
Write-Host ""
Write-Host "Para crear el primer administrador:" -ForegroundColor White
Write-Host "  pnpm admin:create admin@example.com Admin123" -ForegroundColor White
