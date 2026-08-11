# Implementation Start

| Campo | Valor |
|---|---|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Implementation Start |
| Fase | Implementation / Phase 10 operativa |
| Estado | Baseline |
| Rol arquitectónico | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect, Backend Architect, Frontend Architect, DevOps Architect & Implementation Architect |
| Fecha | 2026-07-09 |

---

## 1. Propósito

Este documento define el arranque seguro de la etapa de **Implementation** del proyecto SSA.

Su objetivo es convertir la baseline documental aprobada en una ejecución técnica ordenada, incremental y verificable, sin reabrir decisiones cerradas ni iniciar código de forma prematura.

La implementación deberá preservar la capacidad central del producto:

> **Publicar información confiable.**

Y deberá proteger el activo principal del sistema:

> **Conocimiento Institucional.**

Este documento no implementa código, no ejecuta Prisma, no crea infraestructura, no define endpoints nuevos y no modifica arquitectura, dominio, base de datos, API, frontend, backend, AI ni DevOps.

---

## 2. Estado de entrada a Implementation

La etapa Implementation inicia después del cierre documental de las siguientes fases. Este documento queda aprobado como baseline de arranque operativo para iniciar únicamente el Slice 0 bajo control del Lead Developer:

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
Implementation  ✅ Baseline de arranque
```

La fase DevOps dejó definido que el proyecto continúa sin implementación productiva real, sin ejecución de migraciones, sin despliegues reales y sin configuración definitiva de proveedores hasta autorización explícita del Lead Developer.

---

## 3. Decisiones de arranque aprobadas

El Lead Developer aprueba este documento como baseline de arranque de Implementation. La autorización concedida se limita al arranque operativo controlado y no habilita migraciones, seeds, despliegues, conexión productiva ni cambios de dominio.

| Decisión | Resolución aprobada | Alcance de la autorización |
|---|---|---|
| Carpeta de Implementation | Usar `docs/10-implementation/` | Aprobado como ubicación documental oficial para esta etapa. |
| Estructura de repositorio | Usar monorepo ligero con `apps/web`, `apps/api`, `packages/shared`, `prisma` y `docs` | Aprobado para preparación inicial del repositorio. |
| Gestor de paquetes | Usar `pnpm` | Aprobado para configuración inicial del workspace. |
| Versión Node.js | Usar Node.js LTS recomendada `22.x` | Aprobado como versión objetivo inicial, salvo incompatibilidad técnica documentada. |
| Inicio técnico autorizado | Autorizar únicamente `Slice 0 — Preparación controlada` | Aprobado. No autoriza slices posteriores. |
| Prisma | Autorizar solo revisión estática/documental por ahora | No se autorizan `migrate dev`, `db push`, `generate`, seeds ni conexión real al backend. |
| Seeds / usuario administrador | No autorizado todavía | Requiere decisión posterior después de validar Prisma localmente. |
| Almacenamiento multimedia inicial | Mantener pendiente de implementación real | Deberá implementarse después mediante `StorageProvider`; no se aprueba proveedor remoto todavía. |
| Staging / producción | No autorizado todavía | No se aprueba despliegue remoto ni proveedor productivo. |
| Estado documental | Cambiar `implementation-start.md` a `Baseline` | Aprobado. |

### Alcance de la autorización vigente

Queda autorizado iniciar únicamente:

```text
Slice 0 — Preparación controlada
```

La autorización incluye:

- preparar estructura documental y de repositorio;
- configurar monorepo ligero si el repositorio real lo permite;
- definir `pnpm` como gestor;
- preparar archivos de ejemplo sin secretos;
- revisar `schema.prisma` de forma estática/documental;
- actualizar documentación de arranque.

La autorización no incluye:

```text
prisma migrate dev
prisma db push
prisma generate
seeds
usuario administrador inicial
conexión backend-base de datos
despliegue staging
despliegue producción
proveedor remoto de almacenamiento
cambios de dominio
cambios de schema por conveniencia técnica
```


## 4. Fuentes documentales de autoridad

Implementation deberá derivarse de la baseline aprobada en el siguiente orden:

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
AI
↓
DevOps
↓
Implementation
```

La implementación no deberá invertir este orden.

Documentos fuente relevantes:

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
prisma/schema.prisma

docs/05-api/api.md
docs/05-api/authentication.md

docs/06-frontend/frontend.md

docs/07-backend/backend.md
docs/07-backend/implementation-plan.md
docs/07-backend/transfer-package.md

docs/08-ai/ai.md
docs/08-ai/transfer-package.md

docs/09-devops/devops.md
docs/09-devops/deployment-strategy.md
docs/09-devops/environment-strategy.md
docs/09-devops/transfer-package.md
```

---

## 5. Decisiones cerradas que Implementation no debe reabrir

Las siguientes decisiones son baseline y deberán tratarse como restricciones de implementación.

### 5.1 Content y Publication separados

`Content` y `Publication` permanecen separados.

- `Content` representa la pieza editorial institucional preparada, clasificable, reutilizable y trazable.
- `Publication` representa el hecho institucional de exposición pública de un `Content`.

Implementation no deberá convertir publicación en booleano ni fusionar ambos conceptos.

### 5.2 `contents` como base editorial común

No se deberán crear módulos principales, tablas principales, rutas principales ni modelos principales independientes para:

```text
news
notices
statements
documents
infographics
faqs
programs
```

Los tipos editoriales se manejarán mediante `content_types`, categorías, etiquetas y metadatos aprobados.

### 5.3 Campaign y Disease como entidades organizadoras

`Campaign` y `Disease` no son `Content`, no son categorías y no son etiquetas.

Implementation deberá tratarlas como entidades organizadoras relacionadas con contenidos.

### 5.4 Source y Validation separados

`Source` y `Validation` son conceptos y modelos separados.

Implementation no deberá reducir validación a un booleano simple ni forzar una fuente oficial externa cuando el conocimiento haya sido generado por la Jurisdicción.

### 5.5 Trazabilidad mínima explícita

`TraceabilityRecord` preserva trazabilidad institucional mínima.

No deberá convertirse en:

```text
auditoría avanzada
versionado campo por campo
workflow multinivel
sistema de compliance
```

`TraceabilityRecord` no usa soft delete en el MVP.

### 5.6 Timeline independiente

`TimelineEvent` preserva memoria institucional y cuenta con multimedia propia mediante `TimelineEventMediaResource`.

La Línea del Tiempo no es agenda general, bitácora administrativa ni simple contenido estático.

### 5.7 IA fuera del MVP

Implementation no deberá introducir:

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

La IA queda como capacidad futura, gobernada y subordinada a conocimiento institucional validado.

### 5.8 DevOps MVP sin sobreingeniería

Implementation deberá respetar la estrategia DevOps MVP:

```text
Proveedor-neutral
Menor costo posible sin sacrificar MVP
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

## 6. Estado técnico inicial conocido

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

Queda prohibido ejecutar sin autorización explícita del Lead Developer:

```bash
npx prisma migrate dev
npx prisma db push
npx prisma generate
```

También queda prohibido ejecutar cualquier comando equivalente que altere una base de datos, genere cliente Prisma para uso real o cree migraciones sin revisión previa.

---

## 7. Objetivo operativo de Implementation

Implementation deberá convertir la baseline en producto funcional mediante vertical slices seguros.

La implementación no deberá avanzar por capas aisladas interminables. Cada incremento deberá producir una capacidad verificable, aunque sea mínima.

Objetivo operativo:

> Implementar el MVP institucional por cortes funcionales, conservando dominio, seguridad, trazabilidad, documentación y bajo costo operativo.

---

## 8. Precondiciones antes de escribir código

Antes de iniciar código, deberán cumplirse o declararse explícitamente las siguientes precondiciones.

### 8.1 Precondiciones documentales

- Baseline confirmada como fuente de verdad.
- Carpeta de implementación definida.
- Este documento revisado por el Lead Developer.
- Decisiones de arranque registradas.
- Criterios para ejecutar Prisma definidos.
- Criterios de estructura inicial del repositorio definidos.

### 8.2 Precondiciones técnicas

- Repositorio disponible localmente.
- Rama de trabajo definida.
- Versión de Node.js definida para frontend y backend.
- Gestor de paquetes definido.
- PostgreSQL local disponible o decisión explícita de usar contenedor/local provider.
- Variables `.env.example` definidas sin secretos reales.
- Secretos reales fuera de Git.
- `schema.prisma` revisado antes de ejecución.

### 8.3 Precondiciones de seguridad

- TypeScript strict obligatorio.
- Validación de DTOs desde el inicio del backend.
- Sanitización considerada desde formularios y API.
- Refresh token mediante cookie HttpOnly.
- Argon2 para hash de contraseña.
- Sin registro público.
- Sin credenciales productivas por defecto.
- CORS restringido por ambiente.

### 8.4 Precondiciones de autorización

Requieren autorización explícita del Lead Developer:

- iniciar configuración técnica real del repositorio;
- ejecutar cualquier comando Prisma;
- crear migraciones;
- aplicar `db push`;
- generar cliente Prisma para integración real;
- crear seed inicial;
- crear usuario administrador inicial;
- conectar backend con base de datos;
- desplegar cualquier ambiente remoto;
- definir proveedor productivo;
- modificar `schema.prisma` por razones de implementación.

---

## 9. Estructura inicial aprobada del repositorio

La estructura exacta podrá ajustarse al repositorio real, pero Implementation deberá preservar separación entre frontend, backend, Prisma y documentación.

Estructura aprobada para arranque:

```text
.
├── docs/
│   ├── 00-foundation/
│   ├── 01-product/
│   ├── 02-domain/
│   ├── 03-architecture/
│   ├── 04-database/
│   ├── 05-api/
│   ├── 06-frontend/
│   ├── 07-backend/
│   ├── 08-ai/
│   ├── 09-devops/
│   └── 10-implementation/
│       ├── implementation-start.md
│       ├── implementation-plan.md
│       ├── implementation-checklist.md
│       └── transfer-package.md
├── prisma/
│   └── schema.prisma
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── shared/
├── .env.example
├── README.md
└── package.json
```

Alternativa no seleccionada para esta baseline, conservada solo como referencia histórica:

```text
.
├── docs/
│   └── implementation/
├── frontend/
├── backend/
├── prisma/
├── .env.example
└── README.md
```

### Decisión aprobada

Usar:

```text
docs/10-implementation/
```

Justificación:

- preserva continuidad secuencial posterior a `docs/09-devops/`;
- evita ambigüedad documental;
- no introduce nueva arquitectura;
- facilita cierre posterior mediante `transfer-package.md`.

---

## 10. Criterios para validar `schema.prisma`

Antes de ejecutar cualquier comando Prisma, deberá realizarse una revisión en dos niveles.

### 10.1 Revisión conceptual

Validar que el archivo conserve:

- separación `Content` / `Publication`;
- `ContentType`, categorías y etiquetas como clasificación editorial;
- `Campaign` y `Disease` como entidades propias;
- `Source` y `Validation` separadas;
- entidades puente explícitas;
- `TraceabilityRecord` sin soft delete;
- ausencia de IA, embeddings, pgvector o chatbot;
- ausencia de tablas prohibidas;
- correspondencia con `schema-prisma.md`.

### 10.2 Revisión técnica previa a comandos

Validar:

- sintaxis Prisma mediante revisión estática;
- consistencia de relaciones;
- nombres de relaciones en modelos con múltiples FK hacia la misma entidad;
- relaciones opcionales vs obligatorias;
- `@@unique` en modelos puente;
- ausencia de `deletedAt` en puentes simples;
- compatibilidad de enums con el diseño API aprobado;
- inexistencia de migraciones previas contradictorias.

### 10.3 Comandos aún no autorizados

Los siguientes comandos deberán esperar autorización específica:

```bash
npx prisma validate
npx prisma format
npx prisma generate
npx prisma migrate dev
npx prisma db push
```

Nota: aunque `validate` y `format` no deberían modificar base de datos, se mantienen bajo autorización inicial para conservar control de arranque.

---

## 11. Criterios para iniciar backend

El backend podrá iniciar cuando se cumplan estas condiciones:

- estructura base NestJS autorizada;
- estrategia de módulos alineada con backend baseline;
- `.env.example` definido;
- configuración de TypeScript strict;
- configuración inicial de validación global;
- estrategia de errores definida;
- health check técnico básico permitido;
- Prisma revisado y autorizado para integración local;
- autenticación administrativa inicial autorizada.

### Backend base mínimo permitido después de autorización

Primer backend técnico recomendado:

```text
1. Proyecto NestJS base.
2. Configuración TypeScript strict.
3. Configuración de variables de entorno.
4. Health check técnico sin datos sensibles.
5. Configuración Prisma local después de autorización.
6. Módulo Auth administrativo inicial.
7. Módulo Content mínimo.
```

### Backend no permitido en el arranque

No implementar todavía:

```text
roles avanzados
workflow editorial multinivel
auditoría avanzada
versionado campo por campo
IA
chatbot
integración automática con redes sociales
APM avanzado
```

---

## 12. Criterios para iniciar frontend

El frontend podrá iniciar cuando se cumplan estas condiciones:

- estructura React/Vite autorizada;
- Material UI configurado;
- React Router definido;
- TanStack Query configurado;
- Axios configurado con manejo de sesión;
- React Hook Form + Zod para formularios administrativos;
- rutas públicas y administrativas mínimas definidas;
- diseño responsive básico establecido;
- autenticación backend mínima disponible o simulación local explícitamente autorizada.

### Frontend público mínimo recomendado

```text
1. Layout público base.
2. Página de inicio mínima.
3. Listado público de publicaciones.
4. Detalle público de publicación.
5. Navegación por clasificación básica.
6. Búsqueda básica.
```

### Frontend administrativo mínimo recomendado

```text
1. Login administrativo.
2. Shell administrativo protegido.
3. Listado de contenidos.
4. Crear / editar Content mínimo.
5. Preparar Publication mínima.
6. Gestión básica de recursos multimedia.
```

---

## 13. Secuencia aprobada de implementación

La implementación deberá avanzar por vertical slices verificables.

### Slice 0 — Preparación controlada

Propósito: preparar repositorio sin alterar base de datos ni generar migraciones.

Incluye:

- estructura del repositorio;
- scripts base;
- linters / formatters si se aprueban;
- `.env.example`;
- documentación de arranque;
- revisión de `schema.prisma`.

Criterio de salida:

```text
Repositorio preparado y documentado, sin migraciones ejecutadas.
```

### Slice 1 — Backend base y health check

Propósito: habilitar base operativa del backend.

Incluye:

- NestJS base;
- configuración por ambiente;
- validación global;
- manejo básico de errores;
- health check sin exposición sensible.

Criterio de salida:

```text
Backend arranca localmente y expone health check técnico básico.
```

### Slice 2 — Prisma local controlado

Propósito: conectar backend a persistencia local bajo autorización.

Incluye:

- validación de `schema.prisma`;
- generación Prisma local si se autoriza;
- migración local si se autoriza;
- conexión controlada a PostgreSQL local;
- prueba mínima de conectividad.

Criterio de salida:

```text
Prisma validado y backend conectado localmente sin afectar producción.
```

### Slice 3 — Autenticación administrativa inicial

Propósito: proteger administración desde el inicio.

Incluye:

- login;
- refresh token HttpOnly;
- logout;
- usuario administrativo inicial autorizado;
- hash Argon2;
- sin registro público.

Criterio de salida:

```text
Panel administrativo puede protegerse mediante sesión segura básica.
```

### Slice 4 — Content base

Propósito: implementar la base editorial común.

Incluye:

- crear Content;
- editar Content;
- listar Content administrativo;
- consultar Content por id/slug donde aplique;
- estados editoriales mínimos;
- clasificación por `content_type`.

Criterio de salida:

```text
El sistema puede administrar una pieza editorial común sin fragmentar tipos editoriales.
```

### Slice 5 — Publication base

Propósito: separar exposición pública del Content.

Incluye:

- crear Publication desde Content preparado;
- estado de Publication;
- fechas de publicación;
- disponibilidad pública;
- consulta pública mínima.

Criterio de salida:

```text
Un Content puede exponerse públicamente mediante Publication sin usar booleano de publicación.
```

### Slice 6 — Consulta pública mínima

Propósito: entregar valor ciudadano inicial.

Incluye:

- listado público de publicaciones;
- detalle público;
- slugs;
- SEO básico;
- diferenciación básica de vigente / histórico cuando aplique.

Criterio de salida:

```text
La población puede consultar información oficial publicada desde el portal público mínimo.
```

### Slice 7 — Recursos multimedia

Propósito: asociar recursos a contenidos sin duplicación innecesaria.

Incluye:

- registro de MediaResource;
- asociación con Content;
- almacenamiento local controlado si se autoriza;
- abstracción `StorageProvider` en backend;
- respaldo considerado desde DevOps.

Criterio de salida:

```text
Los contenidos pueden asociar recursos multimedia reutilizables.
```

### Slice 8 — Clasificación básica

Propósito: mejorar navegación y búsqueda básica.

Incluye:

- categorías;
- etiquetas;
- tipos de contenido;
- filtros públicos y administrativos básicos.

Criterio de salida:

```text
La información puede encontrarse por criterios editoriales comprensibles.
```

### Slice 9 — Campaign / Disease

Propósito: implementar organizadores institucionales aprobados.

Incluye:

- Campaign como entidad propia;
- Disease como entidad propia;
- relación con Content;
- vistas públicas mínimas.

Criterio de salida:

```text
Campañas y enfermedades organizan publicaciones sin convertirse en Content, categoría ni etiqueta.
```

### Slice 10 — Timeline

Propósito: preservar memoria institucional.

Incluye:

- TimelineEvent;
- TimelineEventMediaResource;
- relación opcional con Content;
- consulta pública de línea del tiempo.

Criterio de salida:

```text
La línea del tiempo funciona como memoria institucional administrable, no como agenda general.
```

### Slice 11 — Canales asistidos

Propósito: preparar distribución sin integración automática compleja.

Incluye:

- CommunicationChannel;
- PublicationChannel;
- preparación manual asistida;
- registro de estado de distribución.

Criterio de salida:

```text
Una Publication puede prepararse para distribución por canales sin convertirlos en fuente de verdad.
```

### Slice 12 — Trazabilidad mínima

Propósito: registrar eventos institucionales relevantes del ciclo de vida.

Incluye:

- TraceabilityRecord;
- eventos mínimos de creación, validación, preparación, publicación, retiro y archivo;
- relación con operador autenticado;
- sin auditoría avanzada.

Criterio de salida:

```text
El sistema conserva trazabilidad institucional mínima sin implementar compliance avanzado.
```

### Slice 13 — End-to-end MVP

Propósito: integrar capacidades esenciales.

Incluye:

- login administrativo;
- creación de Content;
- preparación de Publication;
- consulta pública;
- recurso multimedia;
- clasificación;
- trazabilidad mínima;
- validaciones técnicas básicas;
- documentación sincronizada.

Criterio de salida:

```text
El MVP permite publicar información confiable de forma administrable, trazable y consultable.
```

---

## 14. Validaciones mínimas por incremento

Cada slice deberá cumplir validaciones mínimas antes de avanzar.

### 14.1 Validaciones funcionales

- La capacidad implementada responde a un caso de uso aprobado.
- No introduce conceptos fuera del dominio.
- No rompe separación entre Content, Publication, Campaign, Disease, Source y Validation.
- No introduce capacidades fuera del MVP.

### 14.2 Validaciones técnicas

- TypeScript strict sin errores.
- DTOs validados.
- Manejo de errores consistente.
- Sin secretos versionados.
- Sin uso innecesario de `any`.
- Sin acoplamiento directo de dominio a Prisma.
- Sin lógica de negocio en controllers.

### 14.3 Validaciones de seguridad

- Endpoints administrativos protegidos.
- Refresh token en cookie HttpOnly.
- Contraseñas con Argon2.
- CORS restringido por ambiente.
- Sanitización considerada en entradas ricas de contenido.
- No registro público.

### 14.4 Validaciones documentales

- Cambios relevantes documentados.
- Desviaciones registradas.
- README actualizado cuando afecte operación local.
- `.env.example` actualizado sin secretos.
- Checklist de implementación actualizado si existe.

---

## 15. Qué puede implementarse primero

Puede implementarse primero, una vez autorizado:

```text
estructura del repositorio
configuración base TypeScript
configuración base NestJS
configuración base React/Vite
.env.example sin secretos
health check técnico
validación estática de schema.prisma
autenticación administrativa inicial
Content base administrativo
Publication base pública
```

Debe priorizarse lo que reduzca riesgo estructural y habilite vertical slices.

---

## 16. Qué debe esperar

Debe esperar:

```text
migraciones Prisma
seeds
usuario administrador inicial
conexión real backend-base de datos
subida real de archivos
proveedor remoto de almacenamiento
despliegue staging
producción
integración automática con redes sociales
roles avanzados
workflow editorial multinivel
auditoría avanzada
IA
chatbot
pgvector
```

Estas acciones requieren autorización específica o pertenecen a evolución posterior.

---

## 17. Riesgos de implementación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Iniciar código sin revisar `schema.prisma` | Migraciones incorrectas o modelo persistente inconsistente | Revisión conceptual y técnica antes de Prisma |
| Convertir Publication en booleano | Rompe dominio y trazabilidad | Mantener modelo separado `Publication` |
| Fragmentar Content por tipos editoriales | CMS genérico y duplicación | Usar `content_types`, categorías y etiquetas |
| Introducir IA en MVP | Aumenta complejidad y contradice baseline | Mantener IA fuera del MVP |
| Implementar roles avanzados prematuramente | Sobrecarga del MVP | Mantener actor administrativo unificado |
| Subir multimedia sin abstracción | Acoplamiento al filesystem | Usar `StorageProvider` desde el inicio |
| Ejecutar migraciones sin respaldo o revisión | Pérdida o corrupción de datos | Migraciones controladas y autorizadas |
| Resolver contradicciones silenciosamente | Pérdida de coherencia documental | Registrar desviaciones y decisión del Lead Developer |
| Desplegar automático a producción | Riesgo operativo | Producción manual/controlada |
| Exponer secretos | Riesgo de seguridad | Secretos fuera de Git y `.env.example` seguro |

---

## 18. Registro de desviaciones

Si durante implementación aparece una necesidad que contradice la baseline, no deberá resolverse silenciosamente.

Debe registrarse:

```text
ID de desviación:
Fecha:
Slice afectado:
Documento afectado:
Decisión baseline afectada:
Descripción de la contradicción:
Alternativas evaluadas:
Impacto técnico:
Impacto de dominio:
Impacto de producto:
Decisión del Lead Developer:
Acción documental requerida:
```

Ninguna desviación deberá implementarse sin decisión explícita.

---

## 19. Decisiones de autorización

### 19.1 Decisiones ya autorizadas para Slice 0

Quedan aprobadas para el arranque controlado:

- crear o preparar `docs/10-implementation/`;
- usar estructura de monorepo ligero con `apps/web`, `apps/api`, `packages/shared`, `prisma` y `docs`;
- usar `pnpm`;
- usar Node.js LTS recomendada `22.x`;
- preparar archivos de configuración inicial sin secretos;
- revisar `schema.prisma` solo de forma estática/documental;
- documentar tareas y criterios de salida del Slice 0.

### 19.2 Decisiones que siguen requiriendo autorización posterior

Requieren autorización explícita posterior:

- ejecutar comandos Prisma;
- modificar `schema.prisma`;
- crear migraciones;
- crear seeds;
- crear usuario administrador inicial;
- conectar backend con base de datos;
- definir almacenamiento multimedia local productivo;
- elegir proveedor de despliegue;
- habilitar staging remoto;
- desplegar producción;
- iniciar slices posteriores al Slice 0;
- alterar alcance del MVP;
- introducir cualquier capacidad fuera de baseline.

---

## 20. Decisión de arranque aprobada

Este documento queda aprobado como baseline de arranque. La siguiente documentación recomendada, si se requiere antes de tareas técnicas detalladas, es:

```text
docs/10-implementation/implementation-plan.md
```

Ese documento deberá convertir esta estrategia en un plan ejecutable por tareas, con dependencias, criterios de salida y orden de commits sugerido.

El Lead Developer autoriza iniciar configuración técnica únicamente dentro de:

```text
Slice 0 — Preparación controlada
```

Sin migraciones, sin conexión productiva, sin despliegues y sin cambios de dominio.

---

## 21. Checklist de aprobación del documento

Checklist aprobado por el Lead Developer:

- [x] Se acepta usar `docs/10-implementation/`.
- [x] Se confirma que Implementation no reabre baseline.
- [x] Se confirma que no se ejecutará Prisma sin autorización.
- [x] Se confirma que no se introducirá IA en MVP.
- [x] Se confirma que no se fragmentará Content por tipos editoriales.
- [x] Se confirma que Publication seguirá separada de Content.
- [x] Se confirma que Campaign y Disease serán entidades organizadoras.
- [x] Se confirma que Source y Validation seguirán separadas.
- [x] Se confirma que TraceabilityRecord será trazabilidad mínima, no auditoría avanzada.
- [x] Se confirma que DevOps seguirá estrategia MVP sin Kubernetes.
- [x] Se autoriza únicamente el inicio de `Slice 0 — Preparación controlada`.

---

## 22. Registro de aprobación

| Fecha | Decisión | Responsable | Resultado |
|---|---|---|---|
| 2026-07-09 | Aprobar matriz de decisiones de arranque y cambiar documento a Baseline | Lead Developer | Aprobado |

La aprobación autoriza únicamente el arranque controlado del `Slice 0`. Cualquier acción fuera de ese alcance requiere autorización posterior explícita.


## 23. Estado final de este documento

```text
Estado: Baseline
Código: pendiente si se desea asignar numeración documental
Decisión registrada: aprobado como baseline de arranque de Implementation
Autorización vigente: iniciar únicamente `Slice 0 — Preparación controlada`
Acciones no autorizadas: Prisma commands, migraciones, seeds, usuario administrador inicial, conexión backend-base de datos, staging y producción
Siguiente acción recomendada: preparar tareas técnicas del Slice 0 o crear `implementation-plan.md` si se requiere mayor granularidad
```
