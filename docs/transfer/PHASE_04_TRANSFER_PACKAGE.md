# PHASE 04 TRANSFER PACKAGE — Database

## 1. Estado de la fase

**Fase cerrada:** Phase 04 — Database  
**Estado recomendado:** Baseline completa  
**Fecha de cierre:** 2026-07-08  
**Siguiente fase:** Phase 05 — API

Esta transferencia conserva el estado arquitectónico alcanzado al cerrar la fase de Database. Debe usarse para iniciar un nuevo chat sin perder continuidad de decisiones, límites ni secuencia documental.

---

## 2. Documentos aprobados en Phase 04

Los siguientes documentos quedan aprobados como baseline de la fase:

```text
docs/04-database/database.md        ✅ Baseline
docs/04-database/erd.md             ✅ Baseline
docs/04-database/schema-prisma.md   ✅ Baseline
```

Además, se generó el primer artefacto técnico derivado:

```text
prisma/schema.prisma                ✅ Generado para revisión técnica inicial
```

Importante: la generación de `schema.prisma` no autoriza todavía migraciones, seeds, API, backend, frontend ni ejecución de Prisma.

---

## 3. Decisiones aprobadas de Database

### 3.1 Persistencia subordinada al dominio

La persistencia sirve al dominio institucional y no redefine el dominio, la arquitectura ni los casos de uso.

### 3.2 Separación Content / Publication

`Content` y `Publication` se modelan como conceptos separados.

- `Content`: pieza editorial institucional preparada, clasificable, reutilizable y trazable.
- `Publication`: hecho institucional de exposición pública de un Content, con estado, vigencia, retiro, archivo, disponibilidad pública y responsabilidad institucional.

Relación base de MVP:

```text
contents 1 ── 0..1 publications
```

### 3.3 `contents` como base editorial común

`contents` es la base editorial común para noticias, avisos, comunicados, documentos, infografías, preguntas frecuentes, contenido informativo sobre programas e información institucional.

No se fragmenta en tablas principales por tipo editorial.

### 3.4 Campaigns y Diseases separadas

`campaigns` y `diseases` son entidades organizadoras separadas.

- Campaign no es tipo de Content.
- Disease no es tipo de Content.
- Ninguna sustituye categorías o etiquetas.

### 3.5 Sources y Validations separadas

`sources` y `validations` son entidades separadas.

- `sources`: origen, respaldo o fuente institucional/documental.
- `validations`: confirmación institucional de autenticidad, vigencia, pertinencia o validación completa según origen.

Una validación puede asociarse con una fuente cuando valida autenticidad, vigencia o pertinencia del origen. Si la validación corresponde a conocimiento generado por la Jurisdicción, no se debe forzar fuente oficial externa.

### 3.6 Trazabilidad explícita

`traceability_records` existe como trazabilidad institucional mínima.

No representa auditoría avanzada, versionado campo por campo ni workflow multinivel.

Debe explicar:

```text
qué ocurrió,
sobre qué entidad ocurrió,
quién operó,
bajo qué responsabilidad institucional,
cuándo ocurrió,
con qué contexto mínimo.
```

`TraceabilityRecord` no usa soft delete.

### 3.7 Entidades puente explícitas

Se aprobaron relaciones N:M mediante entidades puente explícitas:

```text
content_sources
content_validations
content_campaigns
content_diseases
campaign_diseases
content_media_resources
content_categories
content_tags
publication_channels
timeline_event_contents
```

Los modelos puente simples no usan `deletedAt` para evitar conflicto conceptual y técnico con restricciones `@@unique`.

### 3.8 Tablas explícitamente prohibidas

Quedan prohibidas, entre otras:

```text
knowledge_core
cms_posts
posts
news
notices
statements
documents
infographics
faqs
campaign_contents
disease_contents
social_posts
facebook_posts
instagram_posts
x_posts
tiktok_posts
youtube_posts
ai_knowledge
embeddings
vectors
pgvector_documents
chatbot_answers
```

Motivos principales:

- Knowledge Core es núcleo conceptual, no tabla.
- El sistema no es CMS genérico.
- Content no se fragmenta por tipo editorial.
- Campaign y Disease no son subtipos de Content.
- Canales externos no son tablas propias.
- IA, embeddings y pgvector quedan fuera del MVP.

---

## 4. Documentos y artefactos generados durante la fase

```text
database.md
prompt_correccion_database.md
erd.md
prompt_correccion_erd.md
schema-prisma.md
schema-prisma_corregido.md
prompt_correccion_schema_prisma.md
schema.prisma
prisma/schema.prisma
```

---

## 5. Estado del archivo `schema.prisma`

El archivo `prisma/schema.prisma` fue generado como primer artefacto técnico inicial.

Estado:

```text
Generado para revisión técnica inicial.
No migrado.
No ejecutado.
No conectado al backend.
No validado mediante Prisma CLI.
```

Validaciones conceptuales aplicadas:

```text
Modelos Prisma: 24
Enums técnicos: 9
TraceabilityRecord sin deletedAt
Modelos puente sin deletedAt
Sin migraciones
Sin SQL
Sin seeds
Sin API
Sin backend
```

Antes de cualquier comando técnico se recomienda revisar el archivo real `prisma/schema.prisma`.

No ejecutar todavía:

```bash
npx prisma migrate dev
npx prisma db push
npx prisma generate
```

---

## 6. Límites que siguen vigentes

Todavía no se autoriza:

```text
migraciones
SQL manual
seeders
repositorios NestJS
servicios
casos de uso implementados
DTOs
controllers
endpoints
frontend
backend
integraciones externas
IA
pgvector
embeddings
chatbot
```

---

## 7. Siguiente fase

La siguiente fase es:

```text
Phase 05 — API
```

Documento recomendado para continuar:

```text
docs/05-api/api.md
```

Documento posterior esperado:

```text
docs/05-api/authentication.md
```

---

## 8. Recomendación para iniciar Phase 05

Antes de diseñar API se recomienda una revisión breve de `prisma/schema.prisma` como artefacto técnico real, solo para detectar fricciones evidentes con Prisma.

Después, `docs/05-api/api.md` debe diseñar la superficie API desde casos de uso y dominio, usando Database como baseline, sin permitir que Prisma gobierne el diseño de la API.

Orden recomendado:

```text
1. Revisar prisma/schema.prisma como artefacto técnico inicial.
2. Confirmar cierre formal de Phase 04 — Database.
3. Iniciar docs/05-api/api.md.
4. Después elaborar docs/05-api/authentication.md.
```

---

## 9. Criterio de transferencia

Este paquete debe permitir que un nuevo chat continúe el proyecto sin reabrir decisiones ya aprobadas.

Cualquier propuesta futura debe respetar:

```text
Negocio → Dominio → Arquitectura → Persistencia → Implementación
```

La API no debe redefinir dominio, persistencia ni arquitectura. Debe exponer capacidades institucionales coherentes con el Knowledge Lifecycle.
