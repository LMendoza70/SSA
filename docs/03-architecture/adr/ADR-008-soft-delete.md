# ADR-008: Soft Delete Pattern

**Estado:** Aceptada.

## Contexto

El dominio requiere preservar la memoria institucional. Las operaciones de eliminación
no deben destruir información que pueda ser necesaria para trazabilidad, auditoría o
recuperación. Sin embargo, el sistema necesita una forma de marcar registros como
"eliminados" para que no aparezcan en listados ni búsquedas estándar.

## Decisión

Implementar **soft delete** en todas las entidades del sistema mediante los campos:

- `deletedAt: DateTime?` — marca cuándo fue eliminado lógicamente
- `deletedBy: String?` — referencia al operador que ejecutó la eliminación

Las consultas de listado excluyen por defecto los registros donde `deletedAt IS NOT NULL`.
Las consultas de detalle requieren filtro explícito para incluir eliminados.

## Justificación

- Preserva la memoria institucional incluso después de eliminaciones operativas.
- Permite recuperación ante eliminaciones accidentales.
- Compatible con el requisito de trazabilidad: un registro eliminado conserva su
  historial de cambios.
- Evita la complejidad de tablas de auditoría separadas para eliminaciones.
- Consistente con la estrategia de PostgreSQL (índices parciales, consultas eficientes).

## Consecuencias

- Todas las tablas incluyen `deletedAt` y `deletedBy` como campos obligatorios.
- Los servicios deben aplicar filtros `where: { deletedAt: null }` en listados.
- Las migraciones existentes deben actualizarse para incluir estos campos.
- Las pruebas deben verificar que registros eliminados no aparecen en consultas públicas.

## Riesgos

- Olvidar el filtro `deletedAt` en una consulta podría exponer datos eliminados.
- Acumulación de registros eliminados sin limpieza a largo plazo.

## Mitigación

- Repository pattern centraliza el filtro de soft delete, evitando omisiones.
- Estrategia de purgado definida fuera del MVP (archivo físico o limpieza periódica).

## Alternativas descartadas

- Hard delete: incompatible con memoria institucional y trazabilidad.
- Tabla de papelera separada: duplica estructura y complica consultas.
- Event sourcing completo: sobreingeniería para el MVP; soft delete es suficiente.
