# Cambios: estado original de `main` → estado actual (integración de APIs)

> Fecha: 2026-08-11
> Rama base original: `main` @ `fb47dd6`
> Rama de desarrollo: `apis` @ `22fd131` → `apis-limpia` (historial limpio) @ `5684aca`
> Estado final integrado: `main` @ `22fd131` (fast-forward limpio, árbol idéntico a `apis-limpia`)
> Comparación: `git diff fb47dd6 22fd131` → **36 archivos, +2888 / -104**

Este documento describe todos los cambios implementados desde el estado original de `main` hasta el estado actual: **base de datos, backend y frontend**.

---

## 1. Resumen general

Se integró la **publicación automática a redes sociales** (Facebook, Instagram y YouTube) dentro del CMS SSA:

- **Antes (`fb47dd6`)**: los adaptadores de redes eran *stubs* (simulaban publicación con IDs falsos). No había almacenamiento de credenciales, ni OAuth, ni análisis de contenido.
- **Después (`22fd131`)**: publicación real contra la Graph API de Meta (Facebook/Instagram) y la API de YouTube, con almacenamiento de tokens en BD, flujo OAuth, análisis automático del contenido (texto/imagen/video) para elegir redes, y regla de "publicación solo visible si la(s) red(es) confirman".

---

## 2. Base de datos

### 2.1 Nueva tabla `social_credentials` (migración `20260804214550_add_social_credentials`)

```sql
CREATE TABLE "social_credentials" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,          -- 'facebook' | 'instagram' | 'youtube'
    "credentialKey" TEXT NOT NULL,     -- ej: page_token, page_id, app_id...
    "credentialValue" TEXT NOT NULL,   -- el token/secreto
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "social_credentials_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "social_credentials_platform_idx" ON "social_credentials"("platform");
CREATE UNIQUE INDEX "social_credentials_platform_credentialKey_key" ON "social_credentials"("platform", "credentialKey");
```

**Modelo Prisma** (`prisma/schema.prisma`, nuevo al final del archivo):

```prisma
model SocialCredential {
  id             String   @id @default(uuid())
  platform       String
  credentialKey  String
  credentialValue String
  description    String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  @@unique([platform, credentialKey])
  @@index([platform])
  @@map("social_credentials")
}
```

### 2.2 Campo nuevo en `publications` (migración `20260806214026_add_temporal_image_url`)

```sql
ALTER TABLE "publications" ADD COLUMN "temporalImageUrl" TEXT;
```

En `schema.prisma`:

```prisma
model Publication {
  ...
  temporalImageUrl String?   // URL pública temporal de la imagen (requerida por Instagram)
  ...
}
```

**Significado**: si el contenido no tiene una imagen guardada en el sistema, se puede indicar una URL pública temporal de imagen para que Facebook/Instagram puedan publicarlo. Se guarda junto a la publicación.

### 2.3 Datos sembrados manualmente (NO versionados)

La tabla `communication_channels` se llenó manualmente con 3 canales (no hay seed automático):

```sql
INSERT INTO communication_channels (id, type, name, "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'FACEBOOK',  'Facebook',  true, now(), now()),
  (gen_random_uuid(), 'INSTAGRAM', 'Instagram', true, now(), now()),
  (gen_random_uuid(), 'YOUTUBE',   'YouTube',   true, now(), now());
```

> ⚠️ Sin esto, la pantalla de publicación no muestra canales. Detalle en `docs/10-implementation/cambios-bd-config-no-versionados.md`.

---

## 3. Backend (NestJS / `apps/api`)

### 3.1 Dependencias nuevas
- `axios ^1.18.1` añadida a `apps/api/package.json` (antes solo estaba en la web).

### 3.2 Módulo nuevo: `distribution/social-credentials/`
| Archivo | Función |
|---|---|
| `social-credentials.module.ts` | Módulo Nest que agrupa los servicios y los exporta |
| `social-credential.service.ts` | CRUD de credenciales contra `social_credentials` (get/set/delete por plataforma y clave) |
| `social-credential.controller.ts` | Endpoints REST `/admin/social-credentials` (ver 3.4) |
| `social-oauth.service.ts` | Flujo OAuth: URL de login de Facebook (`v22.0/dialog/oauth`), intercambio de código de YouTube (`oauth2.googleapis.com/token`), resolución de páginas de Facebook y guardado de tokens |
| `facebook-api.client.ts` | Cliente HTTP Graph API Facebook v22.0: `postText`, `postPhoto`, `postVideo`, `validateConnection`, `getPages` |
| `instagram-api.client.ts` | Cliente HTTP Instagram: `createImagePost`, `createReelsPost`, `pollForFinish` (espera de estado del contenedor), `validateConnection` |
| `youtube-api.client.ts` | Cliente YouTube: `uploadVideo` (subida vía API), intercambio de tokens |
| `content-analyzer.service.ts` | Analiza el contenido (título, resumen, cuerpo, multimedia) y determina plataformas habilitadas |
| `social-url.util.ts` | Helper `isPublicUrl()`: valida que una URL no sea localhost/red local/privada (evita que Meta intente analizar URLs locales) |

### 3.3 Lógica de publicación (`distribution.service.ts` — de 182 a ~586 líneas)

Métodos nuevos principales:

| Método | Descripción |
|---|---|
| `publishContentToSocials(contentId, dto, userId)` | Orquestador: crea la publicación en modo **invisible** (`isVisible:false`), publica en las redes seleccionadas; solo si **todas** confirman, marca `isVisible:true`. Si alguna falla, queda invisible y se devuelve `fallbackMessage` |
| `publishToChannels(publicationId, channelIds, userId)` | Publica en varios canales de una publicación ya existente; solo marca compartido si todos se publican |
| `analyzeContentMedia(publicationId)` / `analyzeContentMediaByContentId(contentId)` | Devuelve `eligiblePlatforms` según el contenido |
| `getEligibleChannels(publicationId)` / `getEligibleChannelsForContent(contentId)` | Mapea las plataformas habilitadas a los canales activos de la BD |
| `getChannelTokenStatus(platform)` | Verifica que el canal tenga token configurado y conexión válida |
| `resolveUniqueSlug(baseSlug)` | Genera slugs únicos (agrega sufijo si existe) |

Detalles clave de `publishContentToSocials`:
1. Crea `Publication` con `publicSlug` (auto o proporcionado), `temporalImageUrl` (de `dto.urlImagenTemporal`) y `isVisible:false`.
2. Distribuye por canal usando el adapter correspondiente (pasando `publicSlug` y `temporalImageUrl`).
3. Si `distribution.allSucceeded === true` → marca `isVisible:true` y `publishedAt`.
4. Si falla → devuelve `fallbackMessage` ("El contenido se guardó localmente, pero falló la publicación...") y el contenido **no aparece en el sitio**.

### 3.4 Endpoints REST nuevos

**En `DistributionController`** (`apps/api/src/distribution/distribution.controller.ts`):

| Método | Ruta | Función |
|---|---|---|
| POST | `/distribution/publications/:publicationId/publish-channels` | Publicar en varios canales (éxito solo si todos publican) |
| POST | `/distribution/contents/:contentId/publish-to-socials` | Publicar a redes; visible solo si todas confirman |
| GET | `/distribution/publications/:publicationId/content-media-analysis` | Análisis de multimedia → plataformas habilitadas |
| GET | `/distribution/publications/:publicationId/eligible-channels` | Canales habilitados para una publicación |
| GET | `/distribution/contents/:contentId/eligible-channels` | Canales habilitados para un contenido |
| GET | `/distribution/communication-channels/:type/token-status` | Estado del token de una plataforma |
| POST | `/distribution/communication-channels/:type/validate-connection` | Validar conexión a la plataforma |

**En `SocialCredentialController`** (`/admin/social-credentials`):

| Método | Ruta | Función |
|---|---|---|
| GET | `/admin/social-credentials` | Listar credenciales por plataforma |
| POST | `/admin/social-credentials/upload-credentials` | Subir JSON de credenciales (Google/YouTube) |
| POST | `/admin/social-credentials/facebook/auth-url` | Obtener URL de login de Facebook |
| POST | `/admin/social-credentials/facebook/callback` | Procesar callback de Facebook (guardar page_token, ids) |
| POST | `/admin/social-credentials/youtube/auth-url` | Obtener URL de OAuth de YouTube |
| POST | `/admin/social-credentials/youtube/callback` | Intercambiar código → access/refresh token de YouTube |
| GET/POST/DELETE | `/admin/social-credentials/:platform` (+ `/:platform/has/:key`) | CRUD de credenciales por plataforma |

### 3.5 Adaptadores (`distribution/adapters/`) — de stubs a implementación real

**Interfaz `social-publisher.interface.ts`**:
- `PublishableContent.mediaUrls` cambió de `string[]` a `MediaUrlInfo[]` (`{ url, mimeType?, filePath? }`).
- Nuevos campos: `publicSlug?`, `temporalImageUrl?`.

| Adapter | Antes (stub) | Después |
|---|---|---|
| `FacebookAdapter` | `fb_stub_...` | Usa `FacebookApiService`: publica texto con link **solo si la URL es pública** (`isPublicUrl`, evita error 1500 de Meta); con imagen usa `postPhoto` (URL pública o archivo local multipart); con video `postVideo`. Caption con slug. |
| `InstagramAdapter` | `ig_stub_...` | Exige `temporalImageUrl` pública (`isPublicUrl`); si no → `success:false` con error claro **sin llamar a Meta**. Con URL válida → `createImagePost(image_url, caption)` + espera de publicación. |
| `YouTubeAdapter` | `yt_stub_...` | Requiere archivo de video (`video/` en `mediaUrls`); si no → error claro. Con video → `uploadVideo`. |

### 3.6 Tests
- `distribution.service.spec.ts`: +6 líneas (cobertura del nuevo flujo).

---

## 4. Frontend (React / `apps/web`)

### 4.1 Nueva página: Credenciales Sociales
- **`apps/web/src/pages/admin/social-credentials/SocialCredentialsPage.tsx`** (391 líneas, nuevo): UI para gestionar credenciales de Facebook, Instagram y YouTube — login OAuth (con `useFacebookSDK`), subir JSON de Google, mostrar estado por clave.
- **Ruta**: `/admin/social-credentials` registrada en `App.tsx`.
- **Sidebar** (`Sidebar.tsx`): nuevo ítem "Credenciales Sociales" con ícono `Security`, visible para rol `ADMIN`.

### 4.2 Hooks nuevos
| Hook | Archivo | Función |
|---|---|---|
| `usePublishToSocials` | `hooks/usePublications.ts` | `POST /admin/contents/:contentId/publish-to-socials` con `{ publicSlug, publicTitle, institutionalResponsibility, channelIds, urlImagenTemporal }`; invalida queries al éxito |
| `useContentEligibleChannels` | `hooks/useCommunicationChannels.ts` | `GET /admin/contents/:contentId/eligible-channels` |
| `usePublishToChannels` | `hooks/useCommunicationChannels.ts` | `POST /admin/publications/:publicationId/publish-channels` |
| `useFacebookSDK` | `hooks/useFacebookSDK.ts` | Carga e inicializa el SDK de Facebook (`FB.init` v22.0), `FB.login`, `getLoginStatus` |

### 4.3 `ContentFormPage.tsx` — formulario de publicación
- Nuevo campo **"URL de imagen temporal"** en el formulario principal (sección Publicación): si se provee una URL pública (`^https?://...`), habilita Facebook e Instagram en el selector aunque el backend no los considere elegibles.
- El selector de canales ahora muestra **solo canales elegibles** según el contenido (`useContentEligibleChannels`) y marca los no disponibles con "— no disponible para este contenido".
- Validación previa: si se selecciona **Instagram sin URL de imagen** → error "Instagram requiere una URL pública de imagen" sin llamar a la API.
- Validación: si no se selecciona al menos una red → error y no se publica en el sitio.
- La publicación ahora se hace vía `usePublishToSocials` (orquestador), no con `useAssociatePublicationChannels`.
- El chip "Publicado" solo se muestra si `content.publication.isVisible === true`. Si falló la red, el botón "Publicar" reaparece para reintentar.
- Los errores se muestran con `whiteSpace: pre-line` (mensajes multilínea).
- Botón deshabilitado mientras `createPublication.isPending || publishToSocials.isPending`.

### 4.4 `PublicationListPage.tsx`
- Integra `usePublishToChannels` y el análisis de contenido (`contentAnalysis.eligiblePlatforms`).
- Muestra estados de token por plataforma (`token-statuses` via `GET /admin/communication-channels/:p/token-status`).

---

## 5. Configuración y despliegue

### 5.1 Variables de entorno relevantes (`.env` NO versionado)
| Variable | Uso |
|---|---|
| `PUBLIC_URL` | Base pública para media y links de publicaciones; **debe ser accesible por Meta** (no localhost) o los posts fallan (1500/9004) |
| `UPLOAD_DIR` | Carpeta de uploads (resolución de rutas locales para multipart) |

### 5.2 Archivos que NO se suben
- `.env`, `.env.local`, `.env.production` (ignorados).
- `apps/api/src/generated/` (regenerar con `prisma generate`).
- Tokens en `social_credentials` (se reautentican por la UI en cada entorno).
- `apps/api/uploads/` (contiene 3 PNGs de prueba trackeados).

### 5.3 Para levantar en otra máquina
```bash
pnpm install
pnpm prisma migrate deploy   # aplica las 2 migraciones nuevas
pnpm prisma generate
# insertar los 3 canales en communication_channels (sección 2.3)
# reautenticar Facebook/Instagram/YouTube en /admin/social-credentials
```

---

## 6. Reglas de negocio implementadas (resumen)

1. **Texto sin imagen** → Facebook (postText). No se adjunta link local a Meta (evita error 1500).
2. **Imagen local** → Facebook (postPhoto multipart) y, si se provee `temporalImageUrl` pública, también Instagram.
3. **Imagen por URL pública** → Facebook e Instagram (subida por URL).
4. **Video** → YouTube y Facebook.
5. **Instagram sin imagen pública** → rechazo claro (no se llama a Meta).
6. **Publicación visible en el sitio solo si todas las redes seleccionadas confirman** (rollback a `isVisible:false` si falla).

---

## 7. Referencia de verificación

```bash
# Contenido final == contenido de apis-limpia (debe estar vacío)
git diff apis-limpia main

# Migraciones presentes en main
git ls-tree -r --name-only main -- prisma/migrations
```
