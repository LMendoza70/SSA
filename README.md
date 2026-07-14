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
| Database | Baseline | Schema Prisma revisado y corregido en `prisma/schema.prisma`. No migrado. |
| API | Baseline | Superficies publica, administrativa y auth documentadas. |
| Frontend | Baseline + scaffold | React/Vite/MUI iniciado con estructura base. |
| Backend | Baseline + implementado | NestJS con health check y autenticacion JWT+Argon2. |
| AI | Baseline futura | RAG y chatbot fuera del MVP. |
| DevOps | Baseline | Sin infraestructura real creada. |
| Implementation | Activa | Slices 0, 1 y 3 completados. |

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

### Slice 3 — Autenticacion administrativa
- [x] Login con email + password
- [x] JWT access token
- [x] Refresh token en cookie HttpOnly
- [x] Logout
- [x] `GET /api/v1/auth/me` protegido
- [x] Argon2 para hash de contrasena
- [x] Sin registro publico

---

## Estructura del Repositorio

```
.
|-- apps/
|   |-- api/                    # NestJS backend
|   |   |-- src/
|   |   |   |-- auth/           # Modulo Auth (JWT + Argon2)
|   |   |   |-- common/         # Filtros globales
|   |   |   |-- health/         # Health check
|   |   |   |-- users/          # User repository (in-memory)
|   |   |   |-- app.module.ts
|   |   |   `-- main.ts
|   |   |-- package.json
|   |   `-- tsconfig.json
|   `-- web/                    # React + Vite frontend
|       |-- src/
|       |   |-- pages/
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
- Prisma ORM 7 (pendiente de migracion)
- JWT + Passport
- Argon2
- Swagger

### Base de datos
- PostgreSQL (pendiente de conexion)
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

### Credencial de desarrollo
```
Email:    admin@jurisdiccion.gob.mx
Password: admin123
```

---

## Proximos Pasos

- **Slice 2** — Prisma local controlado (conectar PostgreSQL, migrar)
- **Slice 4** — Content base (CRUD editorial)
- **Slice 5** — Publication base (exposicion publica)
- **Slice 6** — Frontend publico
- Slices restantes segun `docs/10-implementation/implementation-checklist.md`

---

## Acciones No Autorizadas

Requieren autorizacion explicita del Lead Developer:

```bash
npx prisma validate
npx prisma format
npx prisma generate
npx prisma migrate dev
npx prisma db push
```

Tampoco esta autorizado:
- crear migraciones o seeds
- conectar backend a base de datos real
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
