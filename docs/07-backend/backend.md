# Especificación Arquitectónica de Backend

| Campo | Valor |
|-------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Especificación Arquitectónica de Backend |
| Código | DOC-016 |
| Versión | 1.0.0 |
| Estado | Baseline |
| Fase | Phase 07 — Backend |
| Documento anterior | `docs/06-frontend/frontend.md` |
| Documento posterior recomendado | `docs/07-backend/implementation-plan.md` |
| Referencias técnicas secundarias | `docs/05-api/api.md`, `docs/05-api/authentication.md`, `docs/06-frontend/frontend.md`, `prisma/schema.prisma` |
| Rol arquitectónico | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect & Backend Architect |
| Fecha | 2026-07-08 |

---

## 1. Propósito

Este documento define la **especificación arquitectónica inicial del Backend** para la Plataforma de Gestión, Comunicación y Educación para la Salud de la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su propósito es establecer cómo el backend deberá materializar las capacidades del dominio, la API aprobada, la autenticación y la persistencia sin convertir Prisma, NestJS, controladores, DTOs o rutas HTTP en fuente de verdad del negocio.

El backend deberá proteger la capacidad central del producto:

> **Publicar información confiable.**

El backend no es únicamente una colección de controladores REST. Es la capa de aplicación e infraestructura que coordina el ciclo de vida mínimo del Conocimiento Institucional: creación, preparación, validación, publicación, distribución, consulta, actualización, retiro, archivado, multimedia y trazabilidad.

---

## 2. Alcance del documento

Este documento sí define:

- principios de arquitectura backend;
- relación entre dominio, aplicación, infraestructura y presentación API;
- mapa preliminar de módulos backend;
- responsabilidades conceptuales por módulo;
- límites entre módulos;
- criterios de integración con API, autenticación, Prisma y frontend;
- estrategia de uso de Prisma como infraestructura secundaria;
- criterios para validación, errores, transacciones, trazabilidad y seguridad;
- anti-patrones backend;
- riesgos arquitectónicos del MVP;
- checklist de aceptación para Phase 07.

---

## 3. Fuera de alcance

Este documento no genera ni define implementación.

Queda fuera de alcance:

- código NestJS;
- controladores concretos;
- servicios implementados;
- repositorios implementados;
- DTOs reales;
- entidades TypeScript definitivas;
- decorators;
- guards concretos;
- interceptors concretos;
- pipes concretos;
- migraciones Prisma;
- seeders;
- SQL;
- pruebas automatizadas implementadas;
- integración real con redes sociales;
- almacenamiento físico definitivo;
- despliegue;
- observabilidad productiva;
- IA, embeddings, pgvector, búsqueda semántica o chatbot;
- roles avanzados, permisos complejos o workflow editorial multinivel.

---

## 4. Relación con la baseline oficial

Este documento deriva de la baseline aprobada:

| Fuente | Relación con Backend |
|--------|----------------------|
| Foundation | Define que el desarrollo debe seguir documentación validada y evitar código prematuro. |
| Product | Define la capacidad central: publicar información confiable. |
| Domain | Define el ciclo de vida del Conocimiento Institucional y las reglas de negocio. |
| Architecture | Define Clean Architecture, Modular Monolith, DDD Lite y separación de capas. |
| Database | Define persistencia subordinada al dominio y Prisma como mecanismo técnico. |
| API | Define el contrato REST preliminar, separado en superficie pública, administrativa y autenticación. |
| Authentication | Define acceso administrativo protegido, JWT, refresh token y primer usuario fuera de API pública. |
| Frontend | Define rutas/pantallas y consumo esperado de la API sin convertir UI en fuente del dominio. |

El backend no deberá reinterpretar estas decisiones. Si una necesidad técnica contradice la baseline, debe registrarse como observación arquitectónica antes de implementarse.

---

## 5. Principios de arquitectura backend

### BE-PRIN-001. Dominio antes que framework

NestJS es el framework aprobado para implementación, pero no gobierna el dominio. La estructura backend debe responder a capacidades del dominio y casos de uso, no a la comodidad de generar controladores CRUD.

### BE-PRIN-002. API no equivale a controlador

Los endpoints aprobados en `api.md` representan contrato de aplicación. No obligan a crear un controlador por tabla ni un servicio por modelo Prisma.

### BE-PRIN-003. Prisma es infraestructura

Prisma deberá tratarse como mecanismo de persistencia. No deberá contener reglas de negocio ni ser expuesto como contrato de API.

### BE-PRIN-004. Modular Monolith por capacidades

El backend deberá iniciar como monolito modular. Los módulos se separan por capacidad del dominio y responsabilidad técnica transversal, no por microservicios ni por tablas.

### BE-PRIN-005. Trazabilidad como responsabilidad transversal

Las operaciones relevantes sobre Content, Publication, Source, Validation, Campaign, Disease, MediaResource, TimelineEvent, Distribution y Authentication deberán producir o habilitar trazabilidad institucional mínima cuando corresponda.

### BE-PRIN-006. Seguridad básica sin sobreingeniería

El MVP protegerá `/api/v1/admin/*` mediante autenticación. No se introducirán roles avanzados, permisos complejos ni autorización granular si no forman parte del alcance aprobado.

### BE-PRIN-007. Separación entre autoría operativa y responsabilidad institucional

El usuario autenticado representa autoría operativa. La responsabilidad institucional pertenece a la Jurisdicción Sanitaria y no debe confundirse con el operador que captura, edita o publica.

### BE-PRIN-008. Implementación diferida

Este documento prepara implementación backend, pero no la inicia. La generación de código deberá ocurrir solo después de aprobar la arquitectura backend.

---

## 6. Estilo arquitectónico backend

El backend deberá seguir una variante práctica de Clean Architecture adaptada a un monolito modular NestJS.

```text
API / Presentation Layer
        ↓
Application Layer
        ↓
Domain Layer
        ↓
Infrastructure Layer
```

### 6.1 Presentation Layer

Responsable de recibir solicitudes HTTP, aplicar validación de entrada, autenticación, transformación de respuesta y manejo de errores HTTP.

No deberá contener reglas de negocio.

### 6.2 Application Layer

Responsable de coordinar casos de uso, transacciones, reglas de aplicación, acceso a puertos, emisión de trazabilidad y orquestación entre módulos.

Es el punto principal para materializar el contrato definido en `api.md`.

### 6.3 Domain Layer

Responsable de reglas de negocio, invariantes, conceptos y comportamiento institucional. El dominio no conoce NestJS, Prisma, HTTP ni detalles de persistencia.

### 6.4 Infrastructure Layer

Responsable de Prisma, almacenamiento de archivos, proveedores externos, hashing, JWT, correo futuro, logs técnicos y adaptadores.

---

## 7. Mapa preliminar de módulos backend

El siguiente mapa es un contrato arquitectónico preliminar. No representa todavía carpetas obligatorias, clases, nombres definitivos de módulos NestJS ni código.

| Módulo backend preliminar | Naturaleza | Responsabilidad principal | API relacionada | Prisma relacionado |
|---------------------------|------------|---------------------------|-----------------|--------------------|
| Auth | Transversal técnica | Autenticación, refresh token, sesión administrativa, usuario actual. | `/api/v1/auth/*` | `User` |
| Content | Dominio / aplicación | Crear, editar, preparar, clasificar y gestionar piezas editoriales institucionales. | `/api/v1/admin/contents/*`, `/api/v1/public/publications/*` indirecto | `Content`, `ContentType`, `Category`, `Tag` |
| Publication | Dominio / aplicación | Exposición pública, retiro, archivado, vigencia, publicaciones destacadas. | `/api/v1/admin/publications/*`, `/api/v1/public/publications/*` | `Publication` |
| Source | Dominio / aplicación | Gestión de fuentes internas, externas, documentales, históricas o propias. | `/api/v1/admin/sources/*` | `Source`, `ContentSource` |
| Validation | Dominio / aplicación | Registrar validaciones según origen, vigencia, autenticidad, pertinencia o validación completa. | `/api/v1/admin/validations/*` | `Validation`, `ContentValidation` |
| Campaign | Dominio / aplicación | Gestionar campañas como entidades organizadoras, no como Content. | `/api/v1/admin/campaigns/*`, `/api/v1/public/campaigns/*` | `Campaign`, `ContentCampaign`, `CampaignDisease` |
| Disease | Dominio / aplicación | Gestionar enfermedades como conceptos temáticos de salud pública. | `/api/v1/admin/diseases/*`, `/api/v1/public/diseases/*` | `Disease`, `ContentDisease`, `CampaignDisease` |
| Media | Dominio de soporte / aplicación | Coordinar reglas sobre recursos multimedia reutilizables y asociaciones con Content o TimelineEvent. El almacenamiento físico pertenece a Storage Provider. | `/api/v1/admin/media-resources/*`, subrecursos `/media-resources` | `MediaResource`, `ContentMediaResource`, `TimelineEventMediaResource` |
| Timeline | Dominio / aplicación | Gestionar Línea del Tiempo como memoria institucional independiente de Content. | `/api/v1/admin/timeline-events/*`, `/api/v1/public/timeline-events/*` | `TimelineEvent`, `TimelineEventContent`, `TimelineEventMediaResource` |
| Channel / Distribution | Dominio / aplicación | Preparar distribución por canales sin convertir canales en fuente de verdad. | `/api/v1/admin/channels/*`, `/distribution-channels`, `/distribution-records` | `CommunicationChannel`, `PublicationChannel` |
| Traceability | Transversal institucional | Registrar y consultar eventos de trazabilidad institucional mínima. | `/api/v1/admin/traceability-records/*` | `TraceabilityRecord` |
| Taxonomy | Dominio de soporte | Gestionar tipos, categorías y etiquetas para navegación, búsqueda y clasificación. | `/api/v1/public/classification/*`, endpoints admin relacionados | `ContentType`, `Category`, `Tag`, `ContentCategory`, `ContentTag` |
| Public Query | Aplicación / lectura pública | Optimizar consultas públicas sin exponer estructura administrativa interna. No es módulo de dominio, agregado ni bounded context propio. | `/api/v1/public/*` | Varios modelos de lectura |
| Storage | Infraestructura | Abstraer almacenamiento local inicial y evolución futura a S3/Azure/GCP. | Usado por Media | No necesariamente Prisma directo |
| Health / Operations | Técnica fuera del dominio | Endpoint técnico mínimo de salud del servicio si se requiere para despliegue. Observabilidad productiva queda diferida. | Endpoint técnico futuro, si se aprueba | No aplica |

---

## 8. Agrupación recomendada para MVP

Para evitar fragmentación prematura, los módulos pueden agruparse inicialmente en paquetes de capacidad más amplios durante implementación, siempre que sus límites internos estén claros.

| Agrupación MVP | Incluye | Justificación |
|----------------|---------|---------------|
| Identity & Access | Auth, User operativo | Protege administración inicial y trazabilidad operativa. |
| Knowledge Management | Content, Source, Validation, Taxonomy | Coordina preparación editorial y respaldo institucional. |
| Publishing | Publication, Distribution, Channel | Materializa exposición pública y preparación por canales. |
| Institutional Organization | Campaign, Disease | Mantiene agrupadores institucionales separados de Content. |
| Media & Timeline | Media, Timeline | Preserva recursos y memoria institucional, incluyendo multimedia propio de eventos. |
| Traceability | Traceability transversal | Registra eventos relevantes sin convertirlo en auditoría avanzada. |
| Public Access | Public Query | Sirve consulta pública clara, buscable y optimizada para ciudadanía. |

Esta agrupación no elimina los módulos conceptuales. Solo evita crear demasiada estructura técnica prematura en el MVP.

---

## 9. Relación Backend - API

El backend deberá implementar el contrato API aprobado sin filtrar modelos Prisma.

### 9.1 Superficie pública

Los endpoints públicos deberán:

- no requerir autenticación;
- exponer únicamente información publicada, vigente o históricamente contextualizada;
- privilegiar claridad de consulta;
- ocultar detalles internos de validación, edición o trazabilidad salvo que sean necesarios para confianza pública;
- no exponer identificadores técnicos si existe slug público;
- evitar respuestas que puedan interpretarse como diagnóstico o atención clínica individual.

### 9.2 Superficie administrativa

Los endpoints administrativos deberán:

- requerir autenticación;
- identificar al operador autenticado;
- aplicar validación de entrada;
- coordinar reglas de negocio;
- producir trazabilidad cuando corresponda;
- distinguir actualización operativa de retiro, archivado y publicación institucional.

### 9.3 Superficie de autenticación

Los endpoints de autenticación deberán respetar `authentication.md`:

```text
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

No deberá existir registro público ni endpoint público para crear el primer usuario administrativo.

---

## 10. Relación Backend - Prisma

Prisma deberá utilizarse como mecanismo técnico de acceso a persistencia.

Reglas:

- No exponer modelos Prisma directamente como respuestas de API.
- No diseñar módulos backend únicamente como espejo de modelos Prisma.
- No ubicar reglas de negocio en queries Prisma.
- No depender de enums técnicos de Prisma como contrato público estable.
- No ejecutar migraciones hasta que la fase de implementación lo autorice.
- No convertir soft delete en sustituto de retiro o archivado institucional.
- No tratar `TraceabilityRecord` como tabla CRUD ordinaria.
- No interpretar `DELETE` administrativo como retiro o archivado institucional.

Regla explícita sobre eliminación operativa:

```text
Si la API usa DELETE para recursos administrativos, deberá interpretarse como baja,
desactivación operativa o eliminación lógica cuando aplique.
Retiro y archivado institucional deben ejecutarse mediante casos de uso explícitos,
por ejemplo withdrawal o archive.
```

---

## 11. Reglas de diseño por módulo

### 11.1 Auth Module

Responsabilidades:

- autenticar operador administrativo;
- emitir access token;
- manejar refresh token mediante cookie HttpOnly;
- invalidar sesión al logout;
- exponer usuario actual;
- proteger rutas administrativas.

Límites:

- no crear usuarios desde API pública;
- no exponer endpoint público ni administrativo de bootstrap para crear el primer usuario en el MVP;
- resolver la creación inicial del usuario administrativo mediante mecanismo técnico controlado fuera de la API pública;
- no implementar roles avanzados en MVP;
- no convertir autenticación en autorización editorial compleja.

---

### 11.2 Content Module

Responsabilidades:

- crear y editar Content;
- gestionar estado editorial interno;
- asociar ContentType, categorías y etiquetas;
- asociar fuentes, validaciones, campañas, enfermedades y recursos;
- preparar información para publicación;
- evitar duplicación conceptual innecesaria.

Límites:

- no publicar directamente por existencia de Content;
- no convertir tipo editorial en tabla principal separada;
- no mezclar Content con Campaign, Disease o Publication.

---

### 11.3 Publication Module

Responsabilidades:

- crear exposición pública a partir de Content preparado;
- gestionar slug público, estado público, vigencia y destacado;
- retirar publicación de consulta pública;
- archivar publicación;
- distinguir actualización técnica de actualización pública;
- servir consulta pública mediante vistas conceptuales.

Límites:

- no reducir publicación a booleano;
- no eliminar memoria institucional al retirar;
- no publicar información sin respaldo suficiente.

---

### 11.4 Source Module

Responsabilidades:

- registrar origen o respaldo del conocimiento;
- distinguir fuente externa oficial, interna, documental, histórica o generada por la Jurisdicción;
- asociar fuentes con Content;
- apoyar validación según origen.

Límites:

- no convertir Source en Content;
- no convertir canales de comunicación en Source;
- no forzar fuente externa cuando el conocimiento es propio de la Jurisdicción.

---

### 11.5 Validation Module

Responsabilidades:

- registrar validaciones de autenticidad, vigencia, pertinencia o validación institucional completa;
- asociar validaciones con Content;
- relacionar opcionalmente Validation con Source;
- preservar operador y fecha de validación;
- apoyar decisiones de publicación.

Límites:

- no convertir validación en booleano;
- no implementar workflow multinivel en MVP;
- no confundir validación institucional con autenticación técnica.

---

### 11.6 Campaign Module

Responsabilidades:

- gestionar campañas como iniciativas institucionales agrupadoras;
- asociar Campaign con Content;
- asociar Campaign con Disease;
- diferenciar campaña vigente e histórica;
- servir consulta pública de campañas y publicaciones relacionadas.

Límites:

- Campaign no es Content;
- Campaign no es categoría ni etiqueta;
- finalizar campaña no retira automáticamente sus publicaciones.

---

### 11.7 Disease Module

Responsabilidades:

- gestionar enfermedades como conceptos temáticos de salud pública;
- asociar Disease con Content;
- asociar Disease con Campaign;
- servir consulta pública orientada a prevención y educación.

Límites:

- Disease no es diagnóstico;
- Disease no es expediente clínico;
- Disease no es una publicación simple.

---

### 11.8 Media Module

Responsabilidades:

- gestionar imágenes, infografías, PDFs, documentos, enlaces externos y videos por enlace;
- asociar recursos a Content;
- asociar recursos directamente a TimelineEvent;
- evitar duplicación de archivos;
- coordinar reglas de negocio sobre recursos multimedia;
- delegar almacenamiento físico al Storage Provider.

Límites:

- no implementar DAM avanzado en MVP;
- no acceder directamente al filesystem desde módulos de dominio o aplicación;
- no mezclar reglas de negocio multimedia con detalles de filesystem, S3, Azure Blob o Google Cloud Storage;
- no acoplar almacenamiento local como decisión permanente.

---

### 11.9 Timeline Module

Responsabilidades:

- gestionar eventos históricos institucionales;
- preservar memoria institucional;
- asociar multimedia propio mediante `TimelineEventMediaResource`;
- asociar Content opcionalmente mediante `TimelineEventContent` solo cuando aporte contexto;
- servir línea del tiempo pública.

Límites:

- la Línea del Tiempo no es agenda operativa;
- no es bitácora administrativa;
- no depende obligatoriamente de Content general;
- no debe convertirse en catálogo de actividades cotidianas.

---

### 11.10 Channel / Distribution Module

Responsabilidades:

- gestionar canales de comunicación;
- preparar textos o registros de distribución;
- asociar publicaciones con canales;
- registrar estado de distribución manual;
- conservar que el portal institucional es fuente autoritativa.

Límites:

- no implementar integración automática con redes sociales en MVP;
- no crear tablas o módulos por cada red social;
- no convertir Facebook, Instagram, X, TikTok, YouTube o WhatsApp en fuentes de verdad.

---

### 11.11 Traceability Module

Responsabilidades:

- registrar eventos institucionales relevantes;
- responder qué ocurrió, sobre qué entidad, quién operó, cuándo y bajo qué contexto;
- permitir consulta administrativa de trazabilidad;
- apoyar confianza institucional.

Límites:

- no es auditoría avanzada;
- no es versionado campo por campo;
- no debe tener soft delete conceptual;
- no debe exponerse como CRUD ordinario.

---

### 11.12 Taxonomy Module

Responsabilidades:

- gestionar tipos de contenido, categorías y etiquetas;
- sostener navegación pública, búsqueda básica y clasificación editorial;
- apoyar la organización de Content sin fragmentarlo en modelos separados por tipo editorial.

Límites:

- no convertir categorías o etiquetas en sustitutos de Campaign o Disease;
- no usar taxonomía para representar fuentes, validaciones o responsabilidad institucional;
- no introducir jerarquías complejas fuera del MVP.

---

### 11.13 Public Query Module

Responsabilidades:

- componer lecturas públicas optimizadas para el Portal Público;
- consumir capacidades de Publication, Campaign, Disease, Timeline, Taxonomy y Media sin exponer estructura administrativa;
- preparar respuestas públicas claras, paginadas y seguras;
- separar información vigente, retirada, archivada o históricamente contextualizada cuando aplique.

Naturaleza:

- Public Query es una capa de aplicación/lectura pública;
- no es concepto del dominio;
- no es agregado;
- no es entidad;
- no es bounded context propio.

Límites:

- no crear reglas de negocio nuevas;
- no consultar Prisma como atajo que contradiga capacidades de dominio;
- no exponer campos internos, estados técnicos o relaciones puente como contrato público.

---

### 11.14 Storage Provider

Responsabilidades:

- abstraer almacenamiento físico de archivos;
- permitir almacenamiento local inicial sin acoplar el dominio;
- preparar evolución futura hacia S3, Azure Blob Storage o Google Cloud Storage;
- entregar a Media Module operaciones de guardado, lectura, eliminación operativa y obtención de URL o referencia.

Límites:

- no contener reglas editoriales;
- no decidir si un recurso puede asociarse a Content o TimelineEvent;
- no sustituir validación de recursos multimedia;
- no filtrar detalles de proveedor hacia dominio o API.

---

### 11.15 Health / Operations

Responsabilidades:

- exponer, si se requiere, un endpoint técnico mínimo de salud del servicio;
- apoyar despliegue y verificación operativa básica;
- preparar integración futura con observabilidad sin adelantar DevOps.

Límites:

- no forma parte del dominio;
- no representa capacidad de negocio;
- no debe ampliar el MVP hacia observabilidad productiva;
- no debe introducir métricas, tracing o monitoreo avanzado antes de Phase 09 — DevOps.

---

## 12. Validación de entrada y contratos internos

El backend deberá validar entradas en la frontera de aplicación.

Criterios:

- validar tipos, formatos, campos requeridos y límites razonables;
- sanitizar entradas textuales que puedan renderizarse en frontend;
- diferenciar errores de validación técnica de errores de regla de negocio;
- mantener mensajes adecuados para frontend sin filtrar detalles internos;
- evitar `any` como contrato interno en TypeScript;
- no tratar DTOs como entidades de dominio.

Este documento no define DTOs reales. Los DTOs deberán derivarse posteriormente de casos de uso, API y reglas de validación.

---

## 13. Manejo de errores

El backend deberá distinguir al menos estos grupos conceptuales:

| Tipo de error | Significado | Ejemplo |
|---------------|-------------|---------|
| Validación de entrada | La solicitud no cumple formato o estructura esperada. | Campo requerido ausente. |
| Regla de negocio | La acción contradice una regla del dominio. | Intentar publicar información sin respaldo suficiente. |
| Autenticación | El operador no está autenticado. | Token ausente o inválido. |
| Autorización MVP | La operación requiere acceso administrativo. | Usuario no autorizado para `/admin`. |
| Recurso no encontrado | La entidad solicitada no existe o no está disponible para ese contexto. | Publicación retirada consultada públicamente. |
| Conflicto | La operación colisiona con estado actual. | Slug público duplicado. |
| Infraestructura | Fallo técnico no atribuible al usuario. | Error de almacenamiento o base de datos. |

Los errores públicos no deben revelar detalles internos de persistencia, seguridad o infraestructura.

---

## 14. Transacciones y consistencia

El backend deberá usar transacciones cuando una operación modifique varias entidades que representan una misma acción institucional.

Casos candidatos:

- crear Content con relaciones iniciales;
- publicar Content como Publication y registrar trazabilidad;
- retirar o archivar Publication y registrar trazabilidad;
- asociar recursos multimedia reemplazando conjunto completo;
- preparar canales de distribución;
- crear TimelineEvent con multimedia propio;
- registrar validación y asociarla a Content.

La decisión técnica concreta se tomará durante implementación. Este documento solo establece el criterio arquitectónico.

---

## 15. Trazabilidad operativa

El backend deberá generar trazabilidad institucional mínima para acciones relevantes.

Acciones candidatas:

```text
CREATED
UPDATED
VALIDATED
PREPARED
PUBLISHED
DISTRIBUTION_PREPARED
DISTRIBUTED
WITHDRAWN
ARCHIVED
RESTORED
CLASSIFIED
RESOURCE_ATTACHED
```

Estos valores provienen de la especificación Prisma como referencia técnica secundaria. No deben tratarse como contrato público definitivo de API o UI.

---

## 16. Seguridad backend

La seguridad mínima del MVP deberá incluir:

- protección de `/api/v1/admin/*`;
- refresh token en cookie HttpOnly;
- hashing de contraseña con Argon2;
- validación de token JWT;
- sanitización de entradas;
- prevención de exposición de campos sensibles;
- control de CORS acorde al frontend autorizado;
- límites razonables de payload para recursos y formularios;
- paginación en listados;
- manejo uniforme de errores;
- no confiar en datos enviados por cliente.

Fuera del MVP:

- RBAC avanzado;
- ABAC;
- permisos por recurso;
- MFA;
- auditoría avanzada;
- administración de usuarios compleja;
- recuperación de contraseña, salvo decisión posterior.

---

## 17. Estrategia de almacenamiento

El backend deberá abstraer el almacenamiento de recursos multimedia mediante un proveedor.

Criterios:

- el almacenamiento local puede usarse inicialmente;
- los módulos no deberán acceder directamente al filesystem;
- el Media Module deberá depender de una abstracción de almacenamiento;
- la arquitectura debe permitir evolución futura a S3, Azure Blob Storage o Google Cloud Storage;
- los metadatos institucionales del recurso se conservan en persistencia, no en el nombre físico del archivo.

---

## 18. Búsqueda y consulta pública

La búsqueda del MVP será básica.

El backend podrá soportar:

- búsqueda textual básica;
- filtros por tipo, categoría, etiqueta, campaña, enfermedad o fecha;
- paginación;
- ordenamiento controlado;
- consulta de destacados;
- diferenciación entre vigente, retirado, archivado o históricamente contextualizado.

Fuera del MVP:

- búsqueda semántica;
- embeddings;
- pgvector;
- recomendaciones automáticas;
- chatbot;
- ranking personalizado.

---

## 19. Integración con Frontend

El backend deberá proveer respuestas consistentes para:

- Portal Público;
- Panel Administrativo;
- Autenticación;
- Línea del Tiempo pública y administrativa;
- gestión de multimedia propio de eventos;
- preparación de distribución.

Criterios:

- las respuestas públicas deberán ser simples y estables;
- las respuestas administrativas pueden incluir más metadatos operativos;
- el frontend no debe reconstruir reglas de negocio;
- el backend debe centralizar validaciones institucionales;
- las rutas públicas deben privilegiar slugs sobre IDs técnicos cuando corresponda.

---

## 20. Organización lógica sugerida

La siguiente estructura es orientativa. No constituye implementación obligatoria.

```text
src/
  app/
    config/
    bootstrap/
  modules/
    auth/
    content/
    publication/
    source/
    validation/
    campaign/
    disease/
    media/
    timeline/
    channel/
    traceability/
    public-query/
  shared/
    domain/
    application/
    infrastructure/
    presentation/
    errors/
    validation/
    security/
  infrastructure/
    prisma/
    storage/
    hashing/
    tokens/
```

La estructura final deberá definirse en documento posterior o durante implementación controlada.

---

## 21. Testing backend

Este documento no implementa pruebas, pero establece criterios:

| Nivel | Propósito |
|-------|-----------|
| Unit tests | Validar reglas de aplicación y dominio sin infraestructura real. |
| Integration tests | Validar repositorios/adaptadores con persistencia controlada. |
| API tests | Validar contrato HTTP aprobado. |
| Security tests básicos | Validar protección de rutas administrativas y sesiones. |

Prioridades iniciales:

- autenticación;
- publicación, retiro y archivado;
- validación y fuentes;
- multimedia;
- línea del tiempo;
- trazabilidad;
- consulta pública.

---

## 22. Anti-patrones backend prohibidos

No se deberá:

- crear CRUD directo para cada modelo Prisma sin pasar por capacidades del dominio;
- exponer entidades Prisma como respuestas públicas;
- ubicar reglas de negocio en controladores;
- ubicar reglas de negocio en queries Prisma;
- convertir `Publication` en booleano de `Content`;
- convertir `Validation` en booleano;
- convertir `Campaign` o `Disease` en categorías;
- crear módulos o tablas por cada red social;
- introducir IA, pgvector o embeddings en MVP;
- implementar roles avanzados sin documento previo;
- ejecutar migraciones desde esta fase documental;
- mezclar responsabilidad institucional con usuario operativo;
- eliminar trazabilidad al retirar o archivar;
- convertir Timeline en agenda general;
- forzar que TimelineEvent dependa de Content general.

---

## 23. Riesgos arquitectónicos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Backend generado como CRUD de Prisma | Filtra persistencia y rompe dominio. | Diseñar módulos por capacidades y casos de uso. |
| Reglas en controladores | Baja mantenibilidad y duplicación. | Mantener controladores delgados y lógica en aplicación/dominio. |
| Sobremodularización prematura | Complejidad innecesaria en MVP. | Agrupar módulos cuando sea razonable sin perder límites conceptuales. |
| Auth convertido en RBAC avanzado | Expansión de alcance. | Mantener acceso administrativo simple. |
| Distribución acoplada a redes sociales | Dependencia externa y pérdida de desacoplamiento. | Modelar canales como mecanismos de distribución. |
| Timeline dependiente de Content | Pérdida de independencia de memoria institucional. | Mantener multimedia propio y relación opcional con Content. |
| Prisma como contrato público | API frágil y acoplada a schema. | Mapear respuestas desde casos de uso. |

---

## 24. Decisiones diferidas

Quedan diferidas para documentos posteriores o implementación controlada:

- estructura final de carpetas NestJS;
- DTOs concretos;
- entidades de dominio TypeScript;
- interfaces de repositorio;
- estrategia exacta de transacciones Prisma;
- política de paginación exacta;
- formato definitivo de errores;
- estrategia de logging;
- observabilidad;
- health checks;
- pruebas automatizadas concretas;
- storage provider concreto para producción;
- documentación Swagger/OpenAPI implementada.

Decisión ya cerrada desde Authentication Baseline:

```text
El backend no deberá exponer endpoint público ni administrativo de bootstrap
para crear el primer usuario en el MVP.
La creación inicial se resolverá por mecanismo técnico controlado fuera de la API pública.
```

---

## 25. Checklist de aceptación del documento

- [x] El backend se diseña por capacidades del dominio, no por tablas.
- [x] El mapa preliminar de módulos está documentado.
- [x] La API baseline se respeta sin reinterpretarla.
- [x] Authentication baseline se respeta sin registro público.
- [x] Frontend baseline se considera como consumidor, no como fuente de reglas.
- [x] Prisma se mantiene como infraestructura.
- [x] No se genera implementación NestJS.
- [x] No se generan DTOs, servicios, repositorios ni controladores.
- [x] No se autorizan migraciones.
- [x] TimelineEvent mantiene multimedia propio independiente de Content.
- [x] IA, embeddings, pgvector y chatbot permanecen fuera del MVP.

---

## 26. Dictamen de Phase 07 — Backend

Este documento establece la arquitectura backend inicial y el mapa preliminar de módulos para preparar la implementación futura sin iniciar código.

Estado actual:

```text
docs/07-backend/backend.md   ✅ Baseline
```

Siguiente paso recomendado:

```text
Preparar docs/07-backend/implementation-plan.md antes de iniciar código backend.
```
