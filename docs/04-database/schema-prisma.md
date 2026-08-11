# Especificación del Prisma Schema

| Campo | Valor |
|-------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Especificación del Prisma Schema |
| Código | DOC-012 |
| Versión | 1.0.0 |
| Estado | Baseline |
| Fase | Phase 04 — Database |
| Documento anterior | `docs/04-database/erd.md` |
| Documento siguiente | `docs/05-api/api.md` |
| Rol arquitectónico | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect & Database Architect |
| Fecha | 2026-07-08 |

---

## 1. Propósito

Este documento traduce el modelo entidad-relación aprobado en `docs/04-database/erd.md` hacia una **especificación Prisma revisable**.

Su propósito es definir modelos Prisma, relaciones, campos tentativos, enums técnicos, atributos de mapeo, índices tentativos y restricciones técnicas razonables para preparar el archivo futuro `schema.prisma`.

Este documento **no ejecuta implementación**. La especificación aquí incluida es una propuesta documental que deberá revisarse antes de crear migraciones o iniciar backend.

```text
Database Strategy
↓
ERD
↓
Schema Prisma Specification
↓
API
↓
Backend Implementation
```

---

## 2. Relación con la Baseline Oficial

Este documento deriva de:

- `docs/04-database/database.md`, que define la estrategia de persistencia del dominio;
- `docs/04-database/erd.md`, que define el modelo entidad-relación físico revisable;
- `docs/03-architecture/architecture.md`, que protege Clean Architecture, Modular Monolith y la independencia del dominio;
- `docs/02-domain/*`, que define lenguaje ubicuo, dominio, reglas de negocio y casos de uso.

La especificación Prisma no puede reinterpretar el dominio. Prisma es un mecanismo técnico de mapeo y persistencia, no la fuente de verdad del modelo de negocio.

---

## 3. Alcance

Este documento sí define:

- modelos Prisma propuestos;
- enums técnicos propuestos;
- relaciones Prisma;
- campos tentativos;
- atributos Prisma como `@id`, `@default`, `@updatedAt`, `@relation`, `@@map`, `@@index` y `@@unique`;
- estrategia técnica inicial de soft delete;
- criterios para revisar el futuro `schema.prisma`;
- límites entre Prisma, dominio, API y backend.

---

## 4. Fuera de Alcance

Este documento no genera ni autoriza:

- migraciones ejecutadas;
- SQL manual;
- seeders;
- repositorios NestJS;
- servicios;
- casos de uso implementados;
- DTOs;
- controllers;
- endpoints;
- frontend;
- backend;
- integración automática con redes sociales;
- IA;
- embeddings;
- pgvector;
- búsqueda semántica;
- chatbot;
- auditoría avanzada;
- versionado editorial avanzado;
- roles avanzados;
- permisos complejos.

---

## 5. Principios de Traducción ERD → Prisma

### SP-PRISMA-001. Prisma no gobierna el dominio

Los modelos Prisma traducen decisiones ya aprobadas; no crean nuevos conceptos de negocio.

### SP-PRISMA-002. Los nombres técnicos deben preservar trazabilidad semántica

Cada modelo Prisma deberá poder explicarse desde el ERD, el dominio y `database.md`.

### SP-PRISMA-003. `@@map` preserva la separación entre nombre de modelo y tabla

Los modelos Prisma usarán `PascalCase` singular y las tablas físicas tentativas usarán `snake_case` plural mediante `@@map`.

### SP-PRISMA-004. Las relaciones N:M explícitas se modelan como modelos puente

No se usarán relaciones implícitas de Prisma para las relaciones relevantes del dominio. Las entidades puente aprobadas por el ERD deberán existir como modelos explícitos.

### SP-PRISMA-005. Soft delete técnico no sustituye archivado

`deletedAt` podrá existir como técnica operativa solo en modelos donde tenga sentido operativo. Retiro, archivado y memoria institucional deberán seguir representándose desde `Publication`, estados y trazabilidad. Los registros de trazabilidad no deberán usar soft delete en el MVP.

### SP-PRISMA-006. Trazabilidad mínima no es auditoría avanzada

`TraceabilityRecord` registra eventos institucionales relevantes. No debe convertirse en historial campo por campo, workflow multinivel ni sistema de compliance. Tampoco debe tratarse como entidad borrable ordinaria; las correcciones de trazabilidad deberán resolverse mediante nuevos eventos o mediante una política institucional futura explícita.

---

## 6. Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Modelo Prisma | PascalCase singular | `Content` |
| Tabla física | snake_case plural con `@@map` | `contents` |
| Campo Prisma | camelCase | `createdAt` |
| Foreign key | camelCase + `Id` | `contentId` |
| Enum | PascalCase singular | `PublicationStatus` |
| Valores enum | UPPER_SNAKE_CASE | `PUBLISHED` |
| Relaciones | camelCase descriptivo | `contentSources` |

Los nombres son técnicos y revisables. No reemplazan el lenguaje ubicuo institucional.

---

## 7. Decisiones de Especificación Prisma

### PRISMA-DEC-001 — IDs técnicos

Todos los modelos principales y modelos puente usarán `id String @id @default(uuid())` como identificador técnico.

Justificación: facilita consistencia entre modelos, simplifica referencias y evita exponer decisiones secuenciales prematuras.

### PRISMA-DEC-002 — Campos temporales base

Los modelos principales deberán incluir, salvo justificación explícita:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

`deletedAt DateTime?` podrá incluirse como soft delete técnico en modelos operativos principales, pero no equivale a archivado de dominio y no deberá aplicarse a `TraceabilityRecord` en el MVP.

### PRISMA-DEC-003 — Modelos puente explícitos

Las relaciones N:M relevantes se modelarán con modelos explícitos como `ContentSource`, `ContentCampaign`, `ContentDisease`, `PublicationChannel`, etc.

Los modelos puente no deberán usar `deletedAt` cuando tengan `@@unique([aId, bId])`, porque eso bloquearía la recreación de relaciones previamente retiradas de forma lógica. En el MVP, los puentes se tratan como relaciones explícitas; si una relación puente requiere comportamiento operativo propio, deberá expresarse mediante estado, fechas o trazabilidad, no mediante soft delete.

### PRISMA-DEC-004 — Separación Content / Publication

`Content` y `Publication` permanecen separados. `Publication` tendrá relación 1:1 opcional desde Content mediante `contentId @unique`.

### PRISMA-DEC-005 — Campaign y Disease como modelos propios

`Campaign` y `Disease` no serán enum, categoría, tag ni tipo de Content. Serán modelos Prisma propios.

### PRISMA-DEC-006 — Source y Validation separados

`Source` y `Validation` serán modelos separados. `Validation` podrá relacionarse opcionalmente con `Source` cuando la validación evalúe autenticidad, vigencia o pertinencia del origen.

### PRISMA-DEC-007 — Trazabilidad explícita

`TraceabilityRecord` tendrá relaciones opcionales hacia `Content`, `Publication`, `Source` y `Validation`, y relación obligatoria hacia `User` como operador.

### PRISMA-DEC-008 — Sin IA ni pgvector

No se definirán modelos, extensiones ni campos relacionados con IA, embeddings, vectores, pgvector ni chatbot.

---

## 8. Enums Técnicos Propuestos

Los siguientes enums son técnicos y revisables. No constituyen API pública, contrato de frontend, contrato de backend, migración definitiva ni lenguaje institucional final.

Antes de generar migraciones, estos enums deberán validarse contra `erd.md`, reglas de negocio y casos de uso. En especial, `ContentStatus`, `PublicationStatus`, `DistributionStatus` y `TraceabilityAction` no deberán interpretarse como contrato de API ni como estados definitivos de UI.

```prisma
enum ContentStatus {
  DRAFT
  PREPARED
  NEEDS_REVIEW
  READY_FOR_PUBLICATION
  ARCHIVED
}

enum PublicationStatus {
  PUBLISHED
  UPDATED
  WITHDRAWN
  ARCHIVED
  HISTORICALLY_CONTEXTUALIZED
}

enum SourceType {
  OFFICIAL_EXTERNAL
  INSTITUTIONAL_INTERNAL
  DOCUMENTARY
  HISTORICAL
  JURISDICTION_GENERATED
}

enum ValidationType {
  AUTHENTICITY
  VALIDITY
  RELEVANCE
  INSTITUTIONAL_COMPLETE
}

enum ValidationResult {
  APPROVED
  REJECTED
  NEEDS_CLARIFICATION
}

enum MediaResourceType {
  IMAGE
  INFOGRAPHIC
  PDF
  DOCUMENT
  VIDEO_LINK
  EXTERNAL_LINK
}

enum ChannelType {
  PUBLIC_PORTAL
  FACEBOOK
  INSTAGRAM
  X
  TIKTOK
  YOUTUBE
  WHATSAPP
  OTHER
}

enum DistributionStatus {
  PREPARED
  MANUALLY_SHARED
  NOT_SHARED
  CANCELLED
}

enum TraceabilityAction {
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
}
```

### Observación

`ContentStatus` y `PublicationStatus` separan ciclo editorial y exposición pública. Esto evita reducir `Publication` a un booleano técnico.

---

## 9. Prisma Schema Propuesto

El siguiente bloque representa una propuesta revisable de `schema.prisma`. No debe ejecutarse como migración sin revisión posterior.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// =========================
// Enums técnicos revisables
// No son contrato de API, frontend ni migración definitiva.
// =========================

enum ContentStatus {
  DRAFT
  PREPARED
  NEEDS_REVIEW
  READY_FOR_PUBLICATION
  ARCHIVED
}

enum PublicationStatus {
  PUBLISHED
  UPDATED
  WITHDRAWN
  ARCHIVED
  HISTORICALLY_CONTEXTUALIZED
}

enum SourceType {
  OFFICIAL_EXTERNAL
  INSTITUTIONAL_INTERNAL
  DOCUMENTARY
  HISTORICAL
  JURISDICTION_GENERATED
}

enum ValidationType {
  AUTHENTICITY
  VALIDITY
  RELEVANCE
  INSTITUTIONAL_COMPLETE
}

enum ValidationResult {
  APPROVED
  REJECTED
  NEEDS_CLARIFICATION
}

enum MediaResourceType {
  IMAGE
  INFOGRAPHIC
  PDF
  DOCUMENT
  VIDEO_LINK
  EXTERNAL_LINK
}

enum ChannelType {
  PUBLIC_PORTAL
  FACEBOOK
  INSTAGRAM
  X
  TIKTOK
  YOUTUBE
  WHATSAPP
  OTHER
}

enum DistributionStatus {
  PREPARED
  MANUALLY_SHARED
  NOT_SHARED
  CANCELLED
}

enum TraceabilityAction {
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
}

// =========================
// Identity and operational authorship
// =========================

model User {
  id          String   @id @default(uuid())
  email       String   @unique
  displayName String
  isActive    Boolean  @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  createdContents Content[] @relation("ContentCreatedBy")
  updatedContents Content[] @relation("ContentUpdatedBy")

  validations         Validation[]
  traceabilityRecords TraceabilityRecord[]

  @@map("users")
}

// =========================
// Editorial core
// =========================

model ContentType {
  id          String  @id @default(uuid())
  code        String  @unique
  name        String
  description String?
  isActive    Boolean @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  contents Content[]

  @@map("content_types")
}

model Content {
  id            String        @id @default(uuid())
  contentTypeId String
  createdById   String?
  updatedById   String?

  title       String
  slug        String        @unique
  summary     String?
  body        String?
  status      ContentStatus @default(DRAFT)

  seoTitle       String?
  seoDescription String?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  contentType ContentType @relation(fields: [contentTypeId], references: [id])
  createdBy   User?       @relation("ContentCreatedBy", fields: [createdById], references: [id])
  updatedBy   User?       @relation("ContentUpdatedBy", fields: [updatedById], references: [id])

  publication       Publication?
  contentSources    ContentSource[]
  contentValidations ContentValidation[]
  contentCampaigns  ContentCampaign[]
  contentDiseases   ContentDisease[]
  contentMediaResources ContentMediaResource[]
  contentCategories ContentCategory[]
  contentTags       ContentTag[]
  timelineEventContents TimelineEventContent[]
  traceabilityRecords TraceabilityRecord[]

  @@index([contentTypeId])
  @@index([status])
  @@index([createdAt])
  @@map("contents")
}

model Publication {
  id        String @id @default(uuid())
  contentId String @unique

  status      PublicationStatus @default(PUBLISHED)
  publicSlug  String            @unique
  publicTitle String?
  publishedAt DateTime?
  updatedAtPublic DateTime?
  withdrawnAt DateTime?
  archivedAt  DateTime?
  isVisible   Boolean           @default(true)

  institutionalResponsibility String?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  content Content @relation(fields: [contentId], references: [id])

  publicationChannels PublicationChannel[]
  traceabilityRecords TraceabilityRecord[]

  @@index([status])
  @@index([publishedAt])
  @@index([isVisible])
  @@map("publications")
}

// =========================
// Sources and validations
// =========================

model Source {
  id          String     @id @default(uuid())
  type        SourceType
  name        String
  description String?
  organization String?
  url         String?
  isOfficial  Boolean    @default(false)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  contentSources      ContentSource[]
  validations         Validation[]
  traceabilityRecords TraceabilityRecord[]

  @@index([type])
  @@index([isOfficial])
  @@map("sources")
}

model Validation {
  id            String           @id @default(uuid())
  sourceId      String?
  validatedById String?

  type   ValidationType
  result ValidationResult
  summary String?
  validatedAt DateTime?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  source      Source? @relation(fields: [sourceId], references: [id])
  validatedBy User?   @relation(fields: [validatedById], references: [id])

  contentValidations ContentValidation[]
  traceabilityRecords TraceabilityRecord[]

  @@index([sourceId])
  @@index([validatedById])
  @@index([type])
  @@index([result])
  @@map("validations")
}

// =========================
// Institutional organization
// =========================

model Campaign {
  id          String  @id @default(uuid())
  title       String
  slug        String  @unique
  description String?
  objective   String?
  startsAt    DateTime?
  endsAt      DateTime?
  isActive    Boolean @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  contentCampaigns ContentCampaign[]
  campaignDiseases CampaignDisease[]

  @@index([isActive])
  @@index([startsAt])
  @@index([endsAt])
  @@map("campaigns")
}

model Disease {
  id          String  @id @default(uuid())
  name        String
  slug        String  @unique
  description String?
  isActive    Boolean @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  contentDiseases  ContentDisease[]
  campaignDiseases CampaignDisease[]

  @@index([isActive])
  @@map("diseases")
}

// =========================
// Resources
// =========================

model MediaResource {
  id          String            @id @default(uuid())
  type        MediaResourceType
  title       String
  description String?
  resourceUri String?
  externalUrl String?
  mimeType    String?
  altText     String?
  isActive    Boolean @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  contentMediaResources ContentMediaResource[]

  @@index([type])
  @@index([isActive])
  @@map("media_resources")
}

// =========================
// Timeline and memory
// =========================

model TimelineEvent {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  description String?
  occurredAt  DateTime?
  periodLabel String?
  historicalRelevance String?
  isVisible   Boolean  @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  timelineEventContents TimelineEventContent[]

  @@index([occurredAt])
  @@index([isVisible])
  @@map("timeline_events")
}

// =========================
// Channels and distribution
// =========================

model CommunicationChannel {
  id          String      @id @default(uuid())
  type        ChannelType
  name        String
  description String?
  isActive    Boolean     @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  publicationChannels PublicationChannel[]

  @@index([type])
  @@index([isActive])
  @@map("communication_channels")
}

// =========================
// Classification
// =========================

model Category {
  id          String  @id @default(uuid())
  name        String
  slug        String  @unique
  description String?
  isActive    Boolean @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  contentCategories ContentCategory[]

  @@index([isActive])
  @@map("categories")
}

model Tag {
  id          String  @id @default(uuid())
  name        String
  slug        String  @unique
  description String?
  isActive    Boolean @default(true)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  contentTags ContentTag[]

  @@index([isActive])
  @@map("tags")
}

// =========================
// Traceability
// =========================

model TraceabilityRecord {
  id            String             @id @default(uuid())
  userId        String
  contentId     String?
  publicationId String?
  sourceId      String?
  validationId  String?

  action      TraceabilityAction
  summary     String?
  occurredAt  DateTime @default(now())
  institutionalResponsibility String?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  user        User         @relation(fields: [userId], references: [id])
  content     Content?     @relation(fields: [contentId], references: [id])
  publication Publication? @relation(fields: [publicationId], references: [id])
  source      Source?      @relation(fields: [sourceId], references: [id])
  validation  Validation?  @relation(fields: [validationId], references: [id])

  @@index([userId])
  @@index([contentId])
  @@index([publicationId])
  @@index([sourceId])
  @@index([validationId])
  @@index([action])
  @@index([occurredAt])
  @@map("traceability_records")
}

// =========================
// Explicit bridge models
// =========================

model ContentSource {
  id        String @id @default(uuid())
  contentId String
  sourceId  String

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  content Content @relation(fields: [contentId], references: [id])
  source  Source  @relation(fields: [sourceId], references: [id])

  @@unique([contentId, sourceId])
  @@index([sourceId])
  @@map("content_sources")
}

model ContentValidation {
  id           String @id @default(uuid())
  contentId    String
  validationId String

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  content    Content    @relation(fields: [contentId], references: [id])
  validation Validation @relation(fields: [validationId], references: [id])

  @@unique([contentId, validationId])
  @@index([validationId])
  @@map("content_validations")
}

model ContentCampaign {
  id         String @id @default(uuid())
  contentId  String
  campaignId String

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  content  Content  @relation(fields: [contentId], references: [id])
  campaign Campaign @relation(fields: [campaignId], references: [id])

  @@unique([contentId, campaignId])
  @@index([campaignId])
  @@map("content_campaigns")
}

model ContentDisease {
  id        String @id @default(uuid())
  contentId String
  diseaseId String

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  content Content @relation(fields: [contentId], references: [id])
  disease Disease @relation(fields: [diseaseId], references: [id])

  @@unique([contentId, diseaseId])
  @@index([diseaseId])
  @@map("content_diseases")
}

model CampaignDisease {
  id         String @id @default(uuid())
  campaignId String
  diseaseId  String

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  campaign Campaign @relation(fields: [campaignId], references: [id])
  disease  Disease  @relation(fields: [diseaseId], references: [id])

  @@unique([campaignId, diseaseId])
  @@index([diseaseId])
  @@map("campaign_diseases")
}

model ContentMediaResource {
  id              String @id @default(uuid())
  contentId       String
  mediaResourceId String

  caption String?
  sortOrder Int?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  content       Content       @relation(fields: [contentId], references: [id])
  mediaResource MediaResource @relation(fields: [mediaResourceId], references: [id])

  @@unique([contentId, mediaResourceId])
  @@index([mediaResourceId])
  @@map("content_media_resources")
}

model ContentCategory {
  id         String @id @default(uuid())
  contentId  String
  categoryId String

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  content  Content  @relation(fields: [contentId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])

  @@unique([contentId, categoryId])
  @@index([categoryId])
  @@map("content_categories")
}

model ContentTag {
  id        String @id @default(uuid())
  contentId String
  tagId     String

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  content Content @relation(fields: [contentId], references: [id])
  tag     Tag     @relation(fields: [tagId], references: [id])

  @@unique([contentId, tagId])
  @@index([tagId])
  @@map("content_tags")
}

model PublicationChannel {
  id                   String @id @default(uuid())
  publicationId         String
  communicationChannelId String

  status DistributionStatus @default(PREPARED)
  preparedText String?
  preparedAt   DateTime?
  sharedAt     DateTime?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  publication         Publication         @relation(fields: [publicationId], references: [id])
  communicationChannel CommunicationChannel @relation(fields: [communicationChannelId], references: [id])

  @@unique([publicationId, communicationChannelId])
  @@index([communicationChannelId])
  @@index([status])
  @@map("publication_channels")
}

model TimelineEventContent {
  id              String @id @default(uuid())
  timelineEventId String
  contentId       String

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  timelineEvent TimelineEvent @relation(fields: [timelineEventId], references: [id])
  content       Content       @relation(fields: [contentId], references: [id])

  @@unique([timelineEventId, contentId])
  @@index([contentId])
  @@map("timeline_event_contents")
}
```

---

## 10. Mapeo ERD → Prisma

| Tabla ERD | Modelo Prisma | Justificación |
|-----------|---------------|---------------|
| `users` | `User` | Autoría operativa, no responsabilidad institucional final. |
| `contents` | `Content` | Pieza editorial base. |
| `content_types` | `ContentType` | Clasificación editorial principal. |
| `publications` | `Publication` | Exposición pública de Content. |
| `sources` | `Source` | Origen o respaldo del conocimiento. |
| `validations` | `Validation` | Confirmación institucional. |
| `campaigns` | `Campaign` | Iniciativa institucional agrupadora. |
| `diseases` | `Disease` | Concepto temático de salud pública. |
| `media_resources` | `MediaResource` | Recursos reutilizables. |
| `timeline_events` | `TimelineEvent` | Memoria histórica institucional. |
| `communication_channels` | `CommunicationChannel` | Canal como mecanismo de distribución. |
| `categories` | `Category` | Navegación y organización editorial. |
| `tags` | `Tag` | Clasificación flexible y búsqueda básica. |
| `traceability_records` | `TraceabilityRecord` | Trazabilidad institucional mínima. |

---

## 11. Relaciones Prisma Críticas

### 11.1 Content → Publication

```prisma
model Publication {
  contentId String @unique
  content   Content @relation(fields: [contentId], references: [id])
}
```

Esta relación preserva la cardinalidad 1 ── 0..1 aprobada en el ERD.

### 11.2 Source → Validation

```prisma
model Validation {
  sourceId String?
  source   Source? @relation(fields: [sourceId], references: [id])
}
```

La relación es opcional porque no toda validación proviene de una fuente oficial externa.

### 11.3 TraceabilityRecord transversal

```prisma
model TraceabilityRecord {
  contentId     String?
  publicationId String?
  sourceId      String?
  validationId  String?
}
```

Las relaciones son opcionales para evitar que un evento de trazabilidad dependa simultáneamente de todas las entidades. `TraceabilityRecord` no incluye `deletedAt` en el MVP para preservar evidencia institucional mínima.

### 11.4 Relaciones N:M explícitas

Cada relación N:M relevante usa modelo puente explícito con `@@unique` para evitar duplicados.

---

## 12. Estrategia Técnica de Soft Delete

La especificación propone `deletedAt DateTime?` como técnica operativa controlada, no como regla universal.

Reglas:

- `deletedAt` no equivale a archivado.
- `deletedAt` no equivale a retiro de consulta pública.
- `deletedAt` no elimina memoria institucional.
- `TraceabilityRecord` no usa `deletedAt` en el MVP, porque la trazabilidad institucional mínima debe preservarse como evidencia de eventos relevantes.
- Los modelos puente con `@@unique([aId, bId])` no usan `deletedAt`, para evitar conflictos al recrear relaciones retiradas lógicamente.
- `ContentMediaResource` y `PublicationChannel` conservan sus metadatos operativos, como `caption`, `sortOrder`, `status`, `preparedText`, `preparedAt` o `sharedAt`, pero no usan soft delete en el MVP.
- La semántica de archivado pertenece principalmente a `PublicationStatus`, fechas de publicación/retiro/archivo y `TraceabilityRecord`.

La política operativa exacta de soft delete deberá revisarse antes de migraciones.

---

## 13. Índices y Restricciones Tentativas

Los índices propuestos son tentativos y deberán revisarse contra casos de uso y consultas reales antes de migraciones.

| Modelo | Índices / restricciones | Motivo |
|--------|--------------------------|--------|
| `Content` | `slug`, `contentTypeId`, `status`, `createdAt` | Consulta editorial y pública básica. |
| `Publication` | `publicSlug`, `status`, `publishedAt`, `isVisible` | Consulta pública y vigencia. |
| `Source` | `type`, `isOfficial` | Trazabilidad de origen. |
| `Validation` | `sourceId`, `validatedById`, `type`, `result` | Revisión institucional. |
| `Campaign` | `slug`, `isActive`, `startsAt`, `endsAt` | Campañas vigentes e históricas. |
| `Disease` | `slug`, `isActive` | Navegación temática. |
| `TraceabilityRecord` | `userId`, `contentId`, `publicationId`, `action`, `occurredAt` | Explicabilidad institucional. |
| Modelos puente | `@@unique([aId, bId])` sin `deletedAt` | Evitar duplicidad sin bloquear recreación por soft delete. |
| Puentes con metadatos | `ContentMediaResource`, `PublicationChannel` sin `deletedAt` | Conservan metadatos operativos mediante campos propios y trazabilidad, no mediante soft delete. |

---

## 14. Tablas Prohibidas que No Aparecen en el Schema

La propuesta no incluye:

- `knowledge_core`;
- `cms_posts`;
- `posts`;
- `news`;
- `notices`;
- `statements`;
- `documents`;
- `infographics`;
- `faqs`;
- `campaign_contents`;
- `disease_contents`;
- `social_posts`;
- `facebook_posts`;
- `instagram_posts`;
- `x_posts`;
- `tiktok_posts`;
- `youtube_posts`;
- `ai_knowledge`;
- `embeddings`;
- `vectors`;
- `pgvector_documents`;
- `chatbot_answers`.

La ausencia de estas tablas es intencional y protege las decisiones del ERD.

---

## 15. Decisiones Diferidas

### Diferidas a revisión de `schema.prisma` real

- Validación sintáctica final con Prisma CLI.
- Ajustes de nombres de campos.
- Revisión de índices con consultas reales.
- Revisión de `onDelete` y `onUpdate`.
- Política final de cascadas o restricciones.
- Ajuste de longitudes y tipos específicos si se requiere.

### Diferidas a migraciones

- Generación de migración inicial.
- Revisión del SQL generado.
- Seed inicial de catálogos.
- Orden de migraciones.

### Diferidas a API

- DTOs.
- Endpoints.
- Contratos request/response.
- Filtros, paginación y ordenamiento.
- Rutas públicas y administrativas.

### Diferidas a Backend

- Repositories.
- Services.
- Use cases implementados.
- Transacciones.
- Validaciones de aplicación.
- Integración NestJS.

### Diferidas a fases futuras

- IA.
- Embeddings.
- pgvector.
- Búsqueda semántica.
- Auditoría avanzada.
- Versionado editorial avanzado.
- Roles avanzados.
- Integración automática con redes sociales.

---

## 16. Riesgos de la Especificación Prisma

| Riesgo | Consecuencia | Mitigación |
|--------|--------------|------------|
| Convertir Prisma en dominio | Las reglas de negocio vivirían en infraestructura. | Mantener Prisma como mapeo técnico. |
| Sobrecargar enums | El schema se convierte en contrato de frontend/API. | Declarar enums como técnicos y revisables. |
| Usar soft delete como archivado | Se perdería memoria institucional. | Separar `deletedAt` de `PublicationStatus` y trazabilidad. |
| Usar soft delete en trazabilidad | Se debilita la evidencia institucional mínima. | No incluir `deletedAt` en `TraceabilityRecord` durante el MVP. |
| Combinar soft delete con `@@unique` en modelos puente | Se bloquea recrear una relación previamente retirada de forma lógica. | Quitar `deletedAt` de los modelos puente en el MVP. |
| Convertir trazabilidad en auditoría avanzada | Sobrediseño fuera del MVP. | Limitar `TraceabilityRecord` a eventos institucionales mínimos. |
| Generar relaciones implícitas N:M | Prisma ocultaría decisiones del dominio. | Usar modelos puente explícitos. |
| Introducir IA prematuramente | Se adelanta fase futura. | Prohibir modelos de IA, embeddings y pgvector. |
| Acoplar canales externos | El modelo dependería de redes sociales. | Usar `CommunicationChannel` y `PublicationChannel`. |

---

## 17. Checklist de Revisión Arquitectónica

- [ ] El schema deriva de `erd.md`.
- [ ] El schema no modifica el dominio.
- [ ] Prisma no redefine reglas de negocio.
- [ ] `Content` y `Publication` permanecen separados.
- [ ] `Campaign` y `Disease` son modelos propios.
- [ ] `Source` y `Validation` son modelos separados.
- [ ] `TraceabilityRecord` existe como trazabilidad mínima.
- [ ] Las relaciones N:M son modelos puente explícitos.
- [ ] `deletedAt` no sustituye archivado.
- [ ] `TraceabilityRecord` no usa soft delete.
- [ ] Los modelos puente no combinan `deletedAt` con `@@unique([aId, bId])`.
- [ ] Los enums se declaran técnicos, revisables y no contractuales.
- [ ] No existen tablas prohibidas.
- [ ] No se incluyen IA, embeddings ni pgvector.
- [ ] No se genera API.
- [ ] No se genera backend.
- [ ] No se ejecutan migraciones.
- [ ] El documento prepara el futuro `schema.prisma` real.

---

## 18. Dictamen Arquitectónico

Esta especificación mantiene coherencia con `database.md` y `erd.md`, preserva el dominio, evita IA prematura, no adelanta API ni backend, y puede marcarse como baseline documental para preparar el futuro archivo técnico `schema.prisma`.

Aprobar este documento no autoriza todavía:

- ejecutar migraciones;
- implementar repositorios;
- crear endpoints;
- implementar servicios;
- iniciar frontend;
- iniciar backend completo.

La siguiente validación deberá revisar el futuro `schema.prisma` real con Prisma CLI y evaluar su adecuación para una migración inicial controlada.

---

## 19. Autoevaluación

Este documento:

- deriva de `database.md` y `erd.md`;
- traduce entidades ERD a modelos Prisma;
- propone enums técnicos revisables;
- usa `@@map` para preservar nombres físicos tentativos;
- mantiene modelos puente explícitos;
- separa `Content` y `Publication`;
- conserva `Campaign` y `Disease` como conceptos propios;
- separa `Source` y `Validation`;
- incluye trazabilidad institucional mínima sin soft delete;
- evita combinar soft delete con restricciones únicas en modelos puente;
- declara enums técnicos, revisables y no contractuales;
- evita tablas prohibidas;
- no introduce IA, embeddings ni pgvector;
- no genera API;
- no genera backend;
- no ejecuta migraciones.

> Prisma sirve a la persistencia del dominio. No redefine el dominio.
