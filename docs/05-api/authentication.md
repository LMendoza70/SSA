# Especificación Arquitectónica de Autenticación

| Campo | Valor |
|-------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Especificación Arquitectónica de Autenticación |
| Código | DOC-014 |
| Versión | 1.0.0 |
| Estado | Baseline |
| Fase | Phase 05 — API |
| Documento anterior | `docs/05-api/api.md` |
| Documento posterior recomendado | `docs/06-frontend/frontend.md` |
| Artefacto técnico de referencia secundaria | `prisma/schema.prisma` |
| Rol arquitectónico | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect & API Architect |
| Fecha | 2026-07-08 |

---

## 1. Propósito

Este documento define la **especificación arquitectónica de autenticación** para la API de la Plataforma de Gestión, Comunicación y Educación para la Salud de la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su propósito es establecer cómo el sistema deberá proteger la superficie administrativa inicial del MVP, identificar al operador autenticado y permitir trazabilidad operativa mínima sin introducir roles avanzados, permisos complejos, registro público ni workflow editorial multinivel.

La autenticación existe para proteger la capacidad central del producto:

> **Publicar información confiable.**

La autenticación no es el centro del dominio. Es una capacidad técnica transversal que permite operar el producto con responsabilidad institucional, proteger el panel administrativo y registrar autoría operativa.

---

## 2. Alcance del documento

Este documento sí define:

- principios de autenticación para el MVP;
- separación entre identidad operativa y responsabilidad institucional;
- superficie mínima de endpoints de autenticación;
- estrategia de sesión con access token y refresh token;
- uso esperado de cookies HttpOnly para refresh token;
- lineamientos de expiración, renovación y cierre de sesión;
- política de creación inicial del usuario administrativo;
- límites de autorización para el MVP;
- comportamiento conceptual de errores de autenticación;
- criterios de aceptación arquitectónica.

---

## 3. Fuera de alcance

Este documento no genera ni autoriza:

- controladores NestJS;
- services;
- repositories;
- guards;
- interceptors;
- pipes;
- DTOs reales;
- decorators;
- entidades TypeScript;
- OpenAPI/Swagger definitivo;
- migraciones Prisma;
- seeders ejecutados;
- frontend;
- panel administrativo;
- gestión avanzada de usuarios;
- roles múltiples;
- permisos granulares;
- políticas RBAC/ABAC definitivas;
- invitaciones de usuarios;
- recuperación automática de contraseña;
- segundo factor de autenticación;
- OAuth externo;
- SSO institucional;
- auditoría avanzada de sesión;
- workflow editorial multinivel.

---

## 4. Relación con la baseline oficial

La autenticación deriva de la baseline aprobada:

| Fuente | Aporte a autenticación |
|--------|------------------------|
| Foundation | La tecnología sirve al propósito institucional y no debe introducir complejidad prematura. |
| Product | La plataforma debe permitir publicar información confiable con responsabilidad institucional. |
| Scope | El MVP requiere administración inicial con acceso autenticado para un responsable institucional. |
| Personas | El actor administrativo del MVP se mantiene unificado como Responsable Editorial / Administrador de Plataforma. |
| Ubiquitous Language | Debe distinguirse operador autenticado de responsable institucional. |
| Domain | La responsabilidad institucional pertenece a la Jurisdicción Sanitaria, no al usuario que captura. |
| Business Rules | La publicación requiere responsabilidad institucional, trazabilidad y autoría operativa cuando corresponda. |
| Use Cases | UC-006 establece inicio de sesión administrativa como capacidad del MVP. |
| Architecture | La autenticación es capacidad transversal dentro del monolito modular, no parte del núcleo de dominio. |
| API | `api.md` define `/api/v1/auth/*` como superficie mínima y separa detalle de sesión en este documento. |
| Database | `User` representa autoría operativa, no responsabilidad institucional completa ni sistema avanzado de identidad. |

Este documento no modifica el dominio ni amplía el alcance del MVP. Delimita la autenticación mínima necesaria para operar la API administrativa.

---

## 5. Principio rector de autenticación

> La autenticación debe proteger la operación administrativa y permitir autoría operativa trazable sin convertir el MVP en un sistema avanzado de gestión de identidades.

La autenticación no deberá sustituir reglas del dominio. Un usuario autenticado no queda autorizado automáticamente para publicar información si las reglas de publicación, validación, vigencia o trazabilidad no se cumplen.

---

## 6. Decisiones arquitectónicas de autenticación

### AUTH-DEC-001 — Sin registro público

El MVP no tendrá registro público de usuarios.

No existirá endpoint público como:

```text
POST /api/v1/auth/register
```

Justificación: la plataforma no es una red social, no tiene cuentas ciudadanas en el MVP y la administración estará restringida a operación institucional.

---

### AUTH-DEC-002 — Primer usuario administrativo fuera de la API pública

La creación del primer usuario administrativo se realizará mediante un mecanismo controlado fuera de la API pública.

Mecanismos aceptables en implementación posterior:

- seed técnico controlado;
- script interno de inicialización;
- inserción administrativa durante despliegue;
- procedimiento técnico documentado para ambiente inicial.

No se expondrá endpoint de bootstrap temporal ni permanente durante el MVP.

Justificación: reduce superficie de ataque, protege el alcance y evita introducir gestión avanzada de usuarios antes de tiempo.

---

### AUTH-DEC-003 — Actor administrativo unificado en MVP

El MVP utilizará un actor administrativo operativo unificado:

```text
Responsable Editorial / Administrador de Plataforma
```

Este actor puede operar capacidades administrativas, pero no sustituye la responsabilidad institucional de la Jurisdicción Sanitaria.

La separación futura entre roles como Responsable Editorial, Administrador General, Validador, Publicador o Supervisor queda fuera del MVP.

---

### AUTH-DEC-004 — JWT para access token

El access token se representará mediante JWT.

Uso conceptual:

- identificar al usuario autenticado;
- autorizar acceso a endpoints administrativos;
- evitar consulta persistente para cada operación cuando no sea necesario;
- mantener sesiones cortas y renovables.

El JWT no deberá contener información sensible ni reglas de negocio complejas.

---

### AUTH-DEC-005 — Refresh token con cookie HttpOnly

La sesión renovable usará refresh token almacenado preferentemente en cookie HttpOnly, Secure y SameSite adecuado al entorno.

Justificación:

- reduce exposición del refresh token frente a JavaScript del navegador;
- permite renovación de sesión para panel administrativo;
- mantiene separación entre token corto de acceso y credencial de renovación.

---

### AUTH-DEC-006 — Argon2 para hash de contraseña

Las contraseñas se almacenarán usando Argon2.

La contraseña nunca deberá guardarse en texto plano, registrarse en logs ni devolverse en respuestas de API.

---

### AUTH-DEC-007 — Refresh token rotativo recomendado

La renovación de sesión deberá preferir refresh token rotativo.

Comportamiento conceptual:

1. El usuario inicia sesión.
2. El sistema emite access token y refresh token.
3. Al renovar, el refresh token anterior deja de ser válido.
4. El sistema emite un nuevo access token y un nuevo refresh token.
5. Si se detecta reutilización de refresh token previamente invalidado, la sesión deberá considerarse comprometida.

Esta decisión puede implementarse de forma simple en MVP, pero debe quedar preparada desde el diseño.

---

### AUTH-DEC-008 — Cierre de sesión invalida refresh token

`logout` deberá invalidar el refresh token activo.

La expiración natural del access token no requiere persistencia adicional. El refresh token sí debe poder invalidarse para cerrar sesión de forma efectiva.

---

### AUTH-DEC-009 — Usuario inactivo no puede operar administración

Un usuario con `isActive = false` no deberá iniciar sesión ni renovar sesión.

Si el usuario se desactiva mientras una sesión está vigente, la renovación deberá fallar y los endpoints administrativos deberán rechazar la operación en cuanto el sistema detecte el estado inactivo.

---

### AUTH-DEC-010 — Autenticación no equivale a responsabilidad institucional

El usuario autenticado representa autoría operativa.

La responsabilidad institucional de publicaciones, validaciones y trazabilidad sigue perteneciendo a la Jurisdicción Sanitaria o a la responsabilidad institucional explícita definida por el dominio.

Esta separación debe preservarse en API, backend, trazabilidad y frontend administrativo.

---

### AUTH-DEC-011 — Sin permisos avanzados en MVP

En el MVP, la autorización será mínima:

```text
Público no autenticado
↓
Usuario administrativo autenticado
```

No se diseñarán roles granulares ni permisos por recurso en este documento.

La arquitectura no deberá impedir una evolución posterior hacia RBAC o permisos por capacidad, pero no deberá implementarla prematuramente.

---

### AUTH-DEC-012 — La API pública no requiere autenticación

Los endpoints bajo:

```text
/api/v1/public/*
```

serán consultables sin autenticación, siempre que expongan únicamente información publicada, vigente, disponible o históricamente contextualizada según las reglas del dominio.

La falta de autenticación pública no significa que la información pública ignore reglas de publicación, vigencia o responsabilidad institucional.

---

## 7. Modelo conceptual de sesión

La sesión administrativa se compone de:

| Elemento | Propósito | Naturaleza |
|----------|-----------|------------|
| Usuario | Identidad operativa que accede al panel administrativo. | Persistente. |
| Contraseña | Secreto de autenticación del usuario. | Nunca se almacena en texto plano. |
| Access Token | Credencial corta para acceder a endpoints protegidos. | Temporal. |
| Refresh Token | Credencial renovable para obtener nuevos access tokens. | Persistente o verificable para invalidación. |
| Cookie HttpOnly | Transporte recomendado del refresh token en navegador. | Técnica de seguridad. |
| Estado activo del usuario | Condición mínima para operar administración. | Persistente. |

---

## 8. Endpoints de autenticación

Base path:

```text
/api/v1/auth
```

### 8.1 Catálogo preliminar

| Método | Ruta | Propósito | Actor | Resultado conceptual |
|--------|------|-----------|-------|----------------------|
| POST | `/api/v1/auth/login` | Iniciar sesión administrativa. | Responsable Editorial / Administrador | Access token emitido y refresh token establecido. |
| POST | `/api/v1/auth/refresh` | Renovar sesión administrativa. | Responsable Editorial / Administrador | Nuevo access token y refresh token rotado. |
| POST | `/api/v1/auth/logout` | Cerrar sesión administrativa. | Responsable Editorial / Administrador | Refresh token invalidado. |
| GET | `/api/v1/auth/me` | Consultar identidad operativa actual. | Responsable Editorial / Administrador | Usuario autenticado actual. |

No se incluyen endpoints de registro, bootstrap, invitación, recuperación de contraseña ni administración avanzada de usuarios en el MVP.

---

## 9. Contratos conceptuales de endpoints

Los contratos siguientes son conceptuales. No son DTOs reales, clases, validadores ni implementación.

### 9.1 `POST /api/v1/auth/login`

**Propósito**

Permitir que un operador administrativo autorizado inicie sesión.

**Entrada conceptual**

```text
email
password
```

**Comportamiento esperado**

1. Validar credenciales.
2. Confirmar que el usuario existe.
3. Confirmar que el usuario está activo.
4. Verificar contraseña con Argon2.
5. Emitir access token de corta duración.
6. Establecer refresh token en cookie HttpOnly.
7. Devolver identidad operativa mínima.

**Respuesta conceptual exitosa**

```text
accessToken
user: id, email, displayName
```

La respuesta no debe incluir contraseña, hash de contraseña, refresh token en cuerpo ni información sensible.

---

### 9.2 `POST /api/v1/auth/refresh`

**Propósito**

Renovar sesión administrativa sin requerir contraseña en cada solicitud.

**Entrada conceptual**

```text
refresh token desde cookie HttpOnly
```

**Comportamiento esperado**

1. Leer refresh token desde cookie HttpOnly.
2. Validar integridad y vigencia.
3. Confirmar que el usuario asociado sigue activo.
4. Invalidar refresh token anterior si se usa rotación.
5. Emitir nuevo access token.
6. Establecer nuevo refresh token.
7. Devolver identidad operativa mínima.

**Respuesta conceptual exitosa**

```text
accessToken
user: id, email, displayName
```

---

### 9.3 `POST /api/v1/auth/logout`

**Propósito**

Cerrar sesión administrativa de forma efectiva.

**Entrada conceptual**

```text
refresh token desde cookie HttpOnly
```

**Comportamiento esperado**

1. Identificar refresh token activo si existe.
2. Invalidar refresh token.
3. Limpiar cookie de sesión renovable.
4. Responder sin exponer información sensible.

**Respuesta conceptual exitosa**

```text
session closed
```

El endpoint debe ser seguro ante llamadas repetidas. Si no existe sesión activa, puede responder de forma idempotente sin revelar detalles innecesarios.

---

### 9.4 `GET /api/v1/auth/me`

**Propósito**

Permitir al panel administrativo conocer la identidad operativa actual.

**Requiere**

```text
access token válido
```

**Respuesta conceptual exitosa**

```text
id
email
displayName
isActive
```

No deberá devolver hash de contraseña, refresh tokens, metadatos internos sensibles ni permisos avanzados no existentes en el MVP.

---

## 10. Superficie protegida

Todo endpoint bajo:

```text
/api/v1/admin/*
```

deberá requerir autenticación administrativa válida.

Ejemplos:

```text
/api/v1/admin/contents
/api/v1/admin/publications
/api/v1/admin/sources
/api/v1/admin/validations
/api/v1/admin/campaigns
/api/v1/admin/diseases
/api/v1/admin/media-resources
/api/v1/admin/timeline-events
/api/v1/admin/traceability-records
```

La autenticación válida es condición necesaria, pero no suficiente para ejecutar operaciones que violen reglas de negocio.

---

## 11. Superficie pública

Los endpoints bajo:

```text
/api/v1/public/*
```

no requieren autenticación administrativa.

La API pública solo deberá exponer:

- publicaciones disponibles para consulta;
- campañas consultables;
- enfermedades consultables;
- línea del tiempo pública;
- clasificación pública;
- recursos públicos asociados;
- búsqueda básica pública.

No deberá exponer:

- borradores;
- contenido preparado pero no publicado;
- validaciones internas;
- trazabilidad administrativa;
- usuarios;
- datos de sesión;
- estados editoriales internos innecesarios;
- información retirada sin contexto público permitido.

---

## 12. Expiración de tokens

Los tiempos exactos podrán definirse en implementación, pero la arquitectura recomienda:

| Token | Duración recomendada | Justificación |
|-------|----------------------|---------------|
| Access token | Corta | Limita impacto de exposición accidental. |
| Refresh token | Mayor que access token | Permite sesión administrativa usable. |
| Refresh token rotativo | Recomendado | Reduce riesgo de reutilización indebida. |

Los valores concretos deben quedar parametrizados por configuración de entorno, no codificados rígidamente en la lógica de dominio.

---

## 13. Cookies y transporte

Para el refresh token se recomienda cookie con atributos:

```text
HttpOnly
Secure
SameSite
Path restringido cuando aplique
Max-Age / Expires coherente con expiración del refresh token
```

Criterios:

- `HttpOnly` protege contra acceso directo desde JavaScript.
- `Secure` debe usarse en ambientes HTTPS.
- `SameSite` deberá configurarse según la relación real entre frontend y backend.
- En desarrollo local puede requerirse configuración diferenciada, sin debilitar producción.

El access token podrá entregarse en cuerpo de respuesta para que el cliente administrativo lo use en encabezado `Authorization: Bearer`, o manejarse mediante estrategia equivalente definida en implementación. La decisión final deberá considerar seguridad, simplicidad del frontend y despliegue real.

---

## 14. Errores conceptuales de autenticación

| Código HTTP | Caso conceptual | Criterio |
|-------------|-----------------|----------|
| 400 | Solicitud mal formada. | Campos requeridos ausentes o formato inválido. |
| 401 | No autenticado. | Credenciales inválidas, token ausente, expirado o inválido. |
| 403 | Autenticado sin autorización suficiente. | Reservado para evolución con permisos; uso mínimo en MVP. |
| 429 | Demasiados intentos. | Protección recomendada contra fuerza bruta. |
| 500 | Error interno. | No debe revelar secretos ni detalles sensibles. |

Para login, la API no deberá distinguir públicamente entre:

```text
usuario inexistente
contraseña incorrecta
usuario no autorizado
```

La respuesta deberá ser genérica para evitar enumeración de cuentas.

---

## 15. Seguridad mínima requerida

La implementación posterior deberá considerar como mínimo:

- hash de contraseñas con Argon2;
- validación de formato de email;
- contraseñas no expuestas en logs;
- rate limiting en login;
- respuestas genéricas ante credenciales inválidas;
- refresh token no expuesto en cuerpo de respuesta;
- cookies HttpOnly para refresh token;
- invalidación de refresh token en logout;
- expiración de tokens;
- verificación de usuario activo;
- protección de `/admin/*`;
- configuración segura por entorno;
- no registrar tokens completos en logs;
- no devolver datos sensibles en `/auth/me`.

---

## 16. Relación con trazabilidad institucional

La autenticación permite identificar autoría operativa.

Ejemplo conceptual:

```text
Usuario autenticado ejecuta operación administrativa
↓
La aplicación valida reglas del dominio
↓
La operación modifica Content, Publication, Source, Validation u otra entidad
↓
Se registra TraceabilityRecord cuando corresponde
```

La trazabilidad no debe decir simplemente que un usuario actuó. Debe preservar contexto institucional mínimo cuando la operación sea relevante para confiabilidad, publicación, distribución, retiro, archivo o actualización.

El usuario autenticado responde a:

```text
¿Quién operó?
```

La responsabilidad institucional responde a:

```text
¿Bajo qué responsabilidad institucional se actuó?
```

Ambas dimensiones son distintas.

---

## 17. Relación con `User` en persistencia

El modelo `User` representa identidad operativa mínima.

Debe permitir:

- identificar operador autenticado;
- asociar acciones administrativas;
- registrar autoría operativa en Content cuando corresponda;
- asociar validaciones o trazabilidad según diseño aprobado;
- desactivar acceso administrativo mediante `isActive`.

No debe interpretarse como:

- ciudadanía;
- cuenta pública;
- profesional de salud como perfil clínico;
- responsable institucional definitivo;
- sistema de recursos humanos;
- sistema de permisos avanzado.

---

## 18. Administración de usuarios en MVP

El MVP no incluye gestión completa de usuarios.

No se diseñan endpoints para:

```text
GET /api/v1/admin/users
POST /api/v1/admin/users
PATCH /api/v1/admin/users/{id}
DELETE /api/v1/admin/users/{id}
```

La existencia del modelo `User` en persistencia no obliga a exponer CRUD administrativo de usuarios durante el MVP.

La gestión de usuarios podrá evaluarse en fases posteriores cuando exista necesidad real de múltiples operadores, roles, permisos, invitaciones, recuperación de acceso o separación de responsabilidades.

---

## 19. Antipatrones prohibidos

| Antipatrón | Motivo |
|-----------|--------|
| Registro público de administradores | Abre superficie innecesaria y contradice administración inicial controlada. |
| Endpoint de bootstrap permanente | Riesgo crítico de seguridad si queda expuesto. |
| Publicar solo porque el usuario está autenticado | La publicación requiere reglas de dominio, validación y responsabilidad institucional. |
| Guardar contraseñas en texto plano | Riesgo de seguridad inaceptable. |
| Devolver refresh token en JSON | Aumenta exposición en cliente y logs. |
| Usar JWT como almacenamiento de reglas de negocio | Acopla sesión con dominio y dificulta evolución. |
| Exponer estados internos en API pública | Puede confundir a la población y filtrar operación administrativa. |
| Crear RBAC complejo en MVP | Sobrediseño fuera de alcance. |
| Confundir usuario con responsable institucional | Rompe trazabilidad y responsabilidad del dominio. |

---

## 20. Evolución futura permitida

Este diseño no impide incorporar posteriormente:

- múltiples usuarios administrativos;
- roles institucionales;
- permisos por capacidad;
- invitaciones;
- recuperación de contraseña;
- segundo factor de autenticación;
- SSO institucional;
- sesiones por dispositivo;
- revocación global de sesiones;
- auditoría avanzada de acceso;
- separación entre Responsable Editorial, Validador, Publicador y Administrador General.

Estas capacidades quedan explícitamente fuera del MVP y deberán diseñarse en documentos posteriores si el producto las requiere.

---

## 21. Criterios de aceptación arquitectónica

La autenticación del MVP será aceptable si cumple:

- protege todos los endpoints `/api/v1/admin/*`;
- no exige autenticación para consulta pública;
- no expone registro público;
- no expone bootstrap público;
- permite login, refresh, logout y consulta de identidad actual;
- usa hash seguro de contraseña con Argon2;
- usa access token de corta duración;
- usa refresh token renovable, preferentemente en cookie HttpOnly;
- permite invalidar sesión en logout;
- verifica usuario activo;
- no confunde usuario operativo con responsabilidad institucional;
- no introduce roles avanzados ni permisos complejos;
- no permite que autenticación sustituya reglas de publicación, validación, vigencia o trazabilidad;
- mantiene el diseño preparado para evolución sin sobreingeniería.

---

## 22. Decisiones pendientes fuera de este documento

Las siguientes decisiones podrán resolverse en implementación o documentos posteriores:

| Decisión | Momento recomendado |
|----------|---------------------|
| Duración exacta del access token | Backend implementation. |
| Duración exacta del refresh token | Backend implementation. |
| Estrategia concreta de almacenamiento de refresh tokens | Backend implementation. |
| SameSite exacto según despliegue frontend/backend | DevOps / Backend. |
| Política de rate limiting | Backend / DevOps. |
| Recuperación de contraseña | Fase futura, si se requiere. |
| Roles y permisos | Fase futura, fuera del MVP. |
| Gestión administrativa de usuarios | Fase futura, fuera del MVP. |

---

## 23. Dictamen final

`docs/05-api/authentication.md` queda establecido como especificación arquitectónica baseline de autenticación para el MVP.

La autenticación queda delimitada como capacidad transversal mínima para proteger la administración institucional, identificar autoría operativa y sostener trazabilidad, sin ampliar el MVP hacia gestión avanzada de identidades.

```text
docs/05-api/authentication.md ✅ Baseline
```

Con este documento, Phase 05 — API cuenta con:

```text
docs/05-api/api.md              ✅ Baseline
docs/05-api/authentication.md   ✅ Baseline
```
