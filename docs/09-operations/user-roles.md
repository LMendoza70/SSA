# Roles y Permisos del Sistema

> Documento oficial de perfiles de usuario, credenciales de prueba y matriz de acceso del CMS para la Jurisdicción Sanitaria de Huejutla de Reyes.

---

## 1. Perfiles del Sistema

### 1.1 ADMIN — Administrador del Sistema

Acceso total a todas las funcionalidades del CMS. Gestiona usuarios, configuración y supervisa la plataforma.

### 1.2 EDITOR — Responsable Editorial

Gestiona el ciclo de vida completo del contenido: creación, edición, validación, publicación, distribución y trazabilidad.

### 1.3 WRITER — Redactor

Crea y edita contenido, gestiona fuentes y recursos multimedia. No puede publicar ni gestionar validaciones.

### 1.4 VALIDATOR — Validador

Revisa y aprueba/rechaza validaciones de contenido. No puede crear contenido ni publicar.

### 1.5 PUBLISHER — Publicador

Publica contenido ya validado y gestiona canales de distribución. No puede editar contenido ni crear validaciones.

### 1.6 AUDITOR — Auditor

Solo lectura. Consulta trazabilidad de auditoría. No puede crear, editar ni publicar contenido.

---

## 2. Credenciales de Prueba

Todos los usuarios comparten la contraseña: `Admin123!`

| Email | Display Name | Rol |
|---|---|---|
| `admin@jurisdiccion.gob.mx` | Administrador | ADMIN |
| `editor@jurisdiccion.gob.mx` | Editor Principal | EDITOR |
| `redactor@jurisdiccion.gob.mx` | Redactor | WRITER |
| `validador@jurisdiccion.gob.mx` | Validadora | VALIDATOR |
| `publicador@jurisdiccion.gob.mx` | Publicador | PUBLISHER |
| `auditor@jurisdiccion.gob.mx` | Auditor | AUDITOR |

---

## 3. Matriz de Acceso por Módulo

| Módulo | ADMIN | EDITOR | WRITER | VALIDATOR | PUBLISHER | AUDITOR |
|---|---|---|---|---|---|---|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Contenidos | CRUD | CRUD | CRUD | — | — | — |
| Publicaciones | CRUD | CRUD | — | — | CRUD | — |
| Fuentes | CRUD | CRUD | CRUD | — | — | — |
| Validaciones | CRUD | CRUD | — | CRUD | — | — |
| Multimedia | CRUD | CRUD | CRUD | — | — | — |
| Campañas | CRUD | CRUD | — | — | — | — |
| Enfermedades | CRUD | CRUD | — | — | — | — |
| Línea del Tiempo | CRUD | CRUD | — | — | — | — |
| Categorías | CRUD | CRUD | — | — | — | — |
| Etiquetas | CRUD | CRUD | — | — | — | — |
| Tipos de contenido | CRUD | CRUD | — | — | — | — |
| Canales de comunicación | CRUD | CRUD | — | — | CRUD | — |
| Trazabilidad | Lectura | Lectura | — | — | — | Lectura |
| Usuarios | CRUD | — | — | — | — | — |

---

## 4. Endpoints por Perfil

### 4.1 Públicos (sin autenticación)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/auth/login` | Inicio de sesión |
| POST | `/api/v1/auth/refresh` | Renovación de token |
| POST | `/api/v1/auth/logout` | Cierre de sesión |
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/public/*` | Todos los endpoints públicos (publicaciones, campañas, enfermedades, timeline, búsqueda, etc.) |

### 4.2 Autenticados (cualquier rol)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/auth/me` | Perfil del operador autenticado |

### 4.3 ADMIN

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/admin/users` | Listar usuarios |
| GET | `/api/v1/admin/users/:id` | Consultar usuario |
| POST | `/api/v1/admin/users` | Crear usuario |
| PATCH | `/api/v1/admin/users/:id` | Actualizar usuario |
| DELETE | `/api/v1/admin/users/:id` | Desactivar usuario |
| * | `/api/v1/admin/*` | Todos los endpoints administrativos |

### 4.4 ADMIN + EDITOR + WRITER

| Método | Ruta | Descripción |
|---|---|---|
| * | `/api/v1/admin/contents` | CRUD de contenidos |
| * | `/api/v1/admin/contents/:contentId/media-resources` | Multimedia asociada a contenido |
| * | `/api/v1/admin/media-resources` | Gestión de recursos multimedia |
| * | `/api/v1/admin/sources` | Gestión de fuentes |

### 4.5 ADMIN + EDITOR

| Método | Ruta | Descripción |
|---|---|---|
| * | `/api/v1/admin/content-types` | Tipos de contenido |
| * | `/api/v1/admin/timeline-events` | Eventos de línea del tiempo |
| * | `/api/v1/admin/campaigns` | Campañas |
| * | `/api/v1/admin/diseases` | Enfermedades |
| * | `/api/v1/admin/categories` | Categorías |
| * | `/api/v1/admin/tags` | Etiquetas |
| * | `/api/v1/admin/communication-channels` | Canales de comunicación |

### 4.6 ADMIN + EDITOR + PUBLISHER

| Método | Ruta | Descripción |
|---|---|---|
| * | `/api/v1/admin/publications` | Gestión de publicaciones |
| * | `/api/v1/admin/publication-channels` | Distribución por canales |

### 4.7 ADMIN + EDITOR + VALIDATOR

| Método | Ruta | Descripción |
|---|---|---|
| * | `/api/v1/admin/validations` | Gestión de validaciones |

### 4.8 ADMIN + EDITOR + AUDITOR

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/v1/admin/traceability-records` | Consulta de trazabilidad |

---

## 5. Navegación (Sidebar)

| Elemento | Ruta | Visible para |
|---|---|---|
| Dashboard | `/admin` | Todos |
| Contenidos | `/admin/contents` | ADMIN, EDITOR, WRITER |
| Publicaciones | `/admin/publications` | ADMIN, EDITOR, PUBLISHER |
| Multimedia | `/admin/media` | ADMIN, EDITOR, WRITER |
| Categorías | `/admin/categories` | ADMIN, EDITOR |
| Etiquetas | `/admin/tags` | ADMIN, EDITOR |
| Tipos de contenido | `/admin/content-types` | ADMIN, EDITOR |
| Fuentes | `/admin/sources` | ADMIN, EDITOR, WRITER |
| Campañas | `/admin/campaigns` | ADMIN, EDITOR |
| Enfermedades | `/admin/diseases` | ADMIN, EDITOR |
| Línea del Tiempo | `/admin/timeline` | ADMIN, EDITOR |
| Canales | `/admin/communication-channels` | ADMIN, EDITOR |
| Usuarios | `/admin/users` | ADMIN |
| Perfil | `/admin/perfil` | Todos (autenticados) |

---

## 6. Flujo Editorial y Responsabilidades

```
Redactor (WRITER)
    │  Crea/edita contenido, fuentes, multimedia
    ▼
Validador (VALIDATOR)
    │  Revisa y aprueba/rechaza
    ▼
Publicador (PUBLISHER) / Editor (EDITOR)
    │  Publica contenido validado
    ▼
Editor (EDITOR)
    │  Gestiona distribución en canales
    ▼
Auditor (AUDITOR)
       Consulta trazabilidad
```

---

## 7. Notas Técnicas

- En el backend, la autenticación usa **JWT** con `HttpOnly` refresh token en cookie.
- Los roles se verifican mediante `RolesGuard` combinado con `JwtAuthGuard`.
- Los endpoints públicos (prefijo `/api/v1/public/`) no requieren autenticación.
- El seed de base de datos crea los 6 usuarios de prueba con contraseña `Admin123!`.
- La gestión de usuarios (CRUD) está disponible solo para el rol **ADMIN** vía `Admin / Users`.
- Todos los usuarios autenticados pueden acceder a su perfil (`GET /api/v1/auth/me` y `/admin/perfil`).
