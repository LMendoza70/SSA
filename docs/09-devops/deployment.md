# Despliegue

> **DIFERIDO** — Este archivo es un marcador que se completará al implementar el despliegue real en un proveedor. Actualmente existe infraestructura DevOps preparada (ver más abajo).

## Estado actual (2026-07-16)

El proyecto cuenta con la preparación DevOps completa para iniciar despliegues controlados:

| Componente | Estado | Documentación |
|---|---|---|
| Estrategia DevOps | `docs/09-devops/devops.md` | Aprobada |
| Estrategia de despliegue | `docs/09-devops/deployment-strategy.md` | Aprobada |
| Estrategia de ambientes | `docs/09-devops/environment-strategy.md` | Aprobada |
| CI pipeline | `.github/workflows/ci.yml` | Implementado |
| Docker Compose (PostgreSQL) | `docker-compose.yml` | Implementado |
| Scripts de setup/backup/restore | `scripts/` | Implementados |
| Script creación admin | `scripts/create-admin.ts` | Implementado |
| Variables de entorno documentadas | `.env.example` | Actualizado |

## Próximos pasos (cuando se autorice el despliegue)

1. Elegir proveedor de hosting.
2. Configurar dominio y HTTPS.
3. Desplegar frontend (build estático) y backend (NestJS).
4. Configurar PostgreSQL administrado con backups automáticos.
5. Ejecutar migraciones iniciales.
6. Crear primer usuario administrativo vía `scripts/create-admin.ts`.
7. Validar smoke test post-despliegue.

Ver `docs/09-devops/deployment-strategy.md` para la estrategia completa y el checklist de despliegue.
