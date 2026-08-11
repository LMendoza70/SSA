# Checklist General del Proyecto — Slices de Implementación

| Campo | Valor |
|---|---|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Checklist General de Slices |
| Fase | Implementation / Phase 10 operativa |
| Fecha | 2026-07-16 (actualizado al cierre de bloques de auditoría 0–7) |
| Estado | Slices 0–13 y remediación de auditoría completados; configuración básica, banners y menús se mantienen diferidos fuera del MVP. |
| Ultima revision | 2026-07-16 (cierre de auditoría) |

---

## Leyenda

- `[ ]` — Pendiente
- `[~]` — En progreso
- `[x]` — Completado

---

## Slice 0 — Preparación Controlada

**Propósito:** Preparar el repositorio y la infraestructura base sin alterar base de datos ni generar migraciones.

### Tareas

- [x] Confirmar rama de trabajo (`main`)
- [x] Crear `package.json` raíz con configuración de monorepo
- [x] Configurar workspace `pnpm` (`pnpm-workspace.yaml`)
- [x] Crear `apps/web/` (React + Vite + MUI)
- [x] Crear `apps/api/` (NestJS)
- [x] Crear `packages/shared/` (tipos y DTOs compartidos)
- [x] Crear `prisma/` con `schema.prisma` operativo
- [x] Copiar y corregir schema (agregar `passwordHash` a `User`)
- [x] Crear `.env.example` sin secretos
- [x] Crear `.gitignore`
- [x] Configurar TypeScript strict en todos los proyectos
- [x] Revisar `schema.prisma` de forma estática
- [x] Documentar hallazgos del schema (`schema-review-findings.md`)
- [x] Registrar contradicción documental (`passwordHash` faltante)
- [x] Verificar que `pnpm install` funciona
- [x] Verificar compilación TypeScript en todos los workspaces

**Criterio de salida:** Repositorio preparado y documentado, sin migraciones ejecutadas.

---

## Slice 1 — Backend Base y Health Check

**Propósito:** Habilitar base operativa del backend NestJS.

### Tareas

- [x] Crear proyecto NestJS base
- [x] Configurar TypeScript strict
- [x] Configurar variables de entorno (`@nestjs/config`)
- [x] Configurar validación global (`ValidationPipe` con whitelist + transform)
- [x] Configurar CORS por ambiente
- [x] Configurar prefijo global `/api/v1`
- [x] Implementar filtro global de excepciones HTTP (`HttpExceptionFilter`)
- [x] Implementar filtro global de excepciones no capturadas (`AllExceptionsFilter`)
- [x] Configurar `cookie-parser`
- [x] Implementar health check técnico (`GET /api/v1/health`)
- [x] Configurar Swagger / OpenAPI
- [x] Configurar `@nestjs/config` con `envFilePath: '../../.env'`
- [x] Verificar arranque local del backend

**Criterio de salida:** Backend arranca localmente y expone health check técnico básico.

---

## Slice 2 — Prisma Local Controlado

**Propósito:** Conectar backend a persistencia local PostgreSQL mediante Prisma.

### Tareas

- [x] Solicitar autorización del Lead Developer para comandos Prisma
- [x] Validar `schema.prisma` con `prisma validate`
- [x] Actualizar schema a Prisma 7: remover `url` de datasource, cambiar generador a `prisma-client`
- [x] Crear `prisma.config.ts` con `defineConfig` y `datasource.url`
- [x] Ejecutar `prisma generate` con output a `apps/api/src/generated/prisma`
- [x] Instalar `@prisma/adapter-pg` + `pg` + `@types/pg`
- [x] Crear migración local inicial (`prisma migrate dev`)
- [x] Configurar `PrismaModule` y `PrismaService` (Global) en NestJS
- [x] Registrar `PrismaService` como provider global
- [x] Seed de usuario admin en BD
- [x] Conectar backend a PostgreSQL local
- [x] Swappear `InMemoryUserRepository` por `PrismaUserRepository`
- [x] Probar login, refresh y /me contra BD real

**Criterio de salida:** Prisma validado y backend conectado localmente sin afectar producción.

---

## Slice 3 — Autenticación Administrativa Inicial

**Propósito:** Proteger el panel administrativo con autenticación JWT + Argon2.

### Backend

- [x] Implementar módulo `Users` con repositorio (in-memory)
- [x] Implementar `InMemoryUserRepository` con usuario admin por defecto
- [x] Implementar login con email + password (`POST /auth/login`)
- [x] Implementar hash de contraseña con Argon2
- [x] Implementar JWT access token (`@nestjs/jwt`)
- [x] Implementar refresh token en cookie HttpOnly
- [x] Implementar logout (`POST /auth/logout`)
- [x] Implementar perfil de usuario (`GET /auth/me`)
- [x] Implementar `JwtStrategy` con Passport
- [x] Implementar `JwtAuthGuard`
- [x] Configurar `JwtModule` asíncrono desde variables de entorno
- [x] Proteger rutas administrativas con `JwtAuthGuard`
- [x] Swappear `InMemoryUserRepository` por `PrismaUserRepository`
- [x] Agregar rate limiting a endpoints de login (5 intentos/minuto)

### General

- [x] Sin registro público
- [x] Sin credenciales por defecto en producción

**Criterio de salida:** Panel administrativo puede protegerse mediante sesión segura básica.

---

## Slice 4 — Content Base

**Propósito:** Implementar la base editorial común del CMS.

### Backend

- [x] Crear módulo `Content`
- [x] Implementar crear Content (`POST /api/v1/admin/contents`)
- [x] Implementar editar Content (`PATCH /api/v1/admin/contents/:id`)
- [x] Implementar eliminar Content (soft delete) (`DELETE /api/v1/admin/contents/:id`)
- [x] Implementar listar Content administrativo (`GET /api/v1/admin/contents`)
- [x] Implementar consultar Content por ID (`GET /api/v1/admin/contents/:id`)
- [x] Manejar estados editoriales mínimos (`DRAFT`, `PREPARED`, `NEEDS_REVIEW`, `READY_FOR_PUBLICATION`, `ARCHIVED`)
- [x] Clasificar por `ContentType`
- [x] Implementar slug único por Content
- [x] Implementar campos SEO básicos (`seoTitle`, `seoDescription`)
- [x] Preservar autoría operativa (`createdBy`, `updatedBy`)
- [x] Confirmar que crear Content no genera publicación automática

### Frontend (Administrativo)

- [x] Implementar login administrativo (conectar con API)
- [x] Implementar layout administrativo protegido (shell con sidebar)
- [x] Implementar listado de contenidos con paginación
- [x] Implementar formulario crear/editar Content
- [x] Integrar Tiptap Editor para el cuerpo del contenido
- [x] Implementar selector de `ContentType`
- [x] Implementar manejo de estados editoriales

### Prisma / DB

- [x] Migrar modelo `Content` (migración previa)
- [x] Migrar modelo `ContentType` (migración previa)
- [x] Migrar tabla `contents` (migración previa)
- [x] Migrar tabla `content_types` (migración previa)

**Criterio de salida:** El sistema puede administrar una pieza editorial común sin fragmentar tipos editoriales.

---

## Slice 5 — Publication Base

**Propósito:** Separar la exposición pública del Content mediante una entidad `Publication`.

### Backend

- [x] Crear módulo `Publication`
- [x] Implementar crear Publication desde Content elegible (`POST /api/v1/admin/contents/:id/publication`)
- [x] Implementar listar publicaciones administrativas (`GET /api/v1/admin/publications`)
- [x] Implementar consultar publicación (`GET /api/v1/admin/publications/:id`)
- [x] Implementar retirar publicación (`POST /api/v1/admin/publications/:id/withdrawal`)
- [x] Implementar archivar publicación (`POST /api/v1/admin/publications/:id/archive`)
- [x] Manejar `PublicationStatus` (`PUBLISHED`, `WITHDRAWN`, `ARCHIVED`, etc.)
- [x] Manejar `publicSlug` único
- [x] Manejar fechas de publicación, retiro y archivo
- [x] Confirmar que `Publication` no es un booleano

### Frontend (Administrativo)

- [x] Implementar vista de publicación desde Content
- [x] Implementar listado de publicaciones
- [x] Implementar acción de retirar/archivar

### Prisma / DB

- [x] Migrar modelo `Publication` (migración previa)
- [x] Migrar tabla `publications` (migración previa)

**Criterio de salida:** Un Content puede exponerse públicamente mediante Publication sin usar booleano de publicación.

---

## Slice 6 — Consulta Pública Mínima

**Propósito:** Entregar el portal público funcional para la población.

**Estado real:** Completado — filtros públicos, responsabilidad institucional y consulta histórica contextualizada verificados durante los bloques de auditoría 2 y 3.

### Backend

- [x] Implementar listar publicaciones públicas (`GET /api/v1/public/publications`)
- [x] Implementar consultar detalle público por slug (`GET /api/v1/public/publications/:slug`)
- [x] Implementar listar publicaciones destacadas (`GET /api/v1/public/featured-publications`)
- [x] Implementar búsqueda básica pública (`GET /api/v1/public/search`)
- [x] Asegurar que borradores y contenido no publicado NO sean accesibles públicamente
- [x] Diferenciar contenido vigente de histórico mediante el estado `HISTORICALLY_CONTEXTUALIZED`.
- [x] Implementar filtros públicos por categoría y etiqueta.
- [x] Exponer responsabilidad institucional en la respuesta pública.

### Frontend (Público)

- [x] Implementar layout público base (header, footer, navegación) ✅
- [x] Implementar página de inicio con contenido destacado ✅
- [x] Implementar listado público de publicaciones ✅
- [x] Implementar detalle público de publicación ✅
- [x] Implementar búsqueda básica ✅
- [x] Implementar diseño responsive ✅
- [x] Implementar SEO básico (meta tags, Open Graph) ✅
- [x] Implementar navegación por tipos de contenido y categorías ✅

**Criterio de salida:** La población puede consultar información oficial publicada desde el portal público mínimo.

---

## Slice 7 — Recursos Multimedia

**Propósito:** Asociar recursos multimedia reutilizables a contenidos.

### Backend

- [x] Crear módulo `Media`
- [x] Implementar `StorageProvider` como abstracción de almacenamiento (interfaz + token)
- [x] Implementar `LocalStorageProvider` (almacenamiento en filesystem local)
- [x] Implementar subir archivo (`POST /api/v1/admin/media-resources/upload`)
- [x] Implementar crear recurso externo (`POST /api/v1/admin/media-resources/external`)
- [x] Implementar listar recursos (`GET /api/v1/admin/media-resources`)
- [x] Implementar consultar recurso (`GET /api/v1/admin/media-resources/:id`)
- [x] Implementar actualizar metadatos (`PATCH /api/v1/admin/media-resources/:id`)
- [x] Implementar eliminación lógica de recurso (`DELETE /api/v1/admin/media-resources/:id`)
- [x] Implementar asociar recursos a Content (`PUT /api/v1/admin/media-resources/associate/:contentId`)
- [x] Implementar desasociar recurso de Content
- [x] Implementar endpoint público de multimedia por contenido (`GET /api/v1/public/media/by-content/:contentId`)
- [x] Validar tipos MIME y tamaños de archivo (máx 10MB)
- [x] Configurar límite de body parser y servir archivos estáticos (`/uploads`)

### Frontend

- [x] Implementar gestor multimedia (subida, edición, listado con paginación y filtro por tipo)
- [x] Implementar selector de recursos para asociar a Content (integrado en formulario de edición)
- [x] Implementar visualización de recursos en portal público
- [x] Implementar `altText` para accesibilidad
- [x] Agregar enlace "Multimedia" en sidebar administrativo

### Prisma / DB

- [x] Migrar modelo `MediaResource` (migración inicial previa)
- [x] Migrar modelo `ContentMediaResource` (migración inicial previa)
- [x] Migrar tablas `media_resources` y `content_media_resources` (migración inicial previa)

**Criterio de salida:** Los contenidos pueden asociar recursos multimedia reutilizables.

---

## Slice 8 — Clasificación Básica

**Propósito:** Mejorar navegación y búsqueda mediante categorías, etiquetas y tipos de contenido.

### Backend

- [x] Implementar CRUD de `Category` (admin)
- [x] Implementar CRUD de `Tag` (admin)
- [x] Implementar CRUD de `ContentType` (admin)
- [x] Implementar asociación de categorías a Content
- [x] Implementar asociación de etiquetas a Content
- [x] Implementar endpoints públicos de clasificación (`GET /api/v1/public/categories`, `/tags`, `/content-types`)
- [x] Implementar filtros por clasificación en listados públicos: tipo, categoría y etiqueta.

### Frontend

- [x] Implementar administración de categorías
- [x] Implementar administración de etiquetas
- [x] Implementar administración de tipos de contenido (ContentType)
- [x] Implementar selectores de clasificación en formulario de Content
- [x] Implementar navegación pública por categorías ✅
- [x] Implementar filtrado por etiquetas ✅

### Prisma / DB

- [x] Migrar modelos `Category`, `Tag`
- [x] Migrar modelos puente `ContentCategory`, `ContentTag`
- [x] Migrar tablas correspondientes

**Criterio de salida:** La información puede encontrarse por criterios editoriales comprensibles.

---

## Slice 9 — Campaign / Disease

**Propósito:** Implementar entidades organizadoras institucionales.

### Backend

- [x] Implementar CRUD de `Campaign` (admin)
- [x] Implementar CRUD de `Disease` (admin)
- [x] Implementar relación Content ↔ Campaign
- [x] Implementar relación Content ↔ Disease
- [x] Implementar relación Campaign ↔ Disease
- [x] Implementar endpoints públicos de campañas (`GET /api/v1/public/campaigns`)
- [x] Implementar endpoints públicos de enfermedades (`GET /api/v1/public/diseases`)
- [x] Confirmar que Campaign y Disease NO son Content, categorías ni etiquetas

### Frontend

- [x] Implementar administración de campañas
- [x] Implementar administración de enfermedades
- [x] Implementar vistas públicas de campañas y enfermedades
- [x] Implementar asociación en formulario de Content

### Prisma / DB

- [x] Migrar modelos `Campaign`, `Disease`
- [x] Migrar modelos puente `ContentCampaign`, `ContentDisease`, `CampaignDisease`
- [x] Migrar tablas correspondientes

**Criterio de salida:** Campañas y enfermedades organizan publicaciones sin convertirse en Content, categoría ni etiqueta.

---

## Slice 10 — Timeline

**Propósito:** Preservar memoria institucional mediante una línea del tiempo administrable.

### Backend

- [x] Crear módulo `Timeline` ✅
- [x] Implementar CRUD de `TimelineEvent` (admin) ✅
- [x] Implementar asociación de multimedia propia a evento (`TimelineEventMediaResource`) ✅
- [x] Implementar relación opcional con Content (`TimelineEventContent`) ✅
- [x] Implementar endpoints públicos de línea del tiempo (`GET /api/v1/public/timeline-events`) ✅
- [x] Implementar detalle público de evento (`GET /api/v1/public/timeline-events/:slug`) ✅
- [x] Confirmar que Timeline no es agenda general ✅

### Frontend

- [x] Implementar administración de eventos de línea del tiempo ✅
- [x] Implementar vista pública de línea del tiempo (formato interactivo) ✅
- [x] Implementar detalle público de evento histórico ✅
- [x] Implementar asociación multimedia y de contenido en evento ✅

### Prisma / DB

- [x] Migrar modelos `TimelineEvent`, `TimelineEventMediaResource`, `TimelineEventContent` ✅
- [x] Migrar tablas correspondientes ✅

**Criterio de salida:** La línea del tiempo funciona como memoria institucional administrable, no como agenda general.

---

## Slice 11 — Canales Asistidos

**Propósito:** Preparar distribución de publicaciones hacia canales de comunicación.

### Backend

- [x] Crear módulo `Distribution`
- [x] Implementar CRUD de `CommunicationChannel` (admin)
- [x] Implementar asociación de canales a Publication (`PublicationChannel`)
- [x] Implementar actualización de estado de distribución
- [x] Implementar registro de distribución manual/asistida
- [x] Confirmar que los canales no son fuente de verdad

### Frontend

- [x] Implementar administración de canales de comunicación
- [x] Implementar selector de canales al publicar
- [x] Implementar registro de distribución

### Prisma / DB

- [x] Migrar modelos `CommunicationChannel`, `PublicationChannel` (migración inicial previa)
- [x] Migrar tablas correspondientes

**Criterio de salida:** Una Publication puede prepararse para distribución por canales sin convertirlos en fuente de verdad.

---

## Slice 12 — Trazabilidad Mínima

**Propósito:** Registrar eventos institucionales relevantes del ciclo de vida del contenido.

### Backend

- [x] Crear módulo `Traceability` (TraceabilityModule + TraceabilityService)
- [x] Implementar `TraceabilityRecord` (modelo sin soft delete, ya migrado)
- [x] Registrar evento `CREATED` (al crear Content)
- [x] Registrar evento `UPDATED` (al actualizar Content)
- [x] Registrar evento `PREPARED` (al cambiar estado a PREPARED)
- [x] Registrar evento `PUBLISHED` (al crear Publication)
- [x] Registrar evento `WITHDRAWN` (al retirar Publication)
- [x] Registrar evento `ARCHIVED` (al archivar Publication)
- [x] Registrar evento `DISTRIBUTED` (al publicar en canal)
- [x] Implementar consulta administrativa de trazabilidad (`GET /api/v1/admin/traceability-records?contentId=` o `?publicationId=`)
- [x] Relacionar cada registro con el operador autenticado (userId desde JWT)
- [x] NO implementar CRUD libre de trazabilidad (solo consulta filtrada)

### Frontend

- [x] Implementar vista de historial / trazabilidad en detalle de Content (ContentFormPage)
- [x] Implementar vista de historial en detalle de Publication (PublicationListPage)

### Prisma / DB

- [x] Migrar modelo `TraceabilityRecord` (migración inicial previa)
- [x] Migrar tabla `traceability_records` (migración inicial previa)

**Criterio de salida:** El sistema conserva trazabilidad institucional mínima sin implementar compliance avanzado.

---

## Slice 13 — End-to-End MVP

**Propósito:** Integrar todas las capacidades esenciales del MVP y validar el flujo completo.

**Estado real:** Completado — capacidades de Source, Validation, filtros públicos y responsabilidad institucional verificadas mediante los bloques de auditoría 1–5.

### Integración

- [x] Flujo completo: Login → Crear Content → Publicar → Consultar en portal ✅ (verificado por tests)
- [x] Asociar multimedia a Content ✅ (MediaService + tests)
- [x] Asociar clasificación (categorías, etiquetas) en admin ✅ (ClassificationService + tests)
- [x] Asociar campañas y enfermedades ✅ (CampaignDiseaseService + tests)
- [x] Verificar trazabilidad mínima en cada operación ✅ (7 eventos, tests confirman)
- [x] Verificar que publicaciones retiradas no aparecen en portal público ✅ (PublicService tests)
- [x] Verificar que borradores no son accesibles públicamente ✅ (solo PUBLISHED + isVisible)

### Seguridad

- [x] Endpoints administrativos protegidos con JWT ✅ (JwtAuthGuard en controllers)
- [x] Refresh token en cookie HttpOnly ✅ (auth.controller.ts)
- [x] Cookies `Secure` en producción ✅ (condicional en auth.controller.ts)
- [x] CORS restringido por ambiente ✅ (process.env.CORS_ORIGIN)
- [x] Logs sin tokens, cookies ni contraseñas ✅ (verificado: solo logs operativos)
- [x] Validación de DTOs en todos los endpoints ✅ (ValidationPipe global)
- [x] Sanitización de contenido enriquecido (Tiptap) ✅ (sanitize-html en body/summary y descripciones)
- [x] Sin registro público ✅ (sin endpoint de registro)
- [x] Sin credenciales por defecto ✅ (solo seed dev)

### Pruebas

- [x] Pruebas unitarias en servicios críticos (Auth, Content, Publication) ✅ (34 tests)
- [x] Pruebas de seguridad (autenticación, autorización) ✅ (JWT strategy, JWT validation, refresh)
- [x] Pruebas de paginación ✅ (Content pagination)
- [x] Pruebas de no exposición pública accidental ✅ (PublicService: solo PUBLISHED)
- [x] Pruebas de integración en endpoints críticos ✅ (15 tests: Auth login/refresh/me, Content CRUD → Publication → Public)

### Documentación

- [x] Swagger actualizado con todos los endpoints ✅ (/api/docs operativo)
- [x] README actualizado con instrucciones de ejecución ✅ (slices 10-12 agregados)
- [x] Checklist de proyecto actualizado ✅ (este checklist)
- [x] Documentación de decisión de arquitectura (ADR) para decisiones nuevas ✅ (ADR-007 al ADR-012)

### Criterios de aceptación del MVP

- [x] La Jurisdicción puede acceder a un panel administrativo protegido ✅
- [x] El responsable institucional puede crear, editar, publicar, archivar y consultar contenido ✅
- [x] El contenido puede clasificarse por tipo, categoría y etiquetas ✅
- [x] El contenido publicado puede consultarse desde el portal público ✅
- [x] La población puede navegar por tipos de contenido y categorías ✅
- [x] La población puede realizar búsqueda básica ✅
- [x] Cada contenido publicado muestra fuente y responsabilidad institucional cuando corresponde.
- [x] La línea del tiempo es pública, interactiva y administrable ✅
- [x] Se pueden asociar recursos multimedia básicos a contenido ✅
- [x] Se puede preparar contenido para distribución por canales ✅
- [x] El sistema conserva trazabilidad mínima ✅
- [x] El producto no incluye funcionalidades clínicas, hospitalarias ni de diagnóstico ✅
- [x] El alcance entregado permite evolucionar sin contradecir la visión del producto ✅

**Criterio de salida:** El MVP permite publicar información confiable de forma administrable, trazable y consultable.

---

## Resumen Final — Slice 13 (verificado tras cierre de auditoría)

El MVP End-to-End está completo para el alcance vigente. Las capacidades excluidas o diferidas permanecen registradas en el checklist de remediación:

- **125 tests unitarios** (110 backend + 15 frontend) — todos pasando
- **15 tests de integración** (Auth + Content → Publication → Public flow) — todos pasando
- **Seguridad verificada**: JWT, HttpOnly cookies, CORS, DTOs, sanitize-html, logs sin secretos
- **6 ADRs documentados** (ADR-007 al ADR-012)
- **Checklist actualizado** con progreso real de todos los slices
- **Flujo parcial verificado**: Login → Content → Publication → Public portal → Withdrawal
- **Completado por auditoría**: Source, Validation, filtros públicos por categoría/etiqueta y responsabilidad institucional.
- **Diferido**: configuración básica del sitio, banners y menús (decisión explícita del Bloque 4).

---

## Checklist de Seguridad Global

- [x] TypeScript strict configurado
- [x] DTOs validados desde el inicio
- [x] Sanitización considerada para contenido enriquecido (sanitize-html en body/summary)
- [x] Refresh token en cookie HttpOnly
- [x] Cookies `Secure` en producción (condicional por NODE_ENV)
- [x] Argon2 para contraseñas
- [x] Sin registro público
- [x] Sin credenciales por defecto (solo dev)
- [x] CORS restringido por ambiente
- [x] Secretos fuera de Git
- [x] `.env.example` sin valores sensibles
- [x] Logs sin tokens, cookies ni contraseñas

---

## Checklist DevOps MVP

- [x] Crear configuración reproducible de PostgreSQL local con Docker Compose y ADR-014.
- [x] Configurar CI básico con GitHub Actions.
- [x] Configurar respaldo y restauración de PostgreSQL y multimedia.
- [x] Documentar HTTPS, CORS y cookies seguras para producción.
- [x] Configurar migraciones, seed y bootstrap administrativo controlados.
- [x] Definir estrategia de despliegue controlado para ambiente no productivo.
- [ ] Sin Kubernetes (fuera del MVP)

---

## Resumen de Avance

| Slice | Estado | Completado |
|-------|--------|------------|
| 0 — Preparación controlada | ✅ Completado | 100% |
| 1 — Backend base + health check | ✅ Completado | 100% |
| 2 — Prisma local controlado | ✅ Completado | 100% |
| 3 — Autenticación administrativa | ✅ Completado | 100% |
| 4 — Content base | ✅ Completado | 100% |
| 5 — Publication base | ✅ Completado | 100% |
| 6 — Consulta pública mínima | ✅ Completado | 100% |
| 7 — Recursos multimedia | ✅ Completado | 100% |
| 8 — Clasificación básica | ✅ Completado | 100% |
| 9 — Campaign / Disease | ✅ Completado | 100% |
| 10 — Timeline | ✅ Completado | 100% |
| 11 — Canales asistidos | ✅ Completado | 100% |
| 12 — Trazabilidad mínima | ✅ Completado | 100% |
| 13 — End-to-End MVP | ✅ Completado | 100% |

---

## Próximo Paso Recomendado

Planificar la siguiente fase posterior al MVP. Las opciones recomendadas son: configuración institucional básica, despliegue controlado, integración real asistida con canales o capacidades de IA, cada una mediante una decisión de alcance y un checklist independiente.
