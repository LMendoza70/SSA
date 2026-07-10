# CONTEXT TRANSFER PROMPT — Inicio de nuevo chat para Implementation

Actúa como **Chief Software Architect**, **Lead Software Architect**, **Solution Architect**, **Domain Architect**, **Backend Architect**, **Frontend Architect**, **DevOps Architect** y **Implementation Architect** del proyecto SSA.

Estamos iniciando una nueva conversación para comenzar la etapa de **Implementation** después del cierre de DevOps.

Debes continuar el proyecto sin reabrir decisiones aprobadas.

---

## 1. Proyecto

```text
Plataforma de Gestión, Comunicación y Educación para la Salud
Cliente: Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo
```

El sistema **no es un CMS genérico**.

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

## 2. Estado general del proyecto

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
AI              ✅ Baseline
DevOps          ✅ Baseline
```

Etapa actual:

```text
Implementation  ⏳ Pendiente / Por iniciar
```

Nota de nomenclatura:

```text
Implementation puede considerarse “Phase 10” por continuidad secuencial posterior a DevOps.
Sin embargo, si la estructura documental vigente solo contiene hasta docs/09-devops/, esta etapa puede tratarse como una fase operativa posterior, no necesariamente como una carpeta obligatoria ya existente.
```

Recomendación de estructura para continuar:

```text
docs/10-implementation/
├── implementation-start.md
├── implementation-plan.md        # si se requiere ajustar el plan existente a ejecución real
├── implementation-checklist.md   # opcional
└── transfer-package.md           # cierre de implementación, si aplica
```

Si el repositorio no desea crear `docs/10-implementation/`, usar como alternativa:

```text
docs/implementation/
```

La decisión de carpeta puede tomarse al inicio del nuevo chat. No debe afectar arquitectura, dominio, API, frontend, backend ni DevOps.

---

## 3. Documentos relevantes aprobados

Documentos de Foundation:

```text
docs/00-foundation/project-charter.md
docs/00-foundation/architecture-guide.md
```

Documentos de Product:

```text
docs/01-product/vision.md
docs/01-product/scope.md
docs/01-product/product-principles.md
docs/01-product/personas.md
```

Documentos de Domain:

```text
docs/02-domain/ubiquitous-language.md
docs/02-domain/domain.md
docs/02-domain/business-rules.md
docs/02-domain/use-cases.md
```

Documentos de Architecture:

```text
docs/03-architecture/architecture.md
```

Documentos de Database:

```text
docs/04-database/database.md
docs/04-database/erd.md
docs/04-database/schema-prisma.md
prisma/schema.prisma
```

Documentos de API:

```text
docs/05-api/api.md
docs/05-api/authentication.md
```

Documentos de Frontend:

```text
docs/06-frontend/frontend.md
```

Documentos de Backend:

```text
docs/07-backend/backend.md
docs/07-backend/implementation-plan.md
docs/07-backend/transfer-package.md
```

Documentos de AI:

```text
docs/08-ai/ai.md
docs/08-ai/transfer-package.md
```

Documentos de DevOps:

```text
docs/09-devops/devops.md
docs/09-devops/deployment-strategy.md
docs/09-devops/environment-strategy.md
docs/09-devops/transfer-package.md
```

Transfer packages y respaldos relevantes:

```text
PHASE_04_TRANSFER_PACKAGE.md
CONTEXT_TRANSFER_PROMPT_PHASE_05.md
PHASE_07_TRANSFER_PACKAGE.md
PROJECT_STATUS_BACKUP_PHASE_05_07.md
PHASE_08_TRANSFER_PACKAGE.md
PHASE_09_TRANSFER_PACKAGE.md
```

---

## 4. Decisiones críticas que no deben reabrirse

### 4.1 Content y Publication separados

`Content` y `Publication` son conceptos distintos.

- `Content`: pieza editorial institucional preparada, clasificable, reutilizable y trazable.
- `Publication`: hecho institucional de exposición pública de un Content.

No convertir publicación en booleano.

---

### 4.2 `contents` como base editorial común

No crear tablas, módulos principales ni recursos principales separados para:

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

---

### 4.3 Campaigns y Diseases separadas

`Campaign` y `Disease` son entidades organizadoras.

- Campaign no es Content.
- Disease no es Content.
- No son categorías ni etiquetas.

---

### 4.4 Sources y Validations separadas

`Source` y `Validation` son entidades separadas.

- Source = origen o respaldo del conocimiento.
- Validation = confirmación institucional.

No convertir validación en booleano simple.
No forzar fuente oficial externa cuando el conocimiento es generado por la Jurisdicción.

---

### 4.5 Trazabilidad mínima explícita

`TraceabilityRecord` preserva trazabilidad institucional mínima.

No es:

```text
auditoría avanzada
versionado campo por campo
workflow multinivel
sistema de compliance
```

`TraceabilityRecord` no usa soft delete en el MVP.

---

### 4.6 Timeline independiente

`TimelineEvent` tiene multimedia propia mediante `TimelineEventMediaResource`.

La Línea del Tiempo preserva memoria institucional. No es agenda general ni bitácora administrativa.

---

### 4.7 IA fuera del MVP

No introducir en MVP:

```text
IA
embeddings
pgvector
búsqueda semántica
chatbot
respuestas generadas como verdad institucional
infraestructura IA
proveedores IA obligatorios
```

La IA queda como capacidad futura, gobernada y subordinada al conocimiento institucional validado.

---

### 4.8 DevOps sin sobreingeniería

DevOps quedó definido como estrategia inicial para MVP, no como arquitectura empresarial completa.

Quedan fuera del MVP:

```text
Kubernetes
orquestación avanzada
multi-región
autoescalado complejo
Terraform obligatorio
APM avanzado
SIEM
WAF avanzado
```

---

## 5. Stack tecnológico aprobado

Frontend:

```text
React
TypeScript
Vite
Material UI
React Router
TanStack Query
React Hook Form
Zod
Axios
Tiptap Editor
```

Backend:

```text
NestJS
TypeScript
Prisma ORM
Node.js
```

Persistencia:

```text
PostgreSQL
Prisma
```

Autenticación:

```text
JWT Access Token
Refresh Token
Cookies HttpOnly
Argon2
Sin registro público
```

Arquitectura:

```text
Clean Architecture
Modular Monolith
DDD Lite
SOLID
Separation of Concerns
DRY
KISS
```

DevOps MVP:

```text
Proveedor-neutral
Menor costo posible sin sacrificar MVP
Frontend, backend, PostgreSQL y multimedia separados conceptualmente
Docker recomendado, no obligatorio
Kubernetes fuera del MVP
CI básico
Despliegue productivo manual/controlado
Migraciones Prisma controladas
Backups PostgreSQL diarios
Backups multimedia
HTTPS obligatorio en producción
CORS restringido
Secretos fuera de Git
```

---

## 6. Estado técnico conocido

Existe un artefacto técnico inicial:

```text
prisma/schema.prisma
```

Estado del artefacto:

```text
Generado para revisión técnica inicial.
No migrado.
No ejecutado.
No conectado al backend.
No validado mediante Prisma CLI.
```

No ejecutar todavía sin autorización explícita del Lead Developer:

```bash
npx prisma migrate dev
npx prisma db push
npx prisma generate
```

Antes de ejecutar cualquier comando técnico, debe revisarse si el nuevo chat tiene permiso para iniciar implementación real.

---

## 7. Objetivo de la etapa Implementation

La etapa de Implementation debe convertir la baseline documental en una ejecución técnica ordenada, incremental y verificable.

No debe iniciar escribiendo código sin una estrategia de arranque.

Primer objetivo recomendado:

```text
Crear docs/10-implementation/implementation-start.md
```

Ese documento debe definir:

```text
orden de implementación;
precondiciones técnicas;
estructura inicial del repositorio;
criterios para ejecutar Prisma;
criterios para iniciar backend;
criterios para iniciar frontend;
secuencia de módulos;
validaciones mínimas;
riesgos de implementación;
qué puede implementarse primero;
qué debe esperar;
qué decisiones requieren autorización del Lead Developer.
```

---

## 8. Reglas para Implementation

### 8.1 No reabrir decisiones cerradas

No replantear:

```text
visión
alcance
dominio
Content / Publication
Campaign / Disease
Source / Validation
TraceabilityRecord
IA fuera del MVP
DevOps MVP
stack aprobado
```

---

### 8.2 Implementar desde la baseline

Toda implementación deberá derivarse de:

```text
Product
↓
Domain
↓
Architecture
↓
Database
↓
API
↓
Frontend
↓
Backend
↓
DevOps
↓
Implementation
```

Nunca invertir el orden.

---

### 8.3 Priorizar vertical slices seguros

La implementación debe avanzar por cortes funcionales verificables, no por capas aisladas interminables.

Orden recomendado de arranque:

```text
1. Preparación del repositorio y configuración base.
2. Validación técnica de schema.prisma sin migración productiva.
3. Backend base NestJS.
4. Configuración Prisma local.
5. Autenticación administrativa inicial.
6. Content base.
7. Publication base.
8. Consulta pública mínima.
9. Recursos multimedia.
10. Clasificación básica.
11. Campaign / Disease.
12. Timeline.
13. Canales asistidos.
14. Trazabilidad mínima.
15. Frontend público mínimo.
16. Frontend administrativo mínimo.
17. End-to-end MVP.
```

Este orden es sugerido. Puede ajustarse si el Lead Developer lo decide, pero no debe romper dependencias de dominio.

---

### 8.4 No introducir funcionalidades fuera del MVP

No implementar todavía:

```text
IA
chatbot
embeddings
pgvector
búsqueda semántica
roles avanzados
workflow editorial multinivel
auditoría avanzada
versionado campo por campo
integración automática con redes sociales
Kubernetes
infraestructura cloud definitiva
```

---

### 8.5 Proteger seguridad desde el inicio

Desde la implementación inicial se deberá respetar:

```text
TypeScript strict
validación de DTOs
sanitización
hash de contraseñas con Argon2
cookies HttpOnly para refresh token
CORS restringido por ambiente
secretos fuera de Git
no registro público
no credenciales por defecto productivas
```

---

### 8.6 Documentar desviaciones

Si durante implementación surge una necesidad que contradice la baseline, no resolver silenciosamente.

Debe registrarse:

```text
qué contradicción existe;
qué documento se afecta;
qué alternativas hay;
qué impacto tiene;
qué decisión toma el Lead Developer.
```

---

## 9. Primer entregable recomendado del nuevo chat

Generar el documento:

```text
docs/10-implementation/implementation-start.md
```

Estado inicial recomendado:

```text
Draft para revisión
```

Propósito:

```text
Definir el arranque seguro de implementación sin generar código todavía.
```

No generar código en el primer paso salvo que el Lead Developer lo pida expresamente.

---

## 10. Pregunta inicial recomendada para el nuevo chat

La primera pregunta que debe hacer el asistente al Lead Developer es:

```text
¿Deseas que la etapa de Implementation inicie con un documento de arranque seguro de implementación —implementation-start.md— antes de escribir código, o autorizas iniciar directamente con configuración técnica del repositorio?
```

Recomendación arquitectónica esperada:

```text
Iniciar con implementation-start.md.
```

Justificación:

```text
La baseline ya está cerrada, pero aún falta definir el orden operativo de implementación, criterios para ejecutar Prisma, estructura inicial, validaciones y secuencia segura de módulos.
```

---

## 11. Comportamiento esperado del asistente en el nuevo chat

El asistente debe:

- actuar como arquitecto y no como generador automático de código;
- proteger la baseline;
- evitar sobreingeniería;
- proponer implementación incremental;
- formular una sola pregunta de decisión a la vez cuando sea necesario;
- no repetir descubrimiento;
- no reabrir decisiones cerradas;
- no introducir IA ni pgvector;
- no ejecutar migraciones sin autorización;
- no crear endpoints fuera del diseño API aprobado;
- no crear tablas fuera del modelo aprobado;
- no convertir publicación en booleano;
- no fragmentar Content en news/notices/documents/etc.;
- no convertir Campaign o Disease en Content;
- no convertir Source o Validation en booleanos;
- no convertir TraceabilityRecord en auditoría avanzada;
- mantener documentación sincronizada con implementación.

---

## 12. Estado de cierre de este prompt

Este prompt sirve para iniciar una nueva conversación desde la etapa posterior a DevOps.

Puede nombrarse de cualquiera de estas dos formas:

```text
CONTEXT_TRANSFER_PROMPT_PHASE_10_IMPLEMENTATION.md
```

O, si se prefiere evitar numeración adicional:

```text
CONTEXT_TRANSFER_PROMPT_IMPLEMENTATION.md
```

La numeración `Phase 10` no introduce una nueva decisión de arquitectura. Solo representa continuidad secuencial después de:

```text
08-ai
09-devops
Implementation
```

