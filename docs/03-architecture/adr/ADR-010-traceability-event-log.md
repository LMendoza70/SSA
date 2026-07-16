# ADR-010: Traceability as Append-Only Event Log

**Estado:** Aceptada.

## Contexto

El dominio requiere que toda operación sobre el ciclo de vida del contenido quede
registrada: creación, actualización, preparación, publicación, retiro, archivo y
distribución. Este registro debe ser auditable, inmutable (no editable por el operador)
y consultable por contenido o publicación.

## Decisión

Implementar un **event log de solo append** mediante la entidad `TraceabilityRecord`.

Características:
- **Sin soft delete**: los registros de trazabilidad nunca se eliminan lógicamente
  (no tienen `deletedAt`).
- **Sin actualización**: una vez creado, un registro no se modifica.
- **Campos**: `id`, `contentId?`, `publicationId?`, `event` (string enumerado),
  `metadata` (JSON opcional), `userId` (operador), `createdAt`.
- **Consulta**: solo filtrada por `contentId` o `publicationId`, sin CRUD libre
  (no hay `PATCH` ni `DELETE` para trazabilidad).

Eventos registrados:
- `CREATED`, `UPDATED`, `PREPARED`, `PUBLISHED`, `WITHDRAWN`, `ARCHIVED`, `DISTRIBUTED`.

## Justificación

- Inmutabilidad garantiza integridad del registro de auditoría.
- Sin soft delete evita que un operador "elimine" evidencia de sus acciones.
- Estructura simple (una tabla, sin relaciones complejas) suficiente para el MVP.
- El patrón append-only es la base para evolucionar a event sourcing si fuese necesario.
- La consulta filtrada evita exponer toda la trazabilidad sin contexto.

## Consecuencias

- Los servicios deben invocar `TraceabilityService.record()` en cada operación relevante.
- La tabla `traceability_records` puede crecer significativamente con el tiempo.
- La API expone un solo endpoint de consulta: `GET /admin/traceability-records`.
- No existe endpoint para crear, editar ni eliminar registros.

## Riesgos

- Crecimiento ilimitado de la tabla a largo plazo.

## Mitigación

- Estrategia de retención y purgado definida fuera del MVP (archivo anual, limpieza
  de registros mayores a N años).
- Índices en `contentId` y `publicationId` para consultas eficientes.
- PostgreSQL particionado por fecha como escalamiento futuro.

## Alternativas descartadas

- Sin trazabilidad: incompatible con el dominio y requisitos institucionales.
- Tabla de auditoría genérica (triggers en BD): difícil de mantener y consultar.
- Event sourcing completo: sobreingeniería para el MVP; el event log simple cubre
  el requisito actual y permite evolucionar.
- Logging técnico (Winston, etc.): los logs técnicos no son trazabilidad de dominio.
