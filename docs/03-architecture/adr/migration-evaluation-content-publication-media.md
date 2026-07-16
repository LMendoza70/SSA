# Evaluación de Migración Gradual: Content, Publication, Media

**Fecha:** 2026-07-16  
**Propósito:** Evaluar la migración al patrón repositorio (ADR-013) en los módulos Content, Publication y Media sin reescritura masiva.

---

## Resumen

| Módulo | Tamaño (SLOC) | Dependencias Prisma directas | `any` usages | Complejidad | Migración |
|--------|:----------:|:--------------------------:|:----------:|:--------:|:--------:|
| Content | ~358 | create, findMany, findUnique, update, count + contentType, source, validation queries | where, data, toResponse, map callbacks | Alta (slug resolution, sanitize, asociaciones) | Diferida |
| Publication | ~272 | create, findMany, findUnique, update, count + queries a content, source, validation | where, toResponse | Media (reglas de publicación) | Diferida |
| Media | ~238 | create, findMany, findUnique, update, count | where, data, toResponse | Media (upload, storage) | Diferida |

---

## Análisis

### Content Module

**Complejidades particulares:**
1. `resolveUniqueSlug` — lógica de resolución de slugs que mezcla consultas Prisma con bucles.
2. `sanitize-html` — dependencia externa en el servicio, independiente del patrón de persistencia.
3. Asociaciones con Source y Validation — consultas a modelos externos (`contentSource`, `contentValidation`).
4. La interfaz del repositorio tendría ~12 métodos (CRUD + asociaciones + slug resolution + contentType queries).

**Riesgo de reescritura:** Alto. Extraer el repositorio implicaría mover mucha lógica sin beneficio inmediato porque el servicio ya inyecta PrismaService y las reglas de negocio viven en el servicio, no en Prisma.

### Publication Module

**Complejidades particulares:**
1. Reglas de publicación que validan contenido (fuentes, validaciones, responsabilidad institucional) — pertenecen al servicio, no al repositorio.
2. `withdraw` y `archive` — casos de uso específicos que cambian estado.

**Riesgo de reescritura:** Medio. El servicio tiene lógica de negocio mezclada con consultas Prisma. Separar requiere identificar qué partes son reglas vs. acceso a datos.

### Media Module

**Complejidades particulares:**
1. StorageProvider ya abstrae el almacenamiento de archivos — la persistencia de metadatos (Prisma) es solo una parte.
2. Upload, asociación con Content, reemplazo de asociaciones.
3. Manejo de archivos Express.Multer.

**Riesgo de reescritura:** Medio-bajo. El módulo Media ya tiene buena separación (StorageProvider para archivos, Prisma para metadatos). La migración a repositorio para metadatos sería relativamente limpia.

---

## Decisión: Migración Diferida (no realizar ahora)

Se recomienda **no migrar** Content, Publication y Media al patrón repositorio en esta auditoría por las siguientes razones:

1. **No hay violación arquitectónica grave**: estos servicios usan `PrismaService` directamente pero NO contienen lógica de negocio en controladores — la lógica está en los servicios, que es donde debe estar según Clean Architecture.
2. **Riesgo de regresión alto**: Content tiene lógica densa (slug resolution, asociaciones, sanitize) que dificulta la extracción limpia de un repositorio sin reescritura.
3. **El patrón repositorio ya está demostrado**: ADR-013 define el patrón, Source y Validation lo implementan. Los módulos restantes pueden migrarse cuando se toquen por otras razones (nueva funcionalidad, refactor dirigido).
4. **La separación service/repository no afecta la API pública**: los controladores y DTOs no cambian, por lo que la migración puede hacerse de forma incremental.

## Plan de Migración Futura (Condicional)

Si en el futuro se decide migrar, el orden recomendado es:

1. **Media** (menor complejidad, mayor desacople ya existente con StorageProvider)
2. **Publication** (reglas de negocio claramente delimitadas)
3. **Content** (último por su complejidad y densidad de lógica)

### Pasos por módulo

1. Crear interfaz `I<Module>Repository` con métodos específicos del dominio.
2. Crear `Prisma<Module>Repository` implementando la interfaz.
3. Actualizar el servicio para inyectar `I<Module>Repository` en lugar de `PrismaService`.
4. Mover la construcción de filtros `where` (soft delete, paginación) al repositorio.
5. Tipar los métodos `toResponse` con tipos Prisma o tipos de dominio dedicados.
6. Actualizar tests unitarios.

## Alternativa más conservadora

En lugar de repositorio completo, se puede aplicar un **paso intermedio**: mover la construcción de filtros `where` y paginación a métodos privados del servicio, lo que reduce la exposición a `any` sin añadir una capa de abstracción completa. Esto puede hacerse por módulo sin cambiar el contrato de inyección de dependencias.

---

**Veredicto:** Mantener `PrismaService` directo en Content, Publication y Media por ahora. El patrón repositorio definido en ADR-013 se aplica a módulos nuevos; la migración de módulos existentes se evaluará caso por caso cuando se intervengan por otras razones.
