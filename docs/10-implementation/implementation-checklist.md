# Checklist del Proyecto

| Campo | Valor |
|---|---|
| Proyecto | Plataforma de Gestion, Comunicacion y Educacion para la Salud |
| Cliente | Jurisdiccion Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Checklist del Proyecto |
| Fase actual | Implementation / Phase 10 operativa |
| Estado | Actualizado al cierre de los bloques de auditoría 0–7 |
| Fecha | 2026-07-16 |
| Responsable | Pendiente de asignar |
| Ultima revision | 2026-07-16 (cierre de auditoría) |

---

## 1. Proposito

Este checklist sirve para ubicar rapidamente en que parte del proyecto se encuentra el desarrollo y que falta para avanzar con control.

Debe actualizarse cada vez que se complete un hito relevante, se autorice una accion tecnica o se cierre un slice de implementacion.

---

## 2. Estado General

| Area | Estado | Checklist |
|---|---|---|
| Foundation | Baseline | [x] |
| Product | Baseline documental | [x] |
| Domain | Baseline documental | [x] |
| Architecture | Baseline documental | [x] |
| Database | Baseline documental | [x] |
| API | Baseline | [x] |
| Frontend | Baseline documental | [x] |
| Backend | Baseline documental | [x] |
| AI | Baseline futura | [x] |
| DevOps | Baseline | [x] |
| Implementation Start | Baseline de arranque | [x] |
| Implementacion real | Completada — Slices 0–13 y bloques de auditoría 0–7 | [x] |
| MVP funcional | Completado para el alcance vigente | [x] |

Lectura del estado actual:

```text
El proyecto ya cerro la baseline documental principal.
La etapa activa es Implementation.
Slices 0 a 13 y bloques de auditoría 0 a 7 completados.
Source, Validation, filtros públicos por categoría/etiqueta y responsabilidad
institucional se encuentran implementados. Configuración básica, banners y
menús fueron diferidos explícitamente fuera del alcance actual del MVP.
```

---

## 3. Checklist de Documentacion

### 3.1 Foundation

- [x] Project Charter documentado.
- [x] Guia de arquitectura documentada.
- [x] Documentacion establecida como fuente de verdad.

### 3.2 Product

- [x] Vision documentada.
- [x] Alcance MVP documentado.
- [x] Principios de producto documentados.
- [x] Personas y actores documentados.
- [ ] Revisar y normalizar estados internos de documentos que aun indiquen `Draft` si se desea cierre formal estricto.

### 3.3 Domain

- [x] Lenguaje ubicuo documentado.
- [x] Dominio documentado.
- [x] Reglas de negocio documentadas.
- [x] Casos de uso documentados.

### 3.4 Architecture

- [x] Arquitectura general documentada.
- [x] Clean Architecture definida.
- [x] Modular Monolith definido.
- [x] DDD Lite definido.
- [x] Antipatrones prohibidos documentados.
- [ ] Evaluar si se requieren ADRs separados para decisiones nuevas durante implementacion.

### 3.5 Database

- [x] Estrategia de base de datos documentada.
- [x] ERD documentado.
- [x] Prisma Schema documentado.
- [x] Archivo `docs/04-database/schema.prisma` disponible como referencia (actualizado en Bloque 0 auditoria).
- [x] Carpeta `prisma/` creada en la raiz.
- [x] `schema.prisma` operativo ubicado en `prisma/schema.prisma`.
- [x] Schema revisado estaticamente (ver schema-review-findings.md).
- [x] `prisma validate` ejecutado.
- [x] Migracion inicial creada y aplicada.
- [x] `docs/04-database/schema.prisma` alineado con operativo (passwordHash, Prisma 7).

### 3.6 API

- [x] Especificacion API documentada.
- [x] Autenticacion documentada.
- [x] Separacion `/api/v1/public`, `/api/v1/admin` y `/api/v1/auth` definida.
- [x] Endpoints de MVP definidos a nivel arquitectonico.
- [x] Swagger/OpenAPI generado y operativo en `/api/docs`.

### 3.7 Frontend

- [x] Arquitectura frontend documentada.
- [x] Stack frontend definido.
- [x] Portal publico y panel administrativo definidos conceptualmente.
- [x] Aplicacion React/Vite creada en `apps/web/`.
- [x] Layout publico implementado (header, footer, navegacion, responsive).
- [x] Layout administrativo protegido implementado (sidebar, autenticacion JWT).

### 3.8 Backend

- [x] Arquitectura backend documentada.
- [x] Plan de implementacion backend documentado.
- [x] Incrementos backend definidos.
- [x] Aplicacion NestJS creada en `apps/api/`.
- [x] TypeScript strict configurado.
- [x] Health check implementado (`GET /api/v1/health`).
- [x] Autenticacion administrativa inicial implementada (JWT + Argon2 + HttpOnly cookies).

### 3.9 AI

- [x] Estrategia AI/RAG documentada como futura.
- [x] Chatbot fuera del MVP funcional.
- [x] Embeddings y pgvector fuera del arranque.
- [ ] Retomar IA solo despues de contar con corpus institucional publicado, validado y clasificado.

### 3.10 DevOps

- [x] Estrategia DevOps MVP documentada.
- [x] Estrategia de despliegue documentada.
- [x] Estrategia de ambientes documentada.
- [x] Kubernetes fuera del MVP.
- [x] Docker recomendado, no obligatorio.
- [x] `.env.example` creado sin secretos.
- [x] Estrategia local PostgreSQL definida y operativa (via PrismaService + seed).
- [x] Preparación DevOps completada: CI, desarrollo reproducible, migraciones y respaldo documentados; proveedor final se mantiene como decisión de despliegue posterior.

---

## 4. Checklist de Implementation

### Slice 0 - Preparacion Controlada

Estado: **Completado**

- [x] Baseline documental revisada.
- [x] Carpeta `docs/10-implementation/` creada.
- [x] `implementation-start.md` creado.
- [x] Autorizacion limitada a Slice 0 registrada.
- [x] Checklist operativo creado.
- [x] Confirmar rama de trabajo (`main`).
- [x] Crear `package.json` raiz.
- [x] Configurar workspace `pnpm` (`pnpm-workspace.yaml`).
- [x] Crear `apps/web/`.
- [x] Crear `apps/api/`.
- [x] Crear `packages/shared/`.
- [x] Crear `prisma/`.
- [x] Colocar `schema.prisma` operativo en `prisma/schema.prisma`.
- [x] Crear `.env.example` sin secretos.
- [x] Documentar scripts base.
- [x] Revisar `schema.prisma` de forma estatica.
- [x] Registrar contradiccion documental (`passwordHash` faltante en `docs/04-database/schema.prisma`).

Criterio de salida:

```text
Repositorio preparado y documentado, sin migraciones ejecutadas.
```

> Verificado: `project-slices-checklist.md` confirma todas las tareas completadas.

### Slice 1 - Backend Base y Health Check

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Crear proyecto NestJS base.
- [x] Configurar TypeScript strict.
- [x] Configurar variables de entorno.
- [x] Configurar validacion global.
- [x] Configurar manejo basico de errores.
- [x] Implementar health check sin datos sensibles.
- [x] Verificar arranque local del backend.

Criterio de salida:

```text
Backend arranca localmente y expone health check tecnico basico.
```

### Slice 2 - Prisma Local Controlado

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Autorizar comandos Prisma.
- [x] Validar schema con `prisma validate`.
- [x] Actualizar a Prisma 7 (generador `prisma-client`, `url` fuera del datasource).
- [x] Ejecutar `prisma generate`.
- [x] Crear migracion local inicial.
- [x] Conectar backend a PostgreSQL local via PrismaService.
- [x] Seed de usuario admin.
- [x] Probar conectividad minima.

Criterio de salida:

```text
Prisma validado y backend conectado localmente sin afectar produccion.
```

### Slice 3 - Autenticacion Administrativa Inicial

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Implementar login administrativo.
- [x] Implementar refresh token en cookie HttpOnly.
- [x] Implementar logout.
- [x] Implementar `/auth/me`.
- [x] Proteger rutas administrativas con JwtAuthGuard.
- [x] Usar Argon2 para hash de contrasena.
- [x] Seed de primer usuario admin controlado.
- [x] Confirmar que no existe registro publico.

### Slice 4 - Content Base

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Crear Content (POST /api/v1/admin/contents).
- [x] Editar Content (PATCH /api/v1/admin/contents/:id).
- [x] Listar Content administrativo con paginacion.
- [x] Consultar Content administrativo por ID.
- [x] Manejar estados editoriales minimos.
- [x] Clasificar por `ContentType`.
- [x] Confirmar que crear Content no publica automaticamente.

### Slice 5 - Publication Base

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Crear Publication desde Content elegible.
- [x] Separar Publication de Content (entidad independiente).
- [x] Manejar estado de Publication (PUBLISHED, WITHDRAWN, ARCHIVED).
- [x] Manejar `publicSlug` unico.
- [x] Manejar fechas de publicacion, retiro y archivo.
- [x] Confirmar que Publication no es booleano.

### Slice 6 - Consulta Publica Minima

Estado: **Completado** — ver auditoría cerrada

- [x] Listar publicaciones publicas.
- [x] Consultar detalle publico por slug.
- [x] Implementar busqueda basica.
- [x] Evitar exposicion de borradores o datos administrativos.
- [x] Preparar SEO basico.
- [x] Filtros públicos por categoría y etiqueta.
- [x] Responsabilidad institucional en respuesta pública.

### Slice 7 - Recursos Multimedia

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Crear MediaResource (subida y externo).
- [x] Asociar MediaResource a Content mediante ContentMediaResource.
- [x] Asociar MediaResource a TimelineEvent.
- [x] Implementar `StorageProvider` con `LocalStorageProvider`.
- [x] Acceso a archivos solo mediante StorageProvider, no directo.

### Slice 8 - Clasificacion Basica

Estado: **Completado** — ver auditoría cerrada

- [x] Administrar ContentType (CRUD admin).
- [x] Administrar Category (CRUD admin).
- [x] Administrar Tag (CRUD admin).
- [x] Relacionar Content con categorias y etiquetas.
- [x] Endpoints publicos de listado: /categories, /tags, /content-types.
- [x] Filtros públicos por tipo, categoría y etiqueta.

### Slice 9 - Campaign / Disease

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Administrar Campaign como entidad organizadora.
- [x] Administrar Disease como entidad tematica.
- [x] Relacionar Content con Campaign.
- [x] Relacionar Content con Disease.
- [x] Confirmar que Campaign y Disease no son Content ni categorias.

### Slice 10 - Timeline

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Administrar TimelineEvent (CRUD admin).
- [x] Asociar multimedia propia a TimelineEvent.
- [x] Relacionar TimelineEvent con Content de forma opcional.
- [x] Exponer linea del tiempo publica con detalle por slug.
- [x] Confirmar que Timeline no es agenda general.

### Slice 11 - Canales Asistidos

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Administrar CommunicationChannel (CRUD admin).
- [x] Asociar Publication con canales (PublicationChannel).
- [x] Preparar texto o estado de distribucion.
- [x] Registrar distribucion manual/asistida.
- [x] Confirmar que los canales no son Source.

### Slice 12 - Trazabilidad Minima

Estado: **Completado** (verificado en project-slices-checklist.md)

- [x] Registrar eventos relevantes de creacion (CREATED, UPDATED).
- [x] Registrar preparacion (PREPARED).
- [x] Registrar publicacion (PUBLISHED).
- [x] Registrar retiro y archivo (WITHDRAWN, ARCHIVED).
- [x] Permitir consulta administrativa filtrada (GET /admin/traceability-records).
- [x] Evitar CRUD libre de trazabilidad (solo consulta filtrada).

### Slice 13 - End-to-End MVP

Estado: **Completado** — ver auditoría cerrada

- [x] Login administrativo.
- [x] Crear Content.
- [x] Asociar clasificación mínima y filtros públicos por tipo, categoría y etiqueta.
- [x] Publicar como Publication.
- [x] Consultar desde portal publico.
- [x] Asociar multimedia.
- [x] Consultar trazabilidad minima.
- [x] Validar seguridad basica.
- [x] Sin IA funcional.
- [x] Sin roles avanzados.
- [x] Sin workflow multinivel.
- [x] Asociar fuente y validación a Content mediante módulos dedicados.
- [x] Registrar y exponer responsabilidad institucional en Publication.
- [x] Configuración básica, banners y menús declarados explícitamente diferidos fuera del MVP actual.

---

## 5. Checklist de Seguridad

- [x] TypeScript strict configurado.
- [x] DTOs validados desde el inicio (ValidationPipe global con whitelist + transform).
- [x] Sanitizacion considerada para contenido enriquecido (sanitize-html en body/summary).
- [x] Refresh token en cookie HttpOnly.
- [x] Cookies `Secure` en produccion (condicional por NODE_ENV).
- [x] Argon2 para contrasenas.
- [x] Sin registro publico.
- [x] Sin credenciales por defecto (solo seed dev).
- [x] CORS restringido por ambiente.
- [x] Secretos fuera de Git.
- [x] `.env.example` sin valores sensibles.
- [x] Logs sin tokens, cookies ni contrasenas.

---

## 6. Decisiones Pendientes (actualizadas)

- [x] Rama de trabajo: `main` (confirmada).
- [x] Estructura tecnica real: creada (monorepo pnpm, apps/web, apps/api, packages/shared).
- [x] Prisma: ejecutado (validate, generate, migrate dev, seed).
- [x] Estrategia local PostgreSQL: operativa via PrismaService.
- [x] Mecanismo de primer usuario admin: seed controlado.
- [x] Estrategia de preparación y despliegue no productivo definida; proveedor final diferido hasta su selección institucional.
- [ ] Almacenamiento multimedia: LocalStorageProvider operativo; remoto pendiente.
- [ ] Revisar documentos con estado `Draft`.

---

## 7. Acciones Bloqueadas

- [ ] Desplegar staging.
- [ ] Desplegar produccion.
- [ ] Configurar proveedor remoto definitivo.
- [ ] Introducir IA, chatbot, embeddings o pgvector en el MVP funcional (diferido).

---

## 8. Ubicacion Actual

```text
Estas aqui:

Baseline documental completa
-> Implementation ejecutada (Slices 0-13)
-> Backend operativo con NestJS + Prisma + PostgreSQL
-> Frontend operativo con React + Vite + MUI
-> Auditoría cerrada: bloques 0–7 completados
-> Source, Validation, filtros públicos y responsabilidad institucional implementados
-> Configuración básica, banners y menús diferidos fuera del MVP vigente
```

Siguiente movimiento recomendado:

```text
Planificar una fase posterior al MVP mediante un nuevo ADR y checklist de alcance.
```
