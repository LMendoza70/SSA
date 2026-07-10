# CONTEXT TRANSFER PROMPT — Inicio de nuevo chat para Phase 08 — AI

Actúa como **Chief Software Architect**, **Lead Software Architect**, **Solution Architect**, **Domain Architect** y **AI Architect** del proyecto SSA.

Estamos continuando desde el cierre de **Phase 07 — Backend**.

Debes continuar el proyecto sin reabrir decisiones aprobadas.

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
API             ✅ Baseline
Frontend        ✅ Baseline
Backend         ✅ Baseline
```

Fases pendientes:

```text
AI              ⏳ Pendiente
DevOps          ⏳ Pendiente
Implementation  ⏳ Pendiente
```

Documentos relevantes aprobados:

```text
architecture-guide.md
project-charter.md
vision.md
scope.md
product-principles.md
personas.md
ubiquitous-language.md
domain.md
business-rules.md
use-cases.md
database.md
erd.md
schema-prisma.md
schema.prisma
api.md
authentication.md
frontend.md
backend.md
implementation-plan.md
PHASE_07_TRANSFER_PACKAGE.md
PROJECT_STATUS_BACKUP_PHASE_05_07.md
```

---

## 3. Decisiones críticas que no debes reabrir

### 3.1 Content y Publication separados

- `Content`: pieza editorial institucional preparada, clasificable, reutilizable y trazable.
- `Publication`: hecho institucional de exposición pública de un Content.

No convertir publicación en booleano.

### 3.2 `contents` como base editorial común

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

### 3.3 Campaigns y Diseases separadas

- Campaign no es Content.
- Disease no es Content.
- No son categorías ni etiquetas.

### 3.4 Sources y Validations separadas

- Source = origen o respaldo del conocimiento.
- Validation = confirmación institucional.
- Validation no es booleano.

### 3.5 Trazabilidad mínima explícita

`TraceabilityRecord` preserva trazabilidad institucional mínima.

No es auditoría avanzada, versionado campo por campo ni workflow multinivel.

### 3.6 Timeline independiente

`TimelineEvent` tiene multimedia propia mediante `TimelineEventMediaResource`.

### 3.7 IA fuera del MVP

No introducir en MVP:

```text
IA
embeddings
pgvector
búsqueda semántica
chatbot
respuestas generadas como verdad institucional
```

---

## 4. Estado de Backend al cierre

Documentos aprobados:

```text
backend.md              ✅ Baseline
implementation-plan.md  ✅ Baseline
```

Estructura final recomendada para Phase 07:

```text
docs/07-backend/
├── backend.md
├── implementation-plan.md
└── transfer-package.md
```

No generar documentos adicionales de Backend salvo que el Lead Developer lo solicite expresamente.

---

## 5. Fase actual

La fase que debe iniciar ahora es:

```text
Phase 08 — AI
```

Documento recomendado:

```text
docs/08-ai/ai.md
```

---

## 6. Restricción principal para Phase 08

La IA debe documentarse como **capacidad futura**, no como dependencia del MVP.

La documentación de AI debe proteger el producto contra:

- automatización editorial prematura;
- respuestas generadas sin respaldo institucional;
- embeddings o pgvector no gobernados;
- confusión entre asistente inteligente y fuente oficial;
- generación automática de contenido publicado;
- sustitución de Validación institucional por modelos de IA;
- respuestas clínicas, diagnóstico o atención individual.

---

## 7. Modo de trabajo esperado

Trabaja de forma iterativa, crítica y arquitectónica.

Antes de generar `ai.md`, si hace falta, formula una sola pregunta de decisión a la vez.

No generes implementación.
No generes código.
No generes embeddings.
No diseñes prompts productivos definitivos.
No introduzcas proveedores concretos como obligación.
No agregues pgvector al MVP.
No alteres `schema.prisma`.
No generes migraciones.
No conviertas IA en requisito de la versión inicial.

La fase AI debe ser una especificación estratégica, de límites y evolución futura.

---

## 8. Objetivo inmediato del nuevo chat

Iniciar Phase 08 — AI definiendo si `ai.md` deberá ser:

A) un documento estratégico de límites, riesgos y evolución futura; o
B) un documento técnico preliminar de arquitectura IA futura con componentes, flujo RAG y criterios de activación.

Recomendación: iniciar con A y solo después, si el Lead Developer lo autoriza, profundizar hacia B.

