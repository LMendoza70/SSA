# Especificación Arquitectónica de Frontend

| Campo | Valor |
|-------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Especificación Arquitectónica de Frontend |
| Código | DOC-015 |
| Versión | 1.0.0 |
| Estado | Baseline |
| Fase | Phase 06 — Frontend |
| Documento anterior | `docs/05-api/authentication.md` |
| Documento posterior recomendado | `docs/06-frontend/ui-structure.md` |
| Referencias técnicas secundarias | `docs/05-api/api.md`, `docs/05-api/authentication.md` |
| Rol arquitectónico | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect & Frontend Architect |
| Fecha | 2026-07-08 |

---

## 1. Propósito

Este documento define la **especificación arquitectónica inicial del Frontend** para la Plataforma de Gestión, Comunicación y Educación para la Salud de la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su propósito es establecer cómo la aplicación frontend deberá presentar, consultar y operar capacidades del dominio sin adelantar implementación de componentes React, diseño visual definitivo ni lógica técnica prematura.

El frontend deberá proteger la capacidad central del producto:

> **Publicar información confiable.**

El frontend no es únicamente una interfaz gráfica. Es el medio principal mediante el cual la población accede a información oficial, clara y comprensible, y mediante el cual el responsable institucional opera el ciclo mínimo de administración, publicación, distribución y preservación del conocimiento institucional.

---

## 2. Alcance del documento

Este documento sí define:

- principios de arquitectura frontend;
- separación entre portal público, panel administrativo y autenticación;
- stack frontend aprobado;
- estructura lógica de aplicación;
- mapa preliminar de rutas y pantallas;
- relación con la API baseline;
- criterios de navegación pública;
- criterios de navegación administrativa;
- estrategia conceptual de estado, datos y formularios;
- criterios para integración con autenticación;
- criterios de accesibilidad, responsive y SEO básico;
- límites entre frontend, API, dominio y backend;
- criterios de aceptación arquitectónica.

---

## 3. Fuera de alcance

Este documento no genera ni autoriza:

- componentes React reales;
- código TypeScript;
- rutas implementadas con React Router;
- configuración Vite;
- temas Material UI definitivos;
- maquetación visual definitiva;
- wireframes finales;
- diseño UI pixel-perfect;
- formularios implementados;
- schemas Zod reales;
- hooks reales;
- servicios Axios reales;
- integración ejecutable con API;
- pruebas unitarias o E2E;
- frontend de IA;
- chatbot;
- búsqueda semántica;
- roles avanzados;
- workflow editorial multinivel;
- panel avanzado de usuarios;
- integración automática con redes sociales.

El mapa de pantallas incluido es **preliminar y revisable**. No representa implementación ni diseño visual definitivo.

---

## 4. Relación con la baseline oficial

El frontend deriva de la baseline aprobada:

| Fuente | Aporte al Frontend |
|--------|--------------------|
| Foundation | La tecnología sirve al propósito institucional; la documentación gobierna el desarrollo. |
| Product | El frontend debe facilitar acceso a información oficial, confiable, clara y comprensible. |
| Product Principles | Debe priorizar claridad, accesibilidad, recursos visuales, prevención y conocimiento accesible. |
| Personas | Debe servir a Ciudadano, Responsable Editorial / Administrador de Plataforma y públicos secundarios. |
| Ubiquitous Language | Debe respetar Publicación, Content, Fuente, Validación, Campaña, Enfermedad, Recurso, Canal y Línea del Tiempo. |
| Domain | Debe reflejar el ciclo de vida del conocimiento institucional sin convertirlo en pantallas técnicas. |
| Business Rules | Debe impedir flujos que rompan confiabilidad, vigencia, trazabilidad o frontera no clínica. |
| Use Cases | Debe soportar consulta pública, búsqueda, gestión administrativa inicial, publicación y línea del tiempo. |
| Architecture | Debe respetar Clean Architecture, Modular Monolith, DDD Lite y separación de responsabilidades. |
| Database | No debe exponer estructura de persistencia ni relaciones puente como concepto visual principal. |
| API | Consume `/api/v1/public/*`, `/api/v1/admin/*` y `/api/v1/auth/*` como contrato arquitectónico. |
| Authentication | Protege el panel administrativo con autenticación mínima y sin registro público. |

Este documento no modifica dominio, API ni autenticación. Define cómo el frontend deberá consumir esas capacidades de forma coherente.

---

## 5. Principio rector de Frontend

> El frontend debe hacer que el conocimiento institucional confiable sea encontrable, comprensible, consultable y operable sin filtrar complejidad técnica ni estructura interna del sistema.

La interfaz pública deberá priorizar claridad para la población.

La interfaz administrativa deberá priorizar operación responsable, trazabilidad, consistencia editorial y reducción de errores institucionales.

---

## 6. Stack frontend aprobado

El stack aprobado para la implementación posterior es:

| Responsabilidad | Tecnología |
|-----------------|------------|
| Framework UI | React |
| Lenguaje | TypeScript |
| Build tool | Vite |
| UI / Component library | Material UI |
| Enrutamiento | React Router |
| Server state / data fetching | TanStack Query |
| Formularios | React Hook Form |
| Validación de formularios | Zod |
| Cliente HTTP | Axios |
| Editor de contenido | Tiptap Editor |

Estas tecnologías no gobiernan el dominio. Son mecanismos para implementar la experiencia frontend posterior.

---

## 7. Decisiones arquitectónicas de Frontend

### FE-DEC-001 — Frontend dividido por superficies

El frontend deberá separarse en tres superficies lógicas:

```text
Portal Público
Panel Administrativo
Autenticación
```

Esta separación no implica necesariamente tres aplicaciones separadas. En el MVP puede implementarse como una sola SPA con segmentación clara de rutas, layouts, guards y módulos.

---

### FE-DEC-002 — Portal Público orientado a consulta ciudadana

El Portal Público deberá exponer información publicada, vigente o históricamente contextualizada de forma clara, rápida y responsive.

No deberá mostrar estados internos de edición, validación o persistencia salvo que aporten claridad pública.

---

### FE-DEC-003 — Panel Administrativo orientado a operación institucional

El Panel Administrativo deberá permitir operar capacidades administrativas del MVP sin convertir la interfaz en un sistema avanzado de workflow editorial.

El actor operativo inicial será:

```text
Responsable Editorial / Administrador de Plataforma
```

Este actor administra información, pero no sustituye la responsabilidad institucional de la Jurisdicción Sanitaria.

---

### FE-DEC-004 — Autenticación separada de responsabilidad institucional

La autenticación identifica al operador. No convierte al usuario autenticado en propietario institucional del contenido.

El frontend deberá reflejar esta separación en textos, acciones y confirmaciones administrativas.

---

### FE-DEC-005 — La API gobierna integración, no Prisma

El frontend deberá consumir la API baseline.

No deberá conocer modelos Prisma, tablas, relaciones puente ni enums internos como contrato directo.

Si una pantalla necesita datos compuestos, deberá solicitarlos mediante endpoints orientados a capacidades, no mediante llamadas que reconstruyan relaciones internas de persistencia.

---

### FE-DEC-006 — Rutas como contrato de navegación, no implementación final

Las rutas propuestas en este documento son preliminares.

Su función es organizar experiencia y alcance, no imponer estructura de carpetas, nombres de componentes ni decisiones de React Router definitivas.

---

### FE-DEC-007 — Formularios administrativos con validación estricta

Los formularios administrativos deberán usar validación del lado cliente para reducir errores operativos, pero la validación del frontend no sustituye validación del dominio ni validación backend.

El frontend ayuda a prevenir errores; la API y el dominio siguen siendo autoridad de reglas.

---

### FE-DEC-008 — Estado del servidor separado de estado de interfaz

La información obtenida desde API deberá tratarse como server state.

TanStack Query deberá encargarse de carga, cache, reintentos, invalidación y sincronización de datos remotos en implementación posterior.

El estado local de interfaz deberá limitarse a navegación, formularios, filtros temporales, diálogos, selección visual y preferencias de UI.

---

### FE-DEC-009 — Diseño responsive desde el MVP

El Portal Público deberá funcionar correctamente en móviles y escritorio.

La población general es el público principal, por lo que la consulta móvil no es secundaria.

---

### FE-DEC-010 — SEO básico para consulta pública

Las páginas públicas de detalle de publicación, campaña, enfermedad y eventos relevantes deberán permitir metadatos básicos, títulos claros y URLs comprensibles.

El SEO avanzado queda fuera del MVP, pero la estructura del frontend no deberá impedirlo.

---

### FE-DEC-011 — Línea del Tiempo independiente de Content

La Línea del Tiempo tendrá capacidad visual y multimedia propia.

El frontend deberá tratar los eventos históricos como entidades públicas independientes, no como simples vistas de publicaciones generales.

Las relaciones con Content serán contextuales y opcionales.

---

### FE-DEC-012 — Recursos multimedia como soporte de comprensión

Los recursos multimedia deberán apoyar claridad, aprendizaje y consulta pública.

El frontend no deberá convertir el gestor multimedia en un DAM avanzado dentro del MVP.

---

## 8. Superficies principales del Frontend

### 8.1 Portal Público

Responsabilidad:

- consulta pública de publicaciones;
- búsqueda básica;
- navegación por tipos, categorías y etiquetas;
- consulta de campañas;
- consulta de enfermedades;
- consulta de línea del tiempo;
- acceso a recursos multimedia asociados;
- contenido destacado;
- claridad pública y responsive.

Actor principal:

```text
Ciudadano
```

Actores secundarios:

```text
Profesional de la Salud
Estudiante
Investigador
Medio de Comunicación
Autoridad Sanitaria
```

---

### 8.2 Panel Administrativo

Responsabilidad:

- gestión de Content;
- gestión de Publication;
- gestión de Source;
- gestión de Validation;
- gestión de Campaign;
- gestión de Disease;
- gestión de MediaResource;
- gestión de TimelineEvent;
- preparación de distribución;
- consulta de trazabilidad mínima;
- operación institucional inicial del MVP.

Actor principal:

```text
Responsable Editorial / Administrador de Plataforma
```

---

### 8.3 Autenticación

Responsabilidad:

- iniciar sesión;
- renovar sesión;
- cerrar sesión;
- consultar usuario autenticado;
- proteger rutas administrativas.

No existirá registro público ni bootstrap vía frontend en el MVP.

---

## 9. Mapa preliminar de rutas y pantallas

Las rutas son preliminares y revisables. Se definen para alinear experiencia, API y casos de uso.

---

## 10. Portal Público — rutas preliminares

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/` | Inicio público | Presentar contenido destacado, accesos principales, campañas relevantes y navegación clara. | `GET /api/v1/public/featured-publications` |
| `/publicaciones` | Listado de publicaciones | Consultar publicaciones disponibles con filtros básicos. | `GET /api/v1/public/publications` |
| `/publicaciones/:slug` | Detalle de publicación | Consultar una publicación oficial. | `GET /api/v1/public/publications/{publicSlug}` |
| `/buscar` | Búsqueda pública | Buscar información publicada por texto y filtros básicos. | `GET /api/v1/public/search` |
| `/campanas` | Listado de campañas | Consultar campañas vigentes o históricas. | `GET /api/v1/public/campaigns` |
| `/campanas/:slug` | Detalle de campaña | Consultar propósito, contexto y publicaciones relacionadas de una campaña. | `GET /api/v1/public/campaigns/{campaignSlug}` |
| `/enfermedades` | Listado de enfermedades | Consultar temas de salud pública. | `GET /api/v1/public/diseases` |
| `/enfermedades/:slug` | Detalle de enfermedad | Consultar información pública, preventiva y publicaciones relacionadas. | `GET /api/v1/public/diseases/{diseaseSlug}` |
| `/linea-del-tiempo` | Línea del tiempo institucional | Consultar memoria histórica institucional. | `GET /api/v1/public/timeline-events` |
| `/linea-del-tiempo/:slug` | Detalle de evento histórico | Consultar evento histórico con multimedia propio y contenidos relacionados. | `GET /api/v1/public/timeline-events/{timelineEventSlug}`, `GET /api/v1/public/timeline-events/{timelineEventSlug}/media-resources` |
| `/categorias/:slug` | Publicaciones por categoría | Navegar por clasificación editorial. | `GET /api/v1/public/categories/{categorySlug}/publications` |
| `/etiquetas/:slug` | Publicaciones por etiqueta | Navegar por temas o agrupadores editoriales ligeros. | `GET /api/v1/public/tags/{tagSlug}/publications` |
| `/tipos/:code` | Publicaciones por tipo editorial | Consultar publicaciones por tipo editorial sin fragmentar el dominio. | `GET /api/v1/public/content-types/{contentTypeCode}/publications` |
| `/recursos/:id` | Consulta o descarga de recurso | Acceder a recurso multimedia permitido públicamente. | `GET /api/v1/public/media-resources/{id}` |
| `/no-encontrado` | No encontrado | Informar que el recurso no existe o no está disponible públicamente. | No aplica |
| `/error` | Error público | Informar error de consulta sin exponer detalles técnicos. | No aplica |

### 10.1 Reglas del Portal Público

- No deberá mostrar borradores.
- No deberá mostrar publicaciones retiradas sin contexto histórico permitido.
- No deberá mostrar estados técnicos internos de `Content`.
- No deberá sugerir diagnóstico, tratamiento individual ni consulta clínica.
- Deberá diferenciar información vigente de información histórica cuando aplique.
- Deberá priorizar lenguaje claro para población general.
- Deberá permitir consulta móvil adecuada.

---

## 11. Autenticación — rutas preliminares

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/login` | Inicio de sesión administrativa | Autenticar operador institucional. | `POST /api/v1/auth/login` |
| `/admin/logout` | Cierre de sesión | Cerrar sesión administrativa. | `POST /api/v1/auth/logout` |
| `/admin/session` | Validación de sesión | Resolver estado de sesión y redirigir según corresponda. | `GET /api/v1/auth/me` |

### 11.1 Reglas de autenticación en frontend

- No existirá pantalla de registro público.
- No existirá pantalla de bootstrap de primer usuario.
- El refresh token estará gestionado mediante cookie HttpOnly, no por acceso directo desde JavaScript.
- El access token deberá tratarse como dato sensible.
- Las rutas administrativas deberán protegerse mediante guard conceptual de sesión.
- Si la sesión expira, el usuario deberá volver a autenticarse o renovar sesión según comportamiento definido por la API.

---

## 12. Panel Administrativo — rutas preliminares

### 12.1 Dashboard administrativo

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin` | Dashboard administrativo | Presentar accesos principales y resumen operativo inicial. | Composición de endpoints admin |
| `/admin/perfil` | Perfil operativo | Mostrar usuario autenticado y datos mínimos de sesión. | `GET /api/v1/auth/me` |

El dashboard no deberá convertirse en sistema analítico avanzado durante el MVP.

---

### 12.2 Gestión de Content

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/contenidos` | Listado administrativo de contenidos | Gestionar piezas editoriales institucionales. | `GET /api/v1/admin/contents` |
| `/admin/contenidos/nuevo` | Crear contenido | Crear Content como pieza editorial trazable. | `POST /api/v1/admin/contents` |
| `/admin/contenidos/:id` | Detalle administrativo de contenido | Consultar datos completos de Content. | `GET /api/v1/admin/contents/{contentId}` |
| `/admin/contenidos/:id/editar` | Editar contenido | Actualizar información editorial. | `PATCH /api/v1/admin/contents/{contentId}` |
| `/admin/contenidos/:id/fuentes` | Fuentes asociadas | Asociar o reemplazar fuentes de respaldo. | `PUT /api/v1/admin/contents/{contentId}/sources` |
| `/admin/contenidos/:id/validaciones` | Validaciones asociadas | Asociar validaciones al contenido. | `PUT /api/v1/admin/contents/{contentId}/validations` |
| `/admin/contenidos/:id/clasificacion` | Clasificación editorial | Asociar tipo, categorías y etiquetas. | `PUT /api/v1/admin/contents/{contentId}/categories`, `PUT /api/v1/admin/contents/{contentId}/tags` |
| `/admin/contenidos/:id/recursos` | Recursos del contenido | Asociar recursos multimedia. | `PUT /api/v1/admin/contents/{contentId}/media-resources` |
| `/admin/contenidos/:id/publicacion` | Publicación del contenido | Preparar, publicar, retirar o archivar exposición pública. | Endpoints admin de publication |

#### Reglas de UI para Content

- Crear Content no equivale a publicarlo.
- El formulario deberá distinguir contenido editorial de publicación pública.
- La interfaz no deberá presentar `Content` como noticia, aviso o documento rígido; deberá usar tipo editorial.
- La asociación de fuentes, validaciones, campañas, enfermedades, recursos, categorías y etiquetas deberá aparecer como relaciones editoriales controladas.

---

### 12.3 Gestión de Publication

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/publicaciones` | Listado administrativo de publicaciones | Gestionar exposición pública de contenidos. | `GET /api/v1/admin/publications` |
| `/admin/publicaciones/:id` | Detalle administrativo de publicación | Consultar estado, vigencia, contexto público y distribución. | `GET /api/v1/admin/publications/{publicationId}` |
| `/admin/contenidos/:id/publicar` | Publicar contenido | Convertir Content preparado en Publicación. | `POST /api/v1/admin/contents/{contentId}/publication` |
| `/admin/publicaciones/:id/editar` | Actualizar publicación | Actualizar metadatos públicos, vigencia o contexto. | `PATCH /api/v1/admin/publications/{publicationId}` |
| `/admin/publicaciones/:id/retirar` | Retirar publicación | Retirar de consulta pública sin perder trazabilidad. | `POST /api/v1/admin/publications/{publicationId}/withdrawal` |
| `/admin/publicaciones/:id/archivar` | Archivar publicación | Preservar memoria institucional sin consulta pública ordinaria. | `POST /api/v1/admin/publications/{publicationId}/archive` |
| `/admin/publicaciones/:id/distribucion` | Distribución de publicación | Preparar o registrar distribución por canales. | `GET /api/v1/admin/publications/{publicationId}/distribution-channels` |

#### Reglas de UI para Publication

- Publicar deberá requerir confirmación explícita.
- Retirar no deberá presentarse como eliminación ordinaria.
- Archivar no deberá confundirse con `DELETE` técnico.
- La vista deberá diferenciar estado público, vigencia y contexto histórico.

---

### 12.4 Gestión de Source

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/fuentes` | Listado de fuentes | Administrar orígenes o respaldos del conocimiento. | `GET /api/v1/admin/sources` |
| `/admin/fuentes/nueva` | Crear fuente | Registrar fuente institucional, documental o histórica. | `POST /api/v1/admin/sources` |
| `/admin/fuentes/:id` | Detalle de fuente | Consultar fuente y relaciones. | `GET /api/v1/admin/sources/{sourceId}` |
| `/admin/fuentes/:id/editar` | Editar fuente | Actualizar datos de fuente. | `PATCH /api/v1/admin/sources/{sourceId}` |

#### Reglas de UI para Source

- La fuente no deberá presentarse como contenido publicado.
- La fuente no deberá confundirse con canal de comunicación.
- La fuente respalda conocimiento; no sustituye responsabilidad institucional.

---

### 12.5 Gestión de Validation

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/validaciones` | Listado de validaciones | Consultar validaciones institucionales. | `GET /api/v1/admin/validations` |
| `/admin/validaciones/nueva` | Crear validación | Registrar confirmación institucional. | `POST /api/v1/admin/validations` |
| `/admin/validaciones/:id` | Detalle de validación | Consultar resultado, tipo y contexto. | `GET /api/v1/admin/validations/{validationId}` |

#### Reglas de UI para Validation

- La validación no deberá presentarse como un checkbox simple.
- Deberá distinguir autenticidad, vigencia, pertinencia y validación institucional completa cuando aplique.
- La validación no sustituye autenticación de usuario.

---

### 12.6 Gestión de Campaign

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/campanas` | Listado de campañas | Administrar iniciativas institucionales agrupadoras. | `GET /api/v1/admin/campaigns` |
| `/admin/campanas/nueva` | Crear campaña | Crear iniciativa institucional temporal o contextual. | `POST /api/v1/admin/campaigns` |
| `/admin/campanas/:id` | Detalle de campaña | Consultar publicaciones, enfermedades y contexto. | `GET /api/v1/admin/campaigns/{campaignId}` |
| `/admin/campanas/:id/editar` | Editar campaña | Actualizar información de campaña. | `PATCH /api/v1/admin/campaigns/{campaignId}` |
| `/admin/campanas/:id/contenidos` | Contenidos relacionados | Asociar contenidos a campaña. | `PUT /api/v1/admin/campaigns/{campaignId}/contents` |
| `/admin/campanas/:id/enfermedades` | Enfermedades relacionadas | Asociar enfermedades a campaña. | `PUT /api/v1/admin/campaigns/{campaignId}/diseases` |

#### Reglas de UI para Campaign

- Campaign no deberá presentarse como publicación simple.
- Una campaña puede tener publicaciones relacionadas.
- Una campaña puede ser vigente o histórica.

---

### 12.7 Gestión de Disease

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/enfermedades` | Listado de enfermedades | Administrar conceptos temáticos de salud pública. | `GET /api/v1/admin/diseases` |
| `/admin/enfermedades/nueva` | Crear enfermedad | Crear tema sanitario no clínico. | `POST /api/v1/admin/diseases` |
| `/admin/enfermedades/:id` | Detalle de enfermedad | Consultar contenidos y campañas relacionadas. | `GET /api/v1/admin/diseases/{diseaseId}` |
| `/admin/enfermedades/:id/editar` | Editar enfermedad | Actualizar información temática. | `PATCH /api/v1/admin/diseases/{diseaseId}` |
| `/admin/enfermedades/:id/contenidos` | Contenidos relacionados | Asociar contenidos a enfermedad. | `PUT /api/v1/admin/diseases/{diseaseId}/contents` |

#### Reglas de UI para Disease

- Disease no deberá presentarse como diagnóstico ni atención clínica.
- Disease organiza información pública, preventiva y educativa.
- La interfaz deberá evitar lenguaje clínico personalizado.

---

### 12.8 Gestión de MediaResource

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/recursos` | Biblioteca multimedia básica | Administrar recursos reutilizables. | `GET /api/v1/admin/media-resources` |
| `/admin/recursos/nuevo` | Crear / registrar recurso | Subir o registrar imagen, PDF, infografía, documento o enlace. | `POST /api/v1/admin/media-resources` |
| `/admin/recursos/:id` | Detalle de recurso | Consultar metadatos y asociaciones. | `GET /api/v1/admin/media-resources/{mediaResourceId}` |
| `/admin/recursos/:id/editar` | Editar recurso | Actualizar metadatos del recurso. | `PATCH /api/v1/admin/media-resources/{mediaResourceId}` |

#### Reglas de UI para MediaResource

- Las operaciones `PUT /media-resources` sobre Content o TimelineEvent reemplazan el conjunto completo de asociaciones multimedia de ese recurso padre. Si en fases posteriores se requiere granularidad fina, podrán definirse operaciones específicas de alta o baja de asociaciones.
- Los recursos deberán reutilizarse sin duplicación innecesaria.
- La biblioteca no será DAM avanzado en MVP.
- Los recursos podrán asociarse a Content y TimelineEvent.

---

### 12.9 Gestión de TimelineEvent

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/linea-del-tiempo` | Listado de eventos históricos | Administrar memoria institucional. | `GET /api/v1/admin/timeline-events` |
| `/admin/linea-del-tiempo/nuevo` | Crear evento histórico | Registrar evento histórico institucional. | `POST /api/v1/admin/timeline-events` |
| `/admin/linea-del-tiempo/:id` | Detalle de evento histórico | Consultar información, recursos y contenidos relacionados. | `GET /api/v1/admin/timeline-events/{timelineEventId}` |
| `/admin/linea-del-tiempo/:id/editar` | Editar evento histórico | Actualizar datos del evento. | `PATCH /api/v1/admin/timeline-events/{timelineEventId}` |
| `/admin/linea-del-tiempo/:id/recursos` | Recursos del evento histórico | Asociar multimedia propio del evento. | `PUT /api/v1/admin/timeline-events/{timelineEventId}/media-resources` |
| `/admin/linea-del-tiempo/:id/contenidos` | Contenidos relacionados | Asociar publicaciones o contenidos contextuales. | `PUT /api/v1/admin/timeline-events/{timelineEventId}/contents` |

#### Reglas de UI para TimelineEvent

- La Línea del Tiempo no es agenda ni bitácora general.
- Cada evento debe tener valor histórico institucional.
- Los recursos multimedia del evento son propios y no dependen de Content.
- La relación con Content es opcional y contextual.

---

### 12.10 Gestión de canales y distribución

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/canales` | Canales de comunicación | Administrar canales disponibles para preparación de distribución. | `GET /api/v1/admin/communication-channels` |
| `/admin/canales/nuevo` | Crear canal | Registrar canal de comunicación. | `POST /api/v1/admin/communication-channels` |
| `/admin/canales/:id/editar` | Editar canal | Actualizar metadatos de canal. | `PATCH /api/v1/admin/communication-channels/{channelId}` |
| `/admin/publicaciones/:id/distribucion` | Distribución de publicación | Consultar canales de distribución asociados a una publicación. | `GET /api/v1/admin/publications/{publicationId}/distribution-channels` |
| `/admin/publicaciones/:id/distribucion/canales` | Canales de distribución de publicación | Reemplazar canales de distribución asociados a la publicación. | `PUT /api/v1/admin/publications/{publicationId}/distribution-channels` |
| `/admin/publicaciones/:id/distribucion/canales/:channelId` | Estado de canal de distribución | Actualizar estado de distribución de un canal específico. | `PATCH /api/v1/admin/publications/{publicationId}/distribution-channels/{channelId}` |
| `/admin/publicaciones/:id/distribucion/registro` | Registrar distribución manual | Registrar distribución manual asistida de una publicación. | `POST /api/v1/admin/publications/{publicationId}/distribution-records` |

#### Reglas de UI para canales

- `/admin/distribucion` queda fuera del MVP como vista agregada general; podrá evaluarse en una versión posterior si se requiere monitoreo transversal de distribución.
- Los canales no son fuente de verdad.
- La distribución no crea conocimiento institucional.
- En MVP, la distribución puede ser preparación o registro manual asistido.

---

### 12.11 Trazabilidad institucional mínima

| Ruta frontend | Pantalla / Vista | Propósito | API conceptual |
|---------------|------------------|-----------|----------------|
| `/admin/trazabilidad` | Consulta de trazabilidad | Consultar eventos institucionales relevantes. | `GET /api/v1/admin/traceability-records` |
| `/admin/trazabilidad/:id` | Detalle de trazabilidad | Consultar evento de trazabilidad. | `GET /api/v1/admin/traceability-records/{traceabilityRecordId}` |

#### Reglas de UI para trazabilidad

- No deberá presentarse como auditoría avanzada.
- No deberá permitir edición o eliminación ordinaria.
- Deberá ayudar a explicar qué ocurrió, quién operó, cuándo y bajo qué contexto institucional.

---

### 12.12 Configuración básica del sitio

La configuración básica del sitio está contemplada en el alcance del MVP, pero su profundidad dependerá de documentos posteriores.

Ruta preliminar:

| Ruta frontend | Pantalla / Vista | Propósito |
|---------------|------------------|-----------|
| `/admin/configuracion` | Configuración básica | Administrar elementos básicos del sitio cuando sean formalizados por backend/API. |

Mientras la API no formalice endpoints específicos de configuración, esta pantalla deberá mantenerse como capacidad diferida o mínima.

---

## 13. Layouts arquitectónicos

### 13.1 Layout público

Responsabilidades:

- encabezado institucional;
- navegación pública clara;
- acceso a búsqueda;
- contenido principal;
- pie institucional;
- enlaces de contexto;
- diseño responsive.

No deberá sobrecargar la navegación con estructura administrativa o técnica.

---

### 13.2 Layout administrativo

Responsabilidades:

- navegación lateral o superior administrativa;
- indicador de usuario autenticado;
- acceso a cierre de sesión;
- áreas principales de gestión;
- mensajes de validación y errores;
- protección visual de acciones críticas.

No deberá exponer capacidades fuera de alcance como roles avanzados, analítica avanzada o automatización de redes sociales.

---

### 13.3 Layout de autenticación

Responsabilidades:

- login administrativo;
- mensajes claros de error;
- redirección controlada;
- no incluir registro público;
- no incluir recuperación automática de contraseña en MVP salvo decisión futura.

---

## 14. Arquitectura lógica de carpetas

La estructura final de carpetas se definirá en implementación, pero se recomienda una organización por superficies y capacidades, no por tipo técnico exclusivamente.

Estructura conceptual sugerida:

```text
src/
  app/
  routes/
  layouts/
  features/
    public/
    admin/
    auth/
    contents/
    publications/
    campaigns/
    diseases/
    media-resources/
    timeline-events/
    sources/
    validations/
    distribution/
    traceability/
  shared/
    components/
    hooks/
    api/
    validation/
    utils/
    types/
```

Esta estructura es orientativa. No autoriza implementación todavía.

---

## 15. Estrategia de integración con API

### 15.1 Cliente HTTP

La implementación posterior deberá centralizar Axios para:

- base URL;
- headers comunes;
- manejo de errores;
- envío de access token si aplica;
- comportamiento frente a `401`;
- solicitudes públicas y administrativas.

---

### 15.2 TanStack Query

TanStack Query deberá utilizarse para:

- consultas públicas;
- listados administrativos;
- detalles administrativos;
- invalidación después de mutaciones;
- estados de carga;
- estados de error;
- cache controlado.

No deberá reemplazar reglas de dominio.

---

### 15.3 Mutaciones administrativas

Las mutaciones administrativas deberán:

- usar confirmación en acciones críticas;
- invalidar consultas relacionadas;
- mostrar resultado operativo claro;
- distinguir errores de validación, autenticación, autorización y conflicto de negocio;
- evitar optimismo agresivo en acciones institucionalmente críticas como publicar, retirar o archivar.

---

## 16. Formularios y validación

### 16.1 React Hook Form

Se utilizará para formularios administrativos, especialmente:

- Content;
- Publication;
- Source;
- Validation;
- Campaign;
- Disease;
- MediaResource;
- TimelineEvent;
- Distribution preparation.

---

### 16.2 Zod

Zod deberá usarse para validación del lado cliente.

Los schemas frontend son mecanismos de ayuda operativa. No son reglas de dominio definitivas ni sustituyen validación backend.

---

### 16.3 Tiptap Editor

Tiptap se usará para edición de cuerpo editorial cuando corresponda.

Criterios:

- debe favorecer contenido claro;
- debe evitar formato excesivo;
- debe permitir sanitización posterior del backend;
- no debe permitir scripts ni HTML inseguro;
- no debe sustituir criterios editoriales institucionales.

---

## 17. Estado y navegación

### 17.1 Estado global

El estado global deberá mantenerse mínimo.

Candidatos aceptables:

- sesión de usuario;
- preferencia de interfaz no sensible;
- estado de navegación administrativa;
- mensajes globales.

No deberá duplicarse server state globalmente si ya es gestionado por TanStack Query.

---

### 17.2 Guards de rutas

Las rutas administrativas deberán estar protegidas por un guard conceptual.

Comportamiento esperado:

- usuario no autenticado accede a `/admin/*`;
- frontend verifica sesión;
- si no hay sesión válida, redirige a `/admin/login`;
- si hay sesión válida, permite navegación administrativa.

---

## 18. Manejo de errores

### 18.1 Portal Público

Errores públicos deberán ser claros y no técnicos.

Ejemplos:

- contenido no encontrado;
- publicación no disponible;
- error temporal al consultar información;
- búsqueda sin resultados.

No deberá exponerse stack trace, IDs internos innecesarios ni errores de infraestructura.

---

### 18.2 Panel Administrativo

Errores administrativos deberán diferenciar:

- error de validación de formulario;
- error de autenticación;
- sesión expirada;
- acción no permitida;
- conflicto con regla de negocio;
- error técnico inesperado.

Las acciones críticas deberán explicar consecuencias operativas, especialmente publicar, retirar y archivar.

---

## 19. Accesibilidad y claridad

El frontend deberá considerar accesibilidad básica desde el MVP:

- navegación por teclado en componentes principales;
- contraste suficiente;
- textos alternativos en imágenes relevantes;
- etiquetas claras en formularios;
- jerarquía semántica de encabezados;
- mensajes de error comprensibles;
- lenguaje claro para población general;
- evitar depender solo de color para comunicar estados.

La accesibilidad avanzada puede evolucionar, pero la estructura inicial no deberá impedirla.

---

## 20. Responsive design

El Portal Público deberá ser mobile-first o, al menos, plenamente responsive.

Prioridades:

1. lectura clara de publicaciones;
2. navegación sencilla;
3. búsqueda accesible;
4. consulta de campañas y enfermedades;
5. línea del tiempo usable en móvil;
6. recursos visuales adaptados.

El Panel Administrativo también deberá funcionar en escritorio y tablet. La edición compleja desde móvil puede considerarse secundaria para MVP, pero no debe romperse la navegación básica.

---

## 21. SEO básico

Las rutas públicas deberán permitir:

- título de página claro;
- descripción básica;
- slug legible;
- estructura semántica de contenido;
- metadatos para publicaciones;
- metadatos para campañas y enfermedades cuando aplique;
- páginas no encontradas adecuadas.

SEO avanzado, sitemap automatizado, Open Graph avanzado y SSR/SSG quedan como decisiones posteriores si el frontend seleccionado lo requiere.

---

## 22. Seguridad frontend

El frontend deberá asumir que:

- toda validación cliente puede ser omitida por un atacante;
- la API es autoridad de autorización y reglas;
- el refresh token no debe exponerse a JavaScript;
- los errores no deben revelar información sensible;
- el contenido enriquecido debe tratarse como potencialmente riesgoso si no está sanitizado;
- las acciones críticas requieren confirmación;
- no debe guardarse información sensible innecesaria en localStorage.

---

## 23. Relación entre rutas frontend y API

La relación entre frontend y API no deberá ser uno a uno obligatoria.

Una pantalla puede consumir varios endpoints.

Un endpoint puede alimentar varias pantallas.

Lo importante es conservar la orientación por capacidades:

```text
Consulta pública
Gestión editorial
Publicación institucional
Distribución
Memoria institucional
Trazabilidad
Autenticación
```

---

## 24. Anti-patrones de Frontend

Quedan explícitamente prohibidos o desaconsejados:

- generar pantallas CRUD automáticas por cada modelo Prisma;
- exponer modelos puente como pantallas principales sin sentido operativo;
- tratar Publication como checkbox `published`;
- tratar Campaign o Disease como simples categorías;
- confundir Source con CommunicationChannel;
- permitir registro público de usuarios en MVP;
- construir chatbot o búsqueda semántica en esta fase;
- introducir roles avanzados sin documento posterior;
- publicar desde frontend sin validación backend;
- usar localStorage para refresh token;
- mostrar estados técnicos internos al público;
- convertir la Línea del Tiempo en agenda general;
- convertir el gestor multimedia en DAM avanzado.

---

## 25. Riesgos identificados

| Riesgo | Descripción | Mitigación |
|--------|-------------|------------|
| CRUD por persistencia | El frontend podría replicar modelos Prisma como pantallas. | Organizar rutas por capacidades y casos de uso. |
| Sobrecarga administrativa | El panel puede volverse complejo para el MVP. | Priorizar flujos mínimos y evitar roles/workflow avanzados. |
| Ambigüedad Content/Publication | La UI puede confundir crear contenido con publicar. | Separar visualmente edición editorial y exposición pública. |
| Línea del Tiempo dependiente de Content | La UI podría forzar eventos a depender de publicaciones. | Modelar pantalla de eventos con multimedia propio y relación opcional a Content. |
| Exposición de estados técnicos | El portal público puede mostrar información interna. | Diseñar responses públicas y vistas públicas con lenguaje ciudadano. |
| Seguridad de sesión | Manejo incorrecto de tokens. | Seguir `authentication.md`: refresh token HttpOnly y rutas protegidas. |
| Formularios insuficientes | Validación cliente débil puede aumentar errores. | Usar React Hook Form + Zod como ayuda, manteniendo backend como autoridad. |

---

## 26. Decisiones diferidas

Las siguientes decisiones quedan para documentos o fases posteriores:

- diseño visual final;
- sistema de diseño detallado;
- estructura definitiva de componentes;
- tema Material UI;
- estrategia exacta de SEO según renderizado final;
- pruebas unitarias y E2E;
- gestión avanzada de configuración del sitio;
- publicación automática en redes sociales;
- roles y permisos avanzados;
- recuperación de contraseña;
- separación física entre portal público y admin;
- SSR/SSG si el proyecto lo requiere;
- analítica de uso;
- chatbot o IA.

---

## 27. Checklist de aceptación arquitectónica

Para pasar este documento a Baseline, deberá cumplirse:

- [x] El frontend se organiza por superficies: público, admin y auth.
- [x] El mapa de rutas no contradice `api.md`.
- [x] El panel administrativo no introduce roles avanzados.
- [x] No existe registro público ni bootstrap frontend.
- [x] Content y Publication se mantienen separados.
- [x] Campaign y Disease no se reducen a categorías.
- [x] Source y Validation no se reducen a campos simples.
- [x] TimelineEvent conserva multimedia propio mediante decisión `TimelineEventMediaResource`.
- [x] Portal Público prioriza claridad, consulta y responsive.
- [x] El frontend no filtra Prisma ni modelos puente como contrato visual.
- [x] La autenticación respeta `authentication.md`.
- [x] No se introduce IA, chatbot ni búsqueda semántica.

---

## 28. Dictamen arquitectónico final

El frontend del MVP deberá iniciar como una aplicación React con TypeScript, Vite y Material UI, organizada por superficies y capacidades del dominio.

El mapa preliminar de rutas es suficiente para orientar diseño posterior sin generar implementación y queda alineado con `docs/05-api/api.md` y `docs/05-api/authentication.md`.

La prioridad de Phase 06 no debe ser crear componentes todavía, sino preservar la arquitectura frontend, navegación, integración con API, criterios de estado, formularios, autenticación, responsive, accesibilidad y límites de alcance.

Dictamen final:

```text
docs/06-frontend/frontend.md ✅ Baseline
```
