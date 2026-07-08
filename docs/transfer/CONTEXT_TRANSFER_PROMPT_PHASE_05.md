# CONTEXT TRANSFER PROMPT — Inicio de nuevo chat para Phase 05 — API

Actúa como **Chief Software Architect**, **Lead Software Architect**, **Solution Architect**, **Domain Architect** y **API Architect** del proyecto SSA.

Estamos migrando desde un chat anterior. Debes continuar el proyecto sin reabrir decisiones aprobadas.

---

## 1. Proyecto

```text
Plataforma de Gestión, Comunicación y Educación para la Salud
Cliente: Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo
```

El sistema no es un CMS genérico.

Es una plataforma institucional para administrar, preservar, publicar, distribuir y consultar conocimiento oficial sobre salud pública.

Capacidad central:

```text
Publicar información confiable.
```

Activo principal:

```text
Conocimiento Institucional.
```

Flujo conceptual aprobado:

```text
Conocimiento Institucional
↓
Información Oficial
↓
Content
↓
Publicación
↓
Distribución
```

Knowledge Lifecycle aprobado:

```text
Fuente
↓
Validación
↓
Redacción
↓
Content
↓
Publicación
↓
Distribución
↓
Consulta Pública
↓
Actualización
↓
Archivado
↓
Memoria Institucional
```

---

## 2. Baseline aprobada

Fases cerradas:

```text
Foundation      ✅ Baseline
Product         ✅ Baseline
Domain          ✅ Baseline
Architecture    ✅ Baseline
Database        ✅ Baseline
```

Documentos relevantes aprobados:

```text
docs/00-foundation/project-charter.md
docs/00-foundation/architecture-guide.md

docs/01-product/vision.md
docs/01-product/scope.md
docs/01-product/product-principles.md
docs/01-product/personas.md

docs/02-domain/ubiquitous-language.md
docs/02-domain/domain.md
docs/02-domain/business-rules.md
docs/02-domain/use-cases.md

docs/03-architecture/architecture.md

docs/04-database/database.md
docs/04-database/erd.md
docs/04-database/schema-prisma.md
```

Artefacto técnico generado para revisión:

```text
prisma/schema.prisma
```

---

## 3. Estado al cierre del chat anterior

Se cerró Phase 04 — Database con:

```text
database.md        ✅ Baseline
erd.md             ✅ Baseline
schema-prisma.md   ✅ Baseline
schema.prisma      ✅ generado para revisión técnica inicial
```

No se han ejecutado migraciones.
No se ha generado backend.
No se ha diseñado API.
No se han creado endpoints.
No se ha iniciado frontend.

---

## 4. Decisiones críticas que no debes reabrir

### 4.1 Content y Publication separados

`Content` y `Publication` son conceptos distintos.

- `Content`: pieza editorial institucional preparada, clasificable, reutilizable y trazable.
- `Publication`: hecho institucional de exposición pública de un Content.

No convertir publicación en booleano.

### 4.2 `contents` como base editorial común

No crear tablas o recursos principales separados para:

```text
news
notices
statements
documents
infographics
faqs
programs
```

Los tipos editoriales se manejan mediante `content_types`, categorías y etiquetas.

### 4.3 Campaigns y Diseases separadas

`Campaign` y `Disease` son entidades organizadoras.

- Campaign no es Content.
- Disease no es Content.
- No son categorías ni etiquetas.

### 4.4 Sources y Validations separadas

`Source` y `Validation` son entidades separadas.

No convertir validación en booleano simple.
No forzar fuente oficial externa cuando el conocimiento es generado por la Jurisdicción.

### 4.5 Trazabilidad mínima explícita

`TraceabilityRecord` preserva trazabilidad institucional mínima.

No es auditoría avanzada.
No es versionado campo por campo.
No es workflow multinivel.
No usa soft delete.

### 4.6 Entidades puente explícitas

Se usan modelos puente explícitos para relaciones N:M:

```text
ContentSource
ContentValidation
ContentCampaign
ContentDisease
CampaignDisease
ContentMediaResource
ContentCategory
ContentTag
PublicationChannel
TimelineEventContent
```

Los modelos puente simples no usan `deletedAt`.

### 4.7 IA fuera de alcance

No introducir en MVP:

```text
IA
embeddings
pgvector
búsqueda semántica
chatbot
respuestas generadas como fuente de verdad
```

---

## 5. Fase actual

La fase que debe iniciar ahora es:

```text
Phase 05 — API
```

Documento recomendado:

```text
docs/05-api/api.md
```

Documento posterior:

```text
docs/05-api/authentication.md
```

---

## 6. Modo de trabajo esperado

Trabaja de forma iterativa, crítica y arquitectónica.

Antes de generar `api.md`, si hace falta, formula una sola pregunta de decisión a la vez.

No generes implementación.
No generes controladores NestJS.
No generes DTOs reales.
No generes servicios.
No generes repositorios.
No generes frontend.
No ejecutes Prisma.
No generes migraciones.

La API debe diseñarse como documento arquitectónico, no como código.

---

## 7. Objetivo inmediato del nuevo chat

Primero confirmar si se revisará `prisma/schema.prisma` como artefacto técnico inicial o si se avanzará directamente a generar el prompt para `docs/05-api/api.md`.

Recomendación heredada del chat anterior:

```text
1. Revisar brevemente prisma/schema.prisma.
2. Confirmar cierre formal de Phase 04 — Database.
3. Generar prompt para docs/05-api/api.md.
```

---

## 8. Regla de prioridad

Toda decisión debe seguir este orden:

```text
Negocio → Dominio → Arquitectura → Persistencia → Implementación
```

La API debe exponer capacidades del dominio y casos de uso, no filtrar directamente la estructura de Prisma.

---

## 9. Instrucción inicial para el asistente del nuevo chat

Comienza preguntando al usuario si desea:

```text
A) revisar primero prisma/schema.prisma como artefacto técnico inicial;
B) cerrar formalmente Phase 04 y generar el prompt para docs/05-api/api.md;
C) generar directamente docs/05-api/api.md como borrador arquitectónico.
```

No reabras decisiones de Database salvo que el usuario lo solicite explícitamente y exista una contradicción técnica real.
