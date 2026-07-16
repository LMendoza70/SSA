# ADR-014: Uso de Docker en Desarrollo Local

| Campo | Valor |
|---|---|
| Decisión | `ACEPTADA` |
| Fecha | 2026-07-16 |
| Autores | DevOps / Implementation |
| Estado | Definitiva |

## Contexto

Se requiere decidir si Docker formará parte del flujo de desarrollo local para el MVP del Sistema de Gestión de Contenido de la Jurisdicción Sanitaria de Huejutla de Reyes.

El documento `devops.md` (DEVOPS-DEC-004) establece que Docker es recomendado pero no obligatorio. La presente decisión concreta esa directriz para el entorno de desarrollo.

## Decisión

**Docker se usará exclusivamente para PostgreSQL en desarrollo local, mediante `docker-compose.yml`.**

Las aplicaciones (API NestJS y web React/Vite) NO se contenedorizan. Se ejecutan directamente con `pnpm dev`.

### Justificación

1. **Consistencia de base de datos**: PostgreSQL vía Docker garantiza la misma versión (16-alpine) para todos los desarrolladores, eliminando diferencias entre instalaciones nativas de PostgreSQL en Windows, macOS o Linux.

2. **Simplicidad operativa**: El comando `docker compose up -d` levanta PostgreSQL en segundos. No requiere instalar PostgreSQL nativamente ni configurar servicios del sistema.

3. **Portabilidad**: Cualquier desarrollador puede iniciar el proyecto con dos comandos: `docker compose up -d` y `pnpm dev`.

4. **Sin sobreingeniería**: No se contenedoriza la aplicación porque:
   - Las aplicaciones Node.js se ejecutan más directamente con `pnpm dev` (hot reload, debugging).
   - No hay beneficios significativos de contenedorizar apps en desarrollo local.
   - Se evita complejidad de multi-stage builds, volúmenes de node_modules, etc.

5. **Alineación con la estrategia**: Coincide con DEVOPS-DEC-004 (Docker recomendado, no obligatorio) y DEVOPS-DEC-005 (Kubernetes fuera del MVP).

### Consecuencias

Positivas:
- Setup reproducible de base de datos.
- Baja barrera de entrada para nuevos desarrolladores.
- No depende de instalación nativa de PostgreSQL.

Negativas:
- Desarrollador debe tener Docker Desktop instalado (Windows) o Docker Engine.
- Si no se tiene Docker, se necesita PostgreSQL nativo con la misma configuración.
- No hay scripting de infraestructura adicional (intencionalmente).

## Alternativas consideradas

| Alternativa | Motivo de rechazo |
|---|---|
| Docker completo (app + db) | Sobrecarga innecesaria para MVP; hot reload y debugging más complejos. |
| PostgreSQL nativo obligatorio | Inconsistencia entre versiones y configuraciones en distintos SO. |
| SQLite en lugar de PostgreSQL | Incompatible con Prisma y la base productiva PostgreSQL. |

## Referencias

- `devops.md` — DEVOPS-DEC-004 (Docker recomendado, no obligatorio)
- `docker-compose.yml` — Implementación concreta
- `scripts/setup.ps1` — Script que levanta PostgreSQL vía Docker automáticamente
