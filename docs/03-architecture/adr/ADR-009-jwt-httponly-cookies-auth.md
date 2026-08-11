# ADR-009: JWT + HttpOnly Cookies Authentication

**Estado:** Aceptada (actualizada 2026-07-16).

## Contexto

El panel administrativo requiere autenticación segura. Se necesita un mecanismo que
permita sesiones administrativas sin mantener estado en servidor, protegiendo contra
ataques XSS y CSRF. El stack tecnológico aprobado incluye JWT y NestJS.

## Decisión

Implementar autenticación mediante **doble token**:

1. **Access token (JWT)**: corta duración (15 min), enviado en `Authorization: Bearer`
   para cada solicitud a endpoints protegidos.
2. **Refresh token (JWT)**: larga duración (7 días), almacenado en cookie **HttpOnly**,
   **Secure** (en producción), **SameSite=Strict**.

Flujo:
- `POST /auth/login` → valida credenciales → devuelve access token en body +
  refresh token con `jti` (JWT ID) en cookie.
- `POST /auth/refresh` → lee refresh token de cookie → verifica `jti` contra
  blacklist → invalida `jti` anterior (rotación) → devuelve nuevo access token
  + nuevo refresh token con nuevo `jti` en cookie.
- `POST /auth/logout` → extrae `jti` del refresh token → agrega a blacklist →
  limpia cookie de refresh.

Contraseñas hasheadas con **Argon2** (configuración por defecto).

## Justificación

- HttpOnly impide acceso al token desde JavaScript (protección XSS).
- Secure + SameSite=Strict mitiga ataques CSRF.
- Doble token permite renovación de sesión sin reautenticación frecuente.
- Sin estado en servidor (stateless JWT) facilita escalabilidad horizontal futura.
- Argon2 es el estándar actual para hash de contraseñas (resistente a GPU/ASIC).

## Consecuencias

- La cookie `refresh_token` debe configurarse en el controlador con opciones de
  seguridad condicionales por ambiente.
- El cliente (React) debe gestionar el access token en memoria, no en localStorage.
- El endpoint `/auth/refresh` debe aplicar rate limiting más estricto que otros endpoints.
- Los tests de integración requieren cookie-parser para leer/establecer cookies.
- Se introdujo `TokenBlacklistService` (invocable) que mantiene un mapa en memoria
  de `jti` revocados con su expiración. La limpieza de entradas expiradas ocurre
  bajo demanda en cada consulta (`has()`).
- El refresh token incluye `jti` (UUID v4) en su payload para identificación única.
- La rotación invalida el `jti` anterior antes de emitir uno nuevo.
- En MVP no se implementa detección de reuso de refresh token (sesión comprometida).
  Queda como mejora documentada para fase posterior.

## Riesgos

- Si el refresh token es interceptado (p. ej. tráfico HTTP no seguro), permite
  acceso prolongado.
- Access token en memoria se pierde al recargar la página (requiere refresh).
- El blacklist en memoria se pierde al reiniciar el servidor, permitiendo reuso
  de refresh tokens revocados hasta su expiración natural.
- No se implementa detección de reuso de refresh token (sesión comprometida) en MVP.

## Mitigación

- HTTPS obligatorio en producción (certificado SSL).
- TTL corto del access token (15 min) limita ventana de exposición.
- Refresh token rotativo implementado: cada uso invalida el token anterior.
- Logout invalida el refresh token activo mediante blacklist.
- El blacklist en memoria es aceptable para MVP monoproceso; en el futuro
  puede migrarse a Redis o base de datos compartida.
- Detección de reuso de refresh token pospuesta: requiere almacenar el `jti`
  del último refresh token válido por usuario y comparar en cada rotación.
  Fecha de revisión sugerida: 2026-10-16 (90 días).

## Alternativas descartadas

- Sesiones con estado en servidor (express-session): requiere almacenamiento compartido
  para escalar horizontalmente.
- API keys: no permiten renovación ni cierre de sesión granular.
- OAuth2 completo: sobreingeniería para un solo cliente administrativo interno.
- Almacenar access token en localStorage: vulnerable a XSS.
