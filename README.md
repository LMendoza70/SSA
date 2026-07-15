# Plataforma de Gestion, Comunicacion y Educacion para la Salud

Repositorio tecnico de la plataforma institucional para la **Jurisdiccion Sanitaria de Huejutla de Reyes, Hidalgo**.

La capacidad central del producto es:

> **Publicar informacion confiable.**

---

## Estado Actual del Proyecto

El proyecto completo la baseline documental y se encuentra en **Implementation / Phase 10 operativa**.

| Area | Estado | Observacion |
|---|---|---|
| Foundation | Baseline | Charter y guia arquitectonica definidos. |
| Product | Baseline | Vision, alcance, principios y personas documentados. |
| Domain | Baseline | Lenguaje ubicuo, dominio, reglas y casos de uso definidos. |
| Architecture | Baseline | Clean Architecture, Modular Monolith y DDD Lite. |
| Database | Migrada | PostgreSQL conectado vía Prisma 7 con adapter-pg. Migración inicial aplicada. |
| API | Implementada | Endpoints auth, health, admin/content y public operativos. Swagger en `/api/docs`. |
| Frontend | Administrativo + Portal público | Login, layout protegido, CRUD de contenidos, portal público con listado/detalle/búsqueda. |
| Backend | Implementado | NestJS con auth JWT+Argon2, módulos Content, Publication y Public. |
| AI | Baseline futura | RAG y chatbot fuera del MVP. |
| DevOps | Baseline | Sin infraestructura real creada. |
| Implementation | Activa | Slices 0–7 completados. |

---

## Slices Completados

### Slice 0 — Preparacion controlada
- [x] Monorepo `pnpm` con workspaces
- [x] `apps/web/` (React + Vite + MUI)
- [x] `apps/api/` (NestJS)
- [x] `packages/shared/` (tipos compartidos)
- [x] `prisma/schema.prisma` operativo (con correccion: `passwordHash` agregado)
- [x] `.env.example` sin secretos
- [x] Revision estatica del schema documentada

### Slice 1 — Backend base
- [x] NestJS con TypeScript strict
- [x] Configuracion por ambiente
- [x] Validacion global (`ValidationPipe`)
- [x] Filtro global de errores HTTP
- [x] Health check: `GET /api/v1/health`

### Slice 2 — Prisma local controlado
- [x] PostgreSQL local conectado via Prisma 7
- [x] `@prisma/adapter-pg` + `pg` configurados
- [x] Migration inicial aplicada (24 modelos, 9 enums)
- [x] `PrismaModule` (Global) y `PrismaService` en NestJS
- [x] Usuario admin seed en base de datos

### Slice 3 — Autenticacion administrativa
- [x] Login con email + password
- [x] JWT access token
- [x] Refresh token en cookie HttpOnly
- [x] Logout
- [x] `GET /api/v1/auth/me` protegido
- [x] Argon2 para hash de contrasena
- [x] Sin registro publico

### Slice 4 — Content base
- [x] Modulo `Content` en NestJS (CRUD completo)
- [x] Slug unico auto-generado por contenido
- [x] Estados editoriales: DRAFT, PREPARED, NEEDS_REVIEW, READY_FOR_PUBLICATION, ARCHIVED
- [x] Clasificacion por `ContentType` (9 tipos semilla)
- [x] Campos SEO: `seoTitle`, `seoDescription`
- [x] Autoria preservada (`createdBy`, `updatedBy`)
- [x] Admin frontend: login, layout protegido, listado con paginacion
- [x] Formulario crear/editar con Tiptap Editor integrado
- [x] Selector de `ContentType` y manejo de estados editoriales

### Slice 5 — Publication Base
- [x] Modulo `Publication` en NestJS (create, list, withdraw, archive)
- [x] Publicación desde Content elegible (solo READY_FOR_PUBLICATION)
- [x] `publicSlug` único auto-generado
- [x] Estados: PUBLISHED, WITHDRAWN, ARCHIVED, UPDATED
- [x] Fechas de publicación, retiro y archivo
- [x] Publicación como entidad (no booleano)
- [x] Frontend: listado de publicaciones con acciones retirar/archivar
- [x] Botón "Publicar" en formulario de edición de contenido

### Slice 6 — Consulta Pública Mínima
- [x] Módulo `Public` en NestJS con endpoints públicos
- [x] `GET /api/v1/public/publications` — listado público paginado
- [x] `GET /api/v1/public/publications/:slug` — detalle público por slug
- [x] `GET /api/v1/public/featured-publications` — destacados
- [x] `GET /api/v1/public/search?q=` — búsqueda pública básica
- [x] Layout público con header, footer y navegación
- [x] Homepage con hero y contenido destacado
- [x] Listado público de publicaciones
- [x] Detalle público de publicación
- [x] Búsqueda pública básica
- [x] SEO básico (meta tags, Open Graph)
- [x] Diseño responsive

### Slice 7 — Recursos Multimedia
- [x] Abstracción `StorageProvider` + `LocalStorageProvider` (filesystem local)
- [x] Módulo `Media` con CRUD completo de recursos multimedia
- [x] Subida de archivos con validación de tipos MIME y tamaño (10MB máx)
- [x] Asociación de recursos a contenidos
- [x] Endpoint público de multimedia por contenido
- [x] Archivos estáticos servidos bajo `/uploads`
- [x] Frontend: gestor multimedia con subida, listado, paginación y filtro
- [x] Selector multimedia integrado en formulario de edición de contenido
- [x] Visualización de multimedia en portal público
- [x] Enlace "Multimedia" en sidebar administrativo

---

## Estructura del Repositorio

```
.
|-- apps/
|   |-- api/                    # NestJS backend
|   |   |-- src/
|   |   |   |-- auth/           # Modulo Auth (JWT + Argon2)
|   |   |   |-- content/        # Modulo Content (CRUD editorial)
|   |   |   |-- common/         # Filtros globales
|   |   |   |-- health/         # Health check
|   |   |   |-- media/          # Modulo Media (StorageProvider + CRUD multimedia)
|   |   |   |-- prisma/         # PrismaModule global
|   |   |   |-- public/         # Modulo Public (endpoints públicos)
|   |   |   |-- publication/    # Modulo Publication
|   |   |   |-- users/          # User repository
|   |   |   |-- app.module.ts
|   |   |   `-- main.ts
|   |   |-- package.json
|   |   `-- tsconfig.json
|   `-- web/                    # React + Vite frontend
|       |-- src/
|       |   |-- pages/
|       |   |   |-- admin/      # Login, AdminLayout
|       |   |   |   |-- contents/ # ContentListPage, ContentFormPage
|       |   |-- components/
|       |   |   |-- admin/     # Sidebar, StatusChip, TiptapEditor
|       |   |-- hooks/         # useContents, useContentTypes
|       |   |-- lib/           # api (axios), auth (context)
|       |   |-- App.tsx
|       |   |-- main.tsx
|       |   `-- theme.ts
|       |-- index.html
|       |-- package.json
|       |-- tsconfig.json
|       `-- vite.config.ts
|-- packages/
|   `-- shared/                 # Tipos compartidos (enums, DTOs)
|       `-- src/
|           |-- enums.ts
|           |-- types/
|           `-- index.ts
|-- prisma/
|   `-- schema.prisma           # Schema operativo (sin migrar)
|-- docs/
|   |-- 00-foundation/
|   |-- 01-product/
|   |-- 02-domain/
|   |-- 03-architecture/
|   |-- 04-database/
|   |-- 05-api/
|   |-- 06-frontend/
|   |-- 07-backend/
|   |-- 08-ai/
|   |-- 09-devops/
|   |-- 10-implementation/
|   `-- transfer/
|-- .env.example
|-- .gitignore
|-- package.json                # Monorepo root
|-- pnpm-workspace.yaml
`-- README.md
```

---

## Stack Tecnologico

### Frontend
- React 19 + TypeScript strict
- Vite
- Material UI 7
- React Router 7
- TanStack Query 5
- React Hook Form + Zod
- Axios
- Tiptap Editor

### Backend
- Node.js 24 + TypeScript strict
- NestJS 11
- Prisma ORM 7 (migrado + seed)
- JWT + Passport
- Argon2
- Swagger

### Base de datos
- PostgreSQL (conectado via Prisma 7 + adapter-pg)
- pgvector previsto para fase futura de IA

---

## Requisitos

- Node.js >= 22
- pnpm >= 10

```bash
pnpm install
```

---

## Ejecucion Local

```bash
# Iniciar backend (http://localhost:3001)
pnpm dev:api

# Iniciar frontend (http://localhost:5173)
pnpm dev:web

# Ambos en paralelo
pnpm dev
```

### Swagger UI
```
http://localhost:3001/api/docs
```

---

## Endpoints Disponibles

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/health` | Health check | No |
| POST | `/api/v1/auth/login` | Iniciar sesion | No |
| POST | `/api/v1/auth/refresh` | Renovar token | Cookie |
| POST | `/api/v1/auth/logout` | Cerrar sesion | No |
| GET | `/api/v1/auth/me` | Perfil del operador | Bearer JWT |
| GET | `/api/v1/admin/contents` | Listar contenidos (paginado) | Bearer JWT |
| POST | `/api/v1/admin/contents` | Crear contenido | Bearer JWT |
| GET | `/api/v1/admin/contents/:id` | Obtener contenido por ID | Bearer JWT |
| PATCH | `/api/v1/admin/contents/:id` | Actualizar contenido | Bearer JWT |
| GET | `/api/v1/admin/content-types` | Listar tipos de contenido | Bearer JWT |
| POST | `/api/v1/admin/contents/:contentId/publication` | Publicar contenido | Bearer JWT |
| GET | `/api/v1/admin/publications` | Listar publicaciones | Bearer JWT |
| GET | `/api/v1/admin/publications/:id` | Consultar publicación | Bearer JWT |
| POST | `/api/v1/admin/publications/:id/withdrawal` | Retirar publicación | Bearer JWT |
| POST | `/api/v1/admin/publications/:id/archive` | Archivar publicación | Bearer JWT |
| GET | `/api/v1/public/publications` | Listar publicaciones públicas | No |
| GET | `/api/v1/public/publications/:slug` | Detalle público por slug | No |
| GET | `/api/v1/public/featured-publications` | Publicaciones destacadas | No |
| GET | `/api/v1/public/search` | Búsqueda pública básica | No |
| GET | `/api/v1/public/media/by-content/:contentId` | Multimedia de un contenido | No |
| POST | `/api/v1/admin/media-resources/upload` | Subir archivo multimedia | Bearer JWT |
| POST | `/api/v1/admin/media-resources/external` | Crear recurso externo | Bearer JWT |
| GET | `/api/v1/admin/media-resources` | Listar recursos multimedia | Bearer JWT |
| GET | `/api/v1/admin/media-resources/:id` | Consultar recurso | Bearer JWT |
| PATCH | `/api/v1/admin/media-resources/:id` | Actualizar metadatos | Bearer JWT |
| DELETE | `/api/v1/admin/media-resources/:id` | Eliminar recurso | Bearer JWT |
| GET | `/api/v1/admin/media-resources/by-content/:contentId` | Recursos de un contenido | Bearer JWT |
| PUT | `/api/v1/admin/media-resources/associate/:contentId` | Asociar recursos a contenido | Bearer JWT |
| DELETE | `/api/v1/admin/media-resources/associate/:contentId/:resourceId` | Desasociar recurso | Bearer JWT |

### Credencial de desarrollo
```
Email:    admin@jurisdiccion.gob.mx
Password: admin123
```

---

## Proximos Pasos

- **Slice 6** — ✅ Completado (portal público funcional)
- **Slice 7** — ✅ Completado (gestor multimedia)
- **Slice 8** — Clasificación básica (categorías, etiquetas)
- Slices restantes segun `docs/10-implementation/project-slices-checklist.md`

---

## Acciones No Autorizadas

Requieren autorizacion explicita del Lead Developer:

```bash
npx prisma db push
```

Tampoco esta autorizado:
- desplegar staging o produccion
- introducir IA, chatbot, embeddings o pgvector en el MVP

---

## Documentacion Principal

1. `docs/10-implementation/implementation-start.md`
2. `docs/10-implementation/implementation-checklist.md`
3. `docs/07-backend/implementation-plan.md`
4. `docs/05-api/api.md`
5. `docs/04-database/schema.prisma`
6. `docs/03-architecture/architecture.md`

---

## Licencia

Pendiente de definicion.
