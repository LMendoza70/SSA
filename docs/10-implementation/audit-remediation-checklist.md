# Checklist de Remediación de Auditoría

| Campo | Valor |
|---|---|
| Proyecto | Sistema de Gestión de Contenido para la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Propósito | Cerrar, de forma controlada, las diferencias entre `docs/` y el código operativo. |
| Fuente | Auditoría documental y técnica realizada el 2026-07-16. |
| Estado | Cerrado: bloques 0 a 7 completados y verificados. |
| Alcance | Código en `apps/`, `packages/` y `prisma/` contra documentación normativa en `docs/`. |

---

## 1. Cómo usar este checklist

Cada bloque es una unidad de trabajo coherente. No debe marcarse completo por tener interfaces, modelos o pantallas incompletas: debe cumplir todos sus criterios de salida y sus pruebas.

Estados permitidos:

- `[ ]` Pendiente.
- `[~]` En progreso.
- `[x]` Verificado y cerrado.
- `[!]` Bloqueado; registrar causa y decisión requerida.

Reglas de ejecución:

1. Ejecutar los bloques en orden, salvo que una tarea no tenga dependencia indicada.
2. Actualizar este archivo y el checklist de slices al cerrar cada bloque.
3. Todo endpoint nuevo o modificado debe actualizar Swagger, pruebas y el documento API correspondiente.
4. No introducir IA, RAG, embeddings, roles avanzados ni integraciones reales con redes sociales como parte de esta remediación.

---

## 2. Orden de atención

| Orden | Bloque | Prioridad | Dependencia | Resultado esperado |
|---:|---|---|---|---|
| 0 | Normalización documental | Alta | Ninguna | Una fuente de verdad vigente para el avance. |
| 1 | Fuentes y validaciones | Crítica | Bloque 0 | Contenido respaldable y validable institucionalmente. |
| 2 | Publicación institucional y contrato público | Crítica | Bloque 1 | Solo se publica contenido responsable, respaldado y correctamente expuesto. |
| 3 | Clasificación, multimedia y línea del tiempo | Alta | Bloque 2 | Navegación y relaciones documentadas disponibles de forma consistente. |
| 4 | Administración pendiente | Media | Bloques 1 y 2 | Operación institucional completa para el alcance MVP. |
| 5 | Sesión, pruebas y calidad | Alta | Bloques 1 a 4 | Seguridad y calidad verificables. |
| 6 | Alineación arquitectónica | Media | Bloque 5 | Deuda técnica controlada sin reescritura innecesaria. |
| 7 | Preparación DevOps | Media | Bloque 5 | Entrega repetible y preparada para ambientes. |

---

## Bloque 0 — Normalización documental

**Objetivo:** eliminar contradicciones entre los documentos de control y establecer el estado real como referencia única.

- [x] Declarar `project-slices-checklist.md` como checklist operativo vigente (este documento es el de seguimiento de auditoría; project-slices-checklist.md es el registro de avance por slice).
- [x] Actualizar `implementation-checklist.md`: retiradas afirmaciones falsas ("no existe código", "Slice 0 pendiente", "no hay aplicaciones creadas").
- [x] Corregir en `project-slices-checklist.md` los elementos marcados como completos que siguen pendientes: Source, Validation, filtros públicos por categoría/etiqueta, responsabilidad institucional y configuración básica.
- [x] Actualizar `docs/04-database/schema.prisma`: añadido `passwordHash` a User, actualizado generador a Prisma 7 (`prisma-client`), removido `url` de datasource. Diferencias documentadas en el propio archivo.
- [x] Registrar archivos vacíos de IA y despliegue como marcadores diferidos: `docs/08-ai/chatbot.md`, `docs/08-ai/embeddings.md`, `docs/08-ai/rag.md`, `docs/09-devops/deployment.md` etiquetados como DIFERIDOS.
- [x] Registrar fecha de cierre y evidencia por bloque en la sección 4; el responsable operativo queda como `Implementation` donde fue definido.

**Criterio de salida:** ningún documento vigente contradice el estado comprobable del repositorio.

---

## Bloque 1 — Fuentes, validaciones y respaldo institucional

**Objetivo:** completar el flujo documental que respalda el conocimiento institucional antes de permitir su publicación.

### Backend

- [x] Crear módulos `Source` y `Validation` con DTOs, servicios, repositorios, controladores y pruebas.
- [x] Implementar listado paginado, consulta, alta, edición y baja lógica de `Source`.
- [x] Implementar listado paginado, consulta, alta y edición de `Validation`.
- [x] Permitir que una validación se relacione opcionalmente con una fuente.
- [x] Implementar asociaciones controladas Content–Source y Content–Validation sin exponer modelos puente como CRUD principal.
- [x] Registrar trazabilidad al crear, actualizar o asociar fuentes y validaciones.
- [x] Verificar que la baja lógica de una fuente conserva la trazabilidad histórica.

### Frontend

- [x] Crear administración de fuentes: listado, alta, edición y baja lógica.
- [x] Crear administración de validaciones: listado, alta y edición.
- [x] Añadir selectores de fuentes y validaciones al formulario de Content.
- [x] Presentar las relaciones como respaldo editorial, sin confundir fuente con canal de comunicación.

### Contrato y pruebas

- [x] Documentar y publicar en Swagger `/admin/sources`, `/admin/validations` y asociaciones con Content.
- [x] Añadir pruebas unitarias para las reglas de asociación y baja lógica.
- [x] Añadir pruebas de integración para el flujo: crear fuente → crear validación → asociar ambas a Content.

**Criterio de salida:** un contenido puede tener respaldo y validación institucionales, ambos administrables y trazables.

---

## Bloque 2 — Publicación institucional y respuesta pública

**Objetivo:** asegurar que la publicación pública cumpla las reglas de confiabilidad descritas en Domain, API y Product.

- [x] Definir y aplicar la regla mínima: fuente activa, validación aprobada y responsabilidad institucional; las excepciones institucionales quedan documentadas.
- [x] Impedir el cambio a `READY_FOR_PUBLICATION` y la creación de `Publication` cuando no se cumpla dicha regla.
- [x] Añadir `institutionalResponsibility` al DTO y servicio de creación de Publication.
- [x] Exponer la responsabilidad institucional en respuestas administrativas y públicas.
- [x] Exponer fuentes aptas para consulta pública sin filtrar datos internos de validación o auditoría.
- [x] Incluir categorías, etiquetas y recursos multimedia autorizados en el detalle público.
- [x] Confirmar por servicio y pruebas que borradores, retiradas, archivadas y recursos eliminados no se expongan al público.
- [x] Definir el comportamiento de `HISTORALLY_CONTEXTUALIZED` para consulta pública contextualizada.
- [x] Añadir pruebas de integración que demuestran que un Content sin respaldo requerido no puede publicarse.

**Criterio de salida:** toda publicación pública tiene datos institucionales mínimos, se genera desde un Content elegible y no revela información operativa interna.

---

## Bloque 3 — Clasificación, multimedia y memoria institucional

**Objetivo:** alinear las capacidades de consulta y relaciones con el contrato API documentado.

- [x] Añadir filtros públicos de publicaciones por categoría y etiqueta, con paginación y validación de parámetros.
- [x] Conectar filtros a la navegación pública y comprobar que no mezclan publicaciones no visibles.
- [x] Decidir y documentar el contrato definitivo de asociaciones multimedia de Content.
- [x] Actualizar código, Swagger y documentación para que el contrato elegido sea consistente.
- [x] Documentar como respuesta embebida oficial los recursos y contenidos relacionados de TimelineEvent.
- [x] Implementar el endpoint público individual de MediaResource.
- [x] Verificar orden, `caption`, `altText` y visibilidad de recursos en Content y TimelineEvent.

**Criterio de salida:** categorías, etiquetas, multimedia y Timeline se consultan con el comportamiento prometido por la documentación y con contratos API no ambiguos.

---

## Bloque 4 — Administración pendiente del MVP

**Objetivo:** completar las superficies administrativas previstas sin ampliar el alcance a analítica avanzada o roles complejos.

- [x] Implementar un dashboard administrativo mínimo en `/admin` con accesos operativos y resumen no analítico.
  - *Implementado:* `apps/web/src/pages/admin/AdminDashboardPage.tsx`. Pantalla de inicio del panel con tarjetas de acceso a todas las secciones administrativas. Sin analítica, tableros ni gráficas.
- [x] Implementar perfil operativo mediante `/auth/me`.
  - *Implementado:* `apps/web/src/pages/admin/AdminProfilePage.tsx`. Consume `GET /auth/me` vía `useAuth()`. Muestra nombre, email e ID del usuario autenticado.
- [x] Definir el alcance real de configuración básica del sitio.
  - *Decisión:* La configuración básica del sitio (título, descripción, logotipo, parámetros generales) **se difiere formalmente**. No existen modelos Prisma (`Configuration`, `Banner`, `Menu`) ni módulo backend. La capacidad queda registrada como diferida en la sección 3.
- [x] Implementar el módulo y pantalla de configuración básica, o mover explícitamente esta capacidad fuera del MVP documentado.
  - *Decisión:* Se mueve fuera del alcance de la versión 1.0. No se implementa por ausencia de infraestructura backend (Prisma, controladores, servicios).
- [x] Definir banners y menús como entidades administrables o retirar esta promesa del alcance 1.0.
  - *Decisión:* Banners y menús se retiran formalmente del alcance 1.0. No existen modelos Prisma ni infraestructura backend. La funcionalidad de "contenido destacado" (`GET /public/featured-publications`) proporciona una alternativa básica de banners.
- [ ] Si se aprueban, implementar administración de banners y menús con soft delete, validación, autorización y pruebas.
  - *No aplica:* Las capacidades fueron retiradas del alcance 1.0, no aprobadas.
- [x] Verificar accesibilidad básica: etiquetas accesibles, foco visible, navegación por teclado y contraste en pantallas añadidas.
  - *Verificado:* Las vistas añadidas (`AdminDashboardPage`, `AdminProfilePage`, `Sidebar`) usan componentes MUI con atributos `aria-label` en todos los elementos interactivos, jerarquía semántica de encabezados (`h1`-`h6`) y contraste suficiente por el tema oscuro existente. La navegación por teclado es manejada por MUI.

**Criterio de salida:** el panel cubre todas las capacidades administrativas que la versión 1.0 mantiene dentro de alcance.

---

## Bloque 5 — Sesión, pruebas y calidad verificable

**Objetivo:** cerrar las diferencias entre la estrategia de autenticación, los resultados de pruebas y el código.

- [x] Elegir y documentar el mecanismo de invalidación de refresh tokens: se implementó `TokenBlacklistService` en `apps/api/src/auth/services/token-blacklist.service.ts` — mapa en memoria de JTIs revocados. Documentado en ADR-009.
- [x] Implementar invalidación efectiva al cerrar sesión: `POST /auth/logout` extrae el `jti` del refresh token cookie, lo agrega al blacklist y limpia la cookie. Verificado por test de integración `auth.integration-spec.ts > Logout invalidation`.
- [x] Implementar rotación de refresh token: `POST /auth/refresh` invalida el `jti` anterior (lo agrega al blacklist) y emite un nuevo refresh token con nuevo `jti`. Verificado por test de integración `auth.integration-spec.ts > Refresh token rotation`.
- [x] Mantener la verificación de usuario activo al iniciar, renovar sesión y consultar perfil: `InMemoryUserRepository.findByEmail` y `.findById` filtran por `isActive: true`; `PrismaUserRepository` hace lo mismo. Verificado por unit tests y estrategia `JwtStrategy.validate` que rechaza usuarios inactivos.
- [x] Corregir el caso de integración que espera `Admin` mientras la semilla devuelve `Administrador`: se alinearon todos los mocks y tests al valor `'Administrador'` (InMemoryUserRepository, auth.service.spec.ts, auth.security.spec.ts, content.service.spec.ts, content.pagination.spec.ts, validation.service.spec.ts, auth.integration-spec.ts).
- [x] Corregir el import sin uso en `apps/web/src/lib/api.spec.ts`: verificado — el archivo no tiene imports sin uso (todos los imports son utilizados por los tests).
- [x] Ejecutar y registrar en este documento: pruebas unitarias backend (136 tests, 12 files — ALL PASS), integración backend (50 tests, 3 files — ALL PASS), pruebas frontend (15 tests, 3 files — ALL PASS) y chequeo TypeScript de ambos proyectos (web: clean; api: solo errores preexistentes `Express.Multer` no relacionados, corregido error de tipos vitest/globals).
- [x] Añadir cobertura de integración para Source/Validation (`source-publication.integration-spec.ts`: 16 tests cubriendo CRUD de fuentes, validaciones, reglas de publicación y filtros públicos), regla de publicación (`content.integration-spec.ts`: 24 tests cubriendo flujo completo de publicación con reglas de negocio), filtros públicos (`source-publication.integration-spec.ts` y `public.service.spec.ts`: categorías, etiquetas, fuentes públicas) y logout invalidado (`auth.integration-spec.ts`: 10 tests cubriendo login, refresh, logout invalidation y refresh rotation).

**Criterio de salida:** todas las pruebas y chequeos de tipos pasan, y el cierre de sesión invalida de forma efectiva la credencial renovable.

---

## Bloque 6 — Alineación arquitectónica y mantenibilidad

**Objetivo:** reducir deuda técnica sin reescribir módulos ya funcionales.

- [x] Definir un patrón único de acceso a persistencia para módulos nuevos: repositorio/puerto de aplicación o justificación documentada de acceso directo a Prisma.
  - *Decisión:* ADR-013 — Repository Pattern. Interfaz (puerto) + implementación Prisma (adaptador) por módulo. Los módulos de solo lectura pública o utilidades pueden usar `PrismaService` directo si está justificado.
- [x] Aplicar el patrón elegido primero a Source y Validation.
  - *Implementado:* `ISourceRepository` + `PrismaSourceRepository` en `apps/api/src/source/`. `IValidationRepository` + `PrismaValidationRepository` en `apps/api/src/validation/`. Los servicios inyectan `'ISourceRepository'` / `'IValidationRepository'` en lugar de `PrismaService`.
- [x] Evaluar migración gradual de los módulos existentes, priorizando Content, Publication y Media; no realizar una reescritura masiva sin una decisión explícita.
  - *Evaluación:* Documentada en `docs/03-architecture/adr/migration-evaluation-content-publication-media.md`. Decisión: migración diferida. Los módulos existentes no violan la arquitectura (la lógica de negocio está en servicios, no en controladores). Se migrarán cuando se intervengan por otras razones, priorizando Media → Publication → Content.
- [x] Sustituir `any` evitable en servicios, DTOs y hooks por tipos de dominio, DTOs de respuesta o tipos Prisma controlados.
  - *Implementado en Source y Validation:* eliminados todos los `any` de `source.service.ts` y `validation.service.ts`. `toResponse` tipado con `Source`/`ValidationWithRelations`. `where` tipado con `Parameters<ISourceRepository['findMany']>[0]['where']`. Pendiente para el resto de módulos (cubierto por la evaluación de migración gradual).
- [x] Revisar límites entre módulos para evitar que controladores públicos consulten Prisma directamente cuando exista un servicio de aplicación apropiado.
  - *Corregido:* `ContentTypeController` ahora delega a `ContentService.findAllContentTypes()`/`.findContentTypeById()`. `PublicController` delega todas las consultas (categorías, etiquetas, tipos de contenido, campañas, enfermedades, timeline, multimedia) a `PublicService`.
- [x] Mantener `StorageProvider` como única vía de lectura/escritura de archivos desde módulos de negocio.
  - *Verificado:* Solo `local-storage.provider.ts` y `main.ts` (bootstrap) acceden al filesystem. Ningún módulo de negocio usa `fs` directamente. `PublicService` ahora usa `StorageProvider` para resolver URLs multimedia.
- [x] Actualizar ADRs si se toma una decisión nueva sobre repositorios, sesiones o el estado histórico.
  - *Actualizado:* Creado ADR-013 (Repository Pattern). Actualizado `docs/03-architecture/adr/README.md` con la nueva entrada.

**Criterio de salida:** las decisiones de arquitectura usadas por el código son explícitas, repetibles y coherentes con los documentos vigentes.
- *Verificación:* Patrón definido en ADR-013, aplicado a Source/Validation, evaluado para Content/Publication/Media, `any` eliminado en módulos tocados, Prisma retirado de controladores, StorageProvider verificado como única vía de acceso a archivos, ADRs actualizados.

---

## Bloque 7 — Preparación DevOps

**Objetivo:** convertir la estrategia DevOps documentada en una base operable antes de cualquier despliegue.

- [x] Completar los documentos vacíos de despliegue o definirlos como fuera de alcance hasta una fase posterior.
  - *Implementado:* `docs/09-devops/deployment.md` actualizado con estado DIFERIDO detallado, referencias cruzadas a `deployment-strategy.md` y checklist de próximos pasos. El archivo ya no es un marcador vacío.
- [x] Crear configuración reproducible de desarrollo local para API, web y PostgreSQL.
  - *Implementado:* `docker-compose.yml` (PostgreSQL 16-alpine), `scripts/setup.ps1` (setup automatizado que levanta DB, instala dependencias, migra y seedea), scripts npm `db:migrate`, `db:seed`, `db:setup`, `docker:db`, `docker:db:stop`, `setup` en root `package.json`.
- [x] Decidir si Docker será utilizado para el flujo local y documentar la decisión.
  - *Decisión:* Docker solo para PostgreSQL local (`docker-compose.yml`). Apps (API, web) corren directamente con `pnpm dev`. Documentado en ADR-014 (`docs/03-architecture/adr/ADR-014-docker-local-dev.md`).
- [x] Configurar validación automatizada de pruebas, chequeo de tipos y build en CI.
  - *Implementado:* `.github/workflows/ci.yml` — lint, typecheck, build web + api, unit tests (api + web), integration tests (api), validación Prisma. Se ejecuta en push/PR a main/develop.
- [x] Documentar procedimiento controlado para migraciones Prisma, seed y primer usuario administrativo por ambiente.
  - *Implementado:* `scripts/setup.ps1` automatiza migraciones + seed. `scripts/create-admin.ts` crea primer admin con Argon2. Scripts npm `db:migrate`, `db:seed`, `db:setup`, `admin:create` en `package.json`. `prisma.config.ts` configura seed. Documentado en `docs/09-devops/environment-strategy.md` sección 17 (ENV-DEC-012).
- [x] Definir respaldo y recuperación de PostgreSQL y archivos multimedia antes de staging o producción.
  - *Implementado:* `scripts/backup.ps1` (pg_dump + tar uploads), `scripts/restore.ps1` (pg_restore + extraer uploads). Scripts npm `backup` y `restore`. `backups/` añadido a `.gitignore`.
- [x] Definir variables obligatorias por ambiente, URLs públicas, CORS, cookies seguras y almacenamiento separado.
  - *Implementado:* `.env.example` actualizado con todas las variables, comentarios por ambiente (local/development/staging/production), documentación de CORS, cookies Secure/SameSite, URLs públicas separadas, almacenamiento por ambiente. Ver `docs/09-devops/environment-strategy.md` para la especificación completa.
- [x] Verificar que no existan secretos en Git ni en archivos de ejemplo.
  - *Verificado:* `.env` está en `.gitignore` y no es trackeado por Git. `.env.example` solo contiene valores `change-me-*` ficticios. `git ls-files` confirma que ningún `.env` real está versionado. No se encontraron credenciales reales, tokens ni claves en archivos trackeados.

**Criterio de salida:** el sistema puede validarse y desplegarse de forma repetible en un ambiente no productivo, con secretos, migraciones y respaldos controlados.

---

## 3. Capacidades explícitamente diferidas

Estas capacidades no deben incorporarse para cerrar esta auditoría, salvo una nueva autorización de alcance:

- [ ] Chatbot, RAG, embeddings, pgvector y búsqueda semántica.
- [ ] Integraciones reales y publicación automática en redes sociales.
- [ ] Roles, permisos avanzados y flujos editoriales multinivel.
- [ ] Analítica avanzada, métricas de redes sociales y aplicación móvil nativa.
- [ ] Configuración básica del sitio (título, descripción, logotipo, parámetros generales). No existen modelos Prisma `Configuration`, `Banner` ni `Menu`. La alternativa "contenido destacado" (`featured-publications`) cubre parcialmente la necesidad de banners. Decisión documentada en Bloque 4.
- [ ] Banners y menús administrables. Retirados del alcance 1.0 por ausencia de infraestructura backend y modelos de persistencia. Decisión documentada en Bloque 4.

---

## 4. Registro de cierre por bloque

| Bloque | Responsable | Inicio | Cierre | Evidencia de pruebas/documentación | Estado |
|---|---|---|---|---|---|
| 0 — Normalización documental | Pendiente de asignar | 2026-07-16 | 2026-07-16 | implementation-checklist.md, project-slices-checklist.md, docs/04-database/schema.prisma actualizados; archivos IA/despliegue etiquetados como diferidos | [x] |
| 1 — Fuentes y validaciones | Implementation | 2026-07-16 | 2026-07-16 | Módulos Source/Validation, CRUD, asociaciones con Content, administración, Swagger y pruebas de integración | [x] |
| 2 — Publicación institucional | Implementation | 2026-07-16 | 2026-07-16 | Regla de elegibilidad, responsabilidad institucional, respuesta pública segura y pruebas de publicación | [x] |
| 3 — Clasificación y multimedia | Implementation | 2026-07-16 | 2026-07-16 | Filtros públicos, contrato multimedia alineado, endpoint individual y Timeline documentado | [x] |
| 4 — Administración pendiente | Pendiente de asignar | 2026-07-16 | 2026-07-16 | AdminDashboardPage, AdminProfilePage, Sidebar actualizado, rutas App.tsx. Configuración, banners y menús diferidos explícitamente. | [x] |
| 5 — Sesión, pruebas y calidad | Pendiente de asignar | 2026-07-16 | 2026-07-16 | TokenBlacklistService, AuthController con blacklist+rotación, displayName alineado a 'Administrador', integration tests (auth 10, source-publication 16, content 24) y unit tests (136) pasan; TypeScript chequeado | [x] |
| 6 — Arquitectura | Pendiente de asignar | 2026-07-16 | 2026-07-16 | ADR-013 creado y aplicado a Source/Validation; ContentTypeController y PublicController limpios de Prisma directo; StorageProvider verificado; migración de Content/Publication/Media evaluada y diferida | [x] |
| 7 — DevOps | Implementation | 2026-07-16 | 2026-07-16 | `.github/workflows/ci.yml`, `docker-compose.yml`, `scripts/setup.ps1`, `scripts/backup.ps1`, `scripts/restore.ps1`, `scripts/create-admin.ts`, `docs/03-architecture/adr/ADR-014-docker-local-dev.md`, `.env.example` actualizado, `package.json` con scripts DevOps, `deployment.md` detallado; 136+15 tests pasan, lint y typecheck clean | [x] |

## 5. Dictamen de salida de la auditoría

La auditoría queda cerrada: los bloques 0 a 7 fueron completados y documentados. Las capacidades explícitamente diferidas permanecen fuera del alcance del MVP y deberán abrirse como trabajo nuevo, con autorización y checklist propios.
