# Checklist General del Proyecto — Slices de Implementación

| Campo | Valor |
|---|---|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Checklist General de Slices |
| Fase | Implementation / Phase 10 operativa |
| Fecha | 2026-07-14 |
| Estado | Slices 0–6 completados |

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
- [ ] Agregar rate limiting a endpoints de login

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

### Backend

- [x] Implementar listar publicaciones públicas (`GET /api/v1/public/publications`)
- [x] Implementar consultar detalle público por slug (`GET /api/v1/public/publications/:slug`)
- [x] Implementar listar publicaciones destacadas (`GET /api/v1/public/featured-publications`)
- [x] Implementar búsqueda básica pública (`GET /api/v1/public/search`)
- [x] Asegurar que borradores y contenido no publicado NO sean accesibles públicamente
- [ ] Diferenciar contenido vigente de histórico

### Frontend (Público)

- [x] Implementar layout público base (header, footer, navegación)
- [x] Implementar página de inicio con contenido destacado
- [x] Implementar listado público de publicaciones
- [x] Implementar detalle público de publicación
- [x] Implementar búsqueda básica
- [x] Implementar diseño responsive
- [x] Implementar SEO básico (meta tags, Open Graph)
- [ ] Implementar navegación por tipos de contenido y categorías

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

- [x] Implementar gestor multimedia (subida y listado con paginación y filtro por tipo)
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

- [ ] Implementar CRUD de `Category` (admin)
- [ ] Implementar CRUD de `Tag` (admin)
- [ ] Implementar CRUD de `ContentType` (admin)
- [ ] Implementar asociación de categorías a Content
- [ ] Implementar asociación de etiquetas a Content
- [ ] Implementar endpoints públicos de clasificación (`GET /api/v1/public/categories`, `/tags`, `/content-types`)
- [ ] Implementar filtros por clasificación en listados públicos

### Frontend

- [ ] Implementar administración de categorías
- [ ] Implementar administración de etiquetas
- [ ] Implementar selectores de clasificación en formulario de Content
- [ ] Implementar navegación pública por categorías
- [ ] Implementar filtrado por etiquetas

### Prisma / DB

- [ ] Migrar modelos `Category`, `Tag`
- [ ] Migrar modelos puente `ContentCategory`, `ContentTag`
- [ ] Migrar tablas correspondientes

**Criterio de salida:** La información puede encontrarse por criterios editoriales comprensibles.

---

## Slice 9 — Campaign / Disease

**Propósito:** Implementar entidades organizadoras institucionales.

### Backend

- [ ] Implementar CRUD de `Campaign` (admin)
- [ ] Implementar CRUD de `Disease` (admin)
- [ ] Implementar relación Content ↔ Campaign
- [ ] Implementar relación Content ↔ Disease
- [ ] Implementar relación Campaign ↔ Disease
- [ ] Implementar endpoints públicos de campañas (`GET /api/v1/public/campaigns`)
- [ ] Implementar endpoints públicos de enfermedades (`GET /api/v1/public/diseases`)
- [ ] Confirmar que Campaign y Disease NO son Content, categorías ni etiquetas

### Frontend

- [ ] Implementar administración de campañas
- [ ] Implementar administración de enfermedades
- [ ] Implementar vistas públicas de campañas y enfermedades
- [ ] Implementar asociación en formulario de Content

### Prisma / DB

- [ ] Migrar modelos `Campaign`, `Disease`
- [ ] Migrar modelos puente `ContentCampaign`, `ContentDisease`, `CampaignDisease`
- [ ] Migrar tablas correspondientes

**Criterio de salida:** Campañas y enfermedades organizan publicaciones sin convertirse en Content, categoría ni etiqueta.

---

## Slice 10 — Timeline

**Propósito:** Preservar memoria institucional mediante una línea del tiempo administrable.

### Backend

- [ ] Crear módulo `Timeline`
- [ ] Implementar CRUD de `TimelineEvent` (admin)
- [ ] Implementar asociación de multimedia propia a evento (`TimelineEventMediaResource`)
- [ ] Implementar relación opcional con Content (`TimelineEventContent`)
- [ ] Implementar endpoints públicos de línea del tiempo (`GET /api/v1/public/timeline-events`)
- [ ] Implementar detalle público de evento (`GET /api/v1/public/timeline-events/:slug`)
- [ ] Confirmar que Timeline no es agenda general

### Frontend

- [ ] Implementar administración de eventos de línea del tiempo
- [ ] Implementar vista pública de línea del tiempo (formato interactivo)
- [ ] Implementar detalle público de evento histórico
- [ ] Implementar asociación multimedia y de contenido en evento

### Prisma / DB

- [ ] Migrar modelos `TimelineEvent`, `TimelineEventMediaResource`, `TimelineEventContent`
- [ ] Migrar tablas correspondientes

**Criterio de salida:** La línea del tiempo funciona como memoria institucional administrable, no como agenda general.

---

## Slice 11 — Canales Asistidos

**Propósito:** Preparar distribución de publicaciones hacia canales de comunicación.

### Backend

- [ ] Crear módulo `Distribution`
- [ ] Implementar CRUD de `CommunicationChannel` (admin)
- [ ] Implementar asociación de canales a Publication (`PublicationChannel`)
- [ ] Implementar actualización de estado de distribución
- [ ] Implementar registro de distribución manual/asistida
- [ ] Confirmar que los canales no son fuente de verdad

### Frontend

- [ ] Implementar administración de canales de comunicación
- [ ] Implementar selector de canales al publicar
- [ ] Implementar registro de distribución

### Prisma / DB

- [ ] Migrar modelos `CommunicationChannel`, `PublicationChannel`
- [ ] Migrar tablas correspondientes

**Criterio de salida:** Una Publication puede prepararse para distribución por canales sin convertirlos en fuente de verdad.

---

## Slice 12 — Trazabilidad Mínima

**Propósito:** Registrar eventos institucionales relevantes del ciclo de vida del contenido.

### Backend

- [ ] Crear módulo `Traceability`
- [ ] Implementar `TraceabilityRecord` (modelo sin soft delete)
- [ ] Registrar evento `CREATED`
- [ ] Registrar evento `UPDATED`
- [ ] Registrar evento `VALIDATED`
- [ ] Registrar evento `PREPARED`
- [ ] Registrar evento `PUBLISHED`
- [ ] Registrar evento `WITHDRAWN`
- [ ] Registrar evento `ARCHIVED`
- [ ] Registrar evento `DISTRIBUTED`
- [ ] Implementar consulta administrativa de trazabilidad (`GET /api/v1/admin/traceability-records`)
- [ ] Relacionar cada registro con el operador autenticado
- [ ] NO implementar CRUD libre de trazabilidad (solo consulta)

### Frontend

- [ ] Implementar vista de historial / trazabilidad en detalle de Content
- [ ] Implementar vista de historial en detalle de Publication

### Prisma / DB

- [ ] Migrar modelo `TraceabilityRecord`
- [ ] Migrar tabla `traceability_records`

**Criterio de salida:** El sistema conserva trazabilidad institucional mínima sin implementar compliance avanzado.

---

## Slice 13 — End-to-End MVP

**Propósito:** Integrar todas las capacidades esenciales del MVP y validar el flujo completo.

### Integración

- [ ] Flujo completo: Login → Crear Content → Asignar fuente/validación → Publicar → Consultar en portal
- [ ] Asociar multimedia a Content
- [ ] Asociar clasificación (categorías, etiquetas)
- [ ] Asociar campañas y enfermedades
- [ ] Verificar trazabilidad mínima en cada operación
- [ ] Verificar que publicaciones retiradas no aparecen en portal público
- [ ] Verificar que borradores no son accesibles públicamente

### Seguridad

- [ ] Endpoints administrativos protegidos con JWT
- [ ] Refresh token en cookie HttpOnly
- [ ] Cookies `Secure` en producción
- [ ] CORS restringido por ambiente
- [ ] Logs sin tokens, cookies ni contraseñas
- [ ] Validación de DTOs en todos los endpoints
- [ ] Sanitización de contenido enriquecido (Tiptap)
- [ ] Sin registro público
- [ ] Sin credenciales por defecto

### Pruebas

- [ ] Pruebas unitarias en servicios críticos (Auth, Content, Publication)
- [ ] Pruebas de integración en endpoints críticos
- [ ] Pruebas de seguridad (autenticación, autorización)
- [ ] Pruebas de paginación
- [ ] Pruebas de no exposición pública accidental

### Documentación

- [ ] Swagger actualizado con todos los endpoints
- [ ] README actualizado con instrucciones de ejecución
- [ ] Checklist de proyecto actualizado
- [ ] Documentación de decisión de arquitectura (ADR) para decisiones nuevas

### Criterios de aceptación del MVP

- [ ] La Jurisdicción puede acceder a un panel administrativo protegido
- [ ] El responsable institucional puede crear, editar, publicar, archivar y consultar contenido
- [ ] El contenido puede clasificarse por tipo, categoría y etiquetas
- [ ] El contenido publicado puede consultarse desde el portal público
- [ ] La población puede navegar por tipos de contenido y categorías
- [ ] La población puede realizar búsqueda básica
- [ ] Cada contenido muestra fuente y responsabilidad institucional
- [ ] La línea del tiempo es pública, interactiva y administrable
- [ ] Se pueden asociar recursos multimedia básicos a contenido
- [ ] Se puede preparar contenido para distribución por canales
- [ ] El sistema conserva trazabilidad mínima
- [ ] El producto no incluye funcionalidades clínicas, hospitalarias ni de diagnóstico
- [ ] El alcance entregado permite evolucionar sin contradecir la visión del producto

**Criterio de salida:** El MVP permite publicar información confiable de forma administrable, trazable y consultable.

---

## Checklist de Seguridad Global

- [x] TypeScript strict configurado
- [x] DTOs validados desde el inicio
- [ ] Sanitización considerada para contenido enriquecido
- [x] Refresh token en cookie HttpOnly
- [ ] Cookies `Secure` en producción
- [x] Argon2 para contraseñas
- [x] Sin registro público
- [x] Sin credenciales por defecto (solo dev)
- [x] CORS restringido por ambiente
- [x] Secretos fuera de Git
- [x] `.env.example` sin valores sensibles
- [ ] Logs sin tokens, cookies ni contraseñas

---

## Checklist DevOps MVP

- [ ] Crear `.dockerignore` y `Dockerfile` para api y web
- [ ] Configurar CI básico (GitHub Actions u otro)
- [ ] Configurar respaldo de PostgreSQL
- [ ] Configurar respaldo de multimedia
- [ ] Configurar HTTPS en producción
- [ ] Configurar migraciones controladas
- [ ] Definir estrategia de despliegue (manual/controlado)
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
| 8 — Clasificación básica | ⏳ Pendiente | 0% |
| 9 — Campaign / Disease | ⏳ Pendiente | 0% |
| 10 — Timeline | ⏳ Pendiente | 0% |
| 11 — Canales asistidos | ⏳ Pendiente | 0% |
| 12 — Trazabilidad mínima | ⏳ Pendiente | 0% |
| 13 — End-to-End MVP | ⏳ Pendiente | 0% |

---

## Próximo Paso Recomendado

**Slice 8 — Clasificación básica** (categorías, etiquetas).
