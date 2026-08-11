# ADR-007: Content + Publication Split

**Estado:** Aceptada.

## Contexto

El dominio establece que el sistema debe separar la gestión editorial (borradores,
revisión, preparación) de la exposición pública. Inicialmente se consideró usar un
booleano `isPublished` en la tabla `Content`, pero esto acoplaría el ciclo editorial
con el ciclo de publicación, dificultando trazabilidad, retiro parcial y auditoría.

## Decisión

Dividir la representación en dos entidades:

- **Content**: entidad editorial que gestiona el ciclo interno (DRAFT → PREPARED →
  NEEDS_REVIEW → READY_FOR_PUBLICATION → ARCHIVED). Contiene el cuerpo, metadatos
  editoriales, autoría operativa (`createdBy`, `updatedBy`) y clasificación.
- **Publication**: entidad de exposición pública que se crea a partir de un Content
  elegible (status `READY_FOR_PUBLICATION`). Gestiona `publicSlug`, fechas de
  publicación/retiro/archivo, visibilidad (`isVisible`), y su propio ciclo
  (PUBLISHED → WITHDRAWN → ARCHIVED).

## Justificación

- Un Content puede republicarse tras un retiro sin duplicar el contenido editorial.
- La trazabilidad de publicación es independiente del historial de cambios editoriales.
- Es posible retirar una publicación sin eliminar el Content ni su historial.
- Se evita la mezcla de flags booleanos (`isPublished`, `isArchived`) que dificultan
  consultas y auditoría.

## Consecuencias

- El flujo de publicación requiere un paso explícito (crear Publication desde Content),
  lo que agrega una operación adicional al operador.
- La API expone endpoints separados: `/admin/contents` y `/admin/publications`.
- La consulta pública filtra exclusivamente sobre `Publication` con estado `PUBLISHED`
  e `isVisible = true`.

## Riesgos

- El operador podría no entender por qué debe "publicar" después de "preparar" el contenido.

## Mitigación

- La interfaz administrativa unifica ambos pasos en una sola acción "Publicar" que
  internamente cambia el estado del Content y crea la Publication.

## Alternativas descartadas

- Booleano `isPublished` en Content: pérdida de trazabilidad, imposibilidad de
  republicación independiente.
- Recrear Content por cada publicación: duplicación de datos y pérdida de historial.
