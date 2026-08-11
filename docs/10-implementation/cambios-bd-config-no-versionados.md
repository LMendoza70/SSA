# Cambios de BD y configuración NO versionados — Guía para quien pruebe el proyecto

> Fecha: 2026-08-10
> Propósito: documentar qué se cambió en la base de datos y en configuración local (`.env`, archivos sin rastrear) que **no viajan con git**. Si clonas/actualizas el repo en otra PC, esto NO se baja automático y debes reproducirlo manualmente.

---

## 0. Resumen ejecutivo

Para que el proyecto funcione en otra PC (y para que no rompa al actualizar) hay 4 grupos de cosas que **no se suben**:

1. **Migraciones Prisma** → sí van en el repo, pero hay que ejecutarlas (`migrate deploy` + `generate`).
2. **Datos sembrados a mano** → la tabla `communication_channels` se llenó manualmente; NO hay seed. Hay que reinsertarlos.
3. **Tokens de redes sociales** → viven solo en la BD local; hay que reautenticar cada red desde la UI.
4. **Variables de entorno / archivos locales** → `.env`, `uploads/`, `tsconfig.tsbuildinfo`, `api-facebook-app/`.

**Conflictos probables al actualizar**: errores de esquema Prisma (`temporalImageUrl` no existe), "No hay canales disponibles", o fallo de publicación si no está `PUBLIC_URL` pública.

---

## 1. Cambios de esquema de base de datos

### 1.1 Migración nueva `20260804214550_add_social_credentials`

Crea la tabla `social_credentials` (guardar credenciales de redes sociales):

| Columna | Tipo | Notas |
|---|---|---|
| `id` | TEXT | PK, uuid |
| `platform` | TEXT | valor: `facebook`, `instagram`, `youtube` |
| `credentialKey` | TEXT | p. ej. `page_token`, `account_id` |
| `credentialValue` | TEXT | **el token/secreto (NUNCA subir a git)** |
| `description` | TEXT | nullable, opcional |
| `createdAt`, `updatedAt` | TIMESTAMP | auditoría |

Índices:
- `social_credentials_platform_idx` (por `platform`)
- `social_credentials_platform_credentialKey_key` (ÚNICO por `platform` + `credentialKey`)

### 1.2 Migración nueva `20260806214026_add_temporal_image_url`

```sql
ALTER TABLE "publications" ADD COLUMN "temporalImageUrl" TEXT;
```

Nuevo campo nullable en la tabla `publications`. Modelo Prisma:

```prisma
model Publication {
  temporalImageUrl String?   // línea 240 del schema
}
```

### 1.3 Aplicar en la PC destino

```bash
# 1. instalar dependencias
pnpm install

# 2. aplicar migraciones pendientes (crea social_credentials + temporalImageUrl)
pnpm --filter api prisma migrate deploy     # o: pnpm prisma migrate deploy
# Si aún no existe la DB base, usar en su lugar:
#   pnpm prisma migrate dev

# 3. regenerar el cliente Prisma (aleatorio en apps/api/src/generated/, que NO está versionado)
pnpm --filter api prisma generate           # o: pnpm prisma generate
```

---

## 2. Datos sembrados manualmente (NO hay seed)

La tabla `communication_channels` **se llenó a mano** (por eso antes daba el error "No hay canales disponibles"). Debes insertar los 3 canales:

```sql
INSERT INTO communication_channels (id, type, name, "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'FACEBOOK',  'Facebook',  true, now(), now()),
  (gen_random_uuid(), 'INSTAGRAM', 'Instagram', true, now(), now()),
  (gen_random_uuid(), 'YOUTUBE',   'YouTube',   true, now(), now());
```

Valores esperados en la tabla:

| type | name | isActive |
|---|---|---|
| FACEBOOK | Facebook | true |
| INSTAGRAM | Instagram | true |
| YOUTUBE | YouTube | true |

> ⚠️ Si no haces esto, la pantalla de publicación no mostrará canales y no se podrá publicar a redes.

---

## 3. Tokens / credenciales sociales (solo en BD local — reautenticación obligatoria)

La tabla `social_credentials` contiene los tokens reales. **No se transmiten con git ni se deben subir.**

### 3.1 Claves que el código espera

| Plataforma | `credentialKey` esperados |
|---|---|
| `facebook` | `page_token`, `page_id`, `account_id`, `app_id`, `user_token` |
| `instagram` | `page_token`, `account_id` |
| `youtube` | `client_id`, `client_secret`, `project_id` (tras OAuth también `access_token`, `refresh_token`) |

### 3.2 Cómo llenarlas en la PC destino

Entrar a la UI de administración en la ruta `/admin/social-credentials` y reautenticar cada red:
- **Facebook/Instagram**: login OAuth (genera `page_token`, `user_token`, ids).
- **YouTube**: subir el JSON de credenciales de Google Cloud (el módulo guarda las claves `web`/`installed` del JSON OAuth).

> Los tokens son de corta duración y específicos de la cuenta/App que los emite; **no son transferibles** entre PCs/BD. Hay que rehacerlos.

---

## 4. Variables de entorno (`.env` local — NO versionado)

El `.env` real está ignorado. El receptor debe copiar `.env.example` → `.env` y completar.

### 4.1 Variables dependientes del código nuevo

| Variable | Uso | Valor en tu `.env` (local) |
|---|---|---|
| `DATABASE_URL` | conexión Postgres | `postgresql://postgres:admin@localhost:5432/ssa_db?schema=public` |
| `PUBLIC_URL` | **base de URLs públicas** para media y links de publicaciones (usada por `distribution.service.ts`); fallback `http://localhost:5173` | **NO definida** → fallback localhost |
| `UPLOAD_DIR` | carpeta de uploads (usada en resolución de rutas locales) | NO definida (usa `cwd/uploads`) |
| `API_PORT` | puerto API | `3001` |
| `CORS_ORIGIN` | orígenes permitidos | `http://localhost:5173` |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRATION` | auth | presentes |

### 4.2 Advertencias

- Con `PUBLIC_URL` sin definir todo apunta a `localhost`; **Facebook/Instagram/Meta no pueden acceder** a esas URLs → los posts fallan (error 1500/9004). Para probar la publicación real en otra PC se necesita `PUBLIC_URL` pública (dominio o túnel tipo ngrok/cloudflared).
- Considera definir `UPLOAD_DIR` explícito y asegurarse de que `apps/api/uploads/` exista y sea escribible.

---

## 5. Archivos locales que NO se suben (y cómo no romper al actualizar)

| Ítem | Estado git | Riesgo / Recomendación |
|---|---|---|
| `apps/api/uploads/` | contiene PNGs trackeados (2) y otros sin rastrear | las imágenes de usuarios son locales; candidata a `.gitignore` |
| `api-facebook-app/` | **sin rastrear** (contiene `node_modules/`, `dist/`) | es una app de ejemplo para callback OAuth; borrarla o añadirla a `.gitignore` |
| `.env`, `.env.local`, `.env.production` | ignorados | no subir |
| `apps/api/src/generated/` | ignorado | se regenera con `prisma generate` |
| `apps/api/tsconfig.tsbuildinfo`, `apps/web/tsconfig.tsbuildinfo` | **rastreados** (`M`) | artefactos de build; candidatos a `git rm --cached` + `.gitignore` |

### Cómo dejarlo consistente (opcional, aplica el desarrollador actual)

```gitignore
# añadir al .gitignore
*.tsbuildinfo
apps/api/uploads/
api-facebook-app/
```

```bash
git rm --cached apps/api/tsconfig.tsbuildinfo apps/web/tsconfig.tsbuildinfo
```

---

## 6. Lo que SÍ está versionado (ya llega con el repo)

- `prisma/schema.prisma` (modelos `SocialCredential`, campo `temporalImageUrl`) y las 2 migraciones nuevas.
- Código nuevo de distribución: `apps/api/src/distribution/social-credentials/*`, `adapters/*` (facebook, instagram), `distribution.service.ts`, DTOs.
- Frontend: campo "URL de imagen temporal", hooks, página de credenciales.
- Reglas de publicación automática (texto→Facebook, imagen→Facebook/Instagram) y gestión de `urlImagenTemporal`.

---

## 7. Checklist para la PC que recibe el cambio

1. [ ] `pnpm install`
2. [ ] Copiar `.env.example` → `.env` y completar `DATABASE_URL`, JWT, `PUBLIC_URL`, `UPLOAD_DIR`
3. [ ] Aplicar migraciones: `pnpm prisma migrate deploy`
4. [ ] Regenerar cliente: `pnpm prisma generate`
5. [ ] Insertar los 3 canales en `communication_channels` (sección 2)
6. [ ] Verificar que `apps/api/uploads/` exista y sea escribible
7. [ ] Reautenticar Facebook/Instagram/YouTube por la UI (`/admin/social-credentials`)
8. [ ] Definir `PUBLIC_URL` pública (dominio/túnel) para poder publicar imagen a Instagram y links accesibles por Meta
9. [ ] Compilar y arrancar API (`:3001`) y web (`:5173`)
10. [ ] Probar publicación: texto→FB, imagen local→FB, imagen por URL→IG, IG sin URL→rechazo claro