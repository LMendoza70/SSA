# ADR-009: JWT + HttpOnly Cookies Authentication

**Estado:** Aceptada.

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
  refresh token en cookie.
- `POST /auth/refresh` → lee refresh token de cookie → verifica → devuelve nuevo
  access token.
- `POST /auth/logout` → limpia cookie de refresh.

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

## Riesgos

- Si el refresh token es interceptado (p. ej. tráfico HTTP no seguro), permite
  acceso prolongado.
- Access token en memoria se pierde al recargar la página (requiere refresh).

## Mitigación

- HTTPS obligatorio en producción (certificado SSL).
- TTL corto del access token (15 min) limita ventana de exposición.
- Refresh token renovable: al usarse, se puede rotar el token (futuro).

## Alternativas descartadas

- Sesiones con estado en servidor (express-session): requiere almacenamiento compartido
  para escalar horizontalmente.
- API keys: no permiten renovación ni cierre de sesión granular.
- OAuth2 completo: sobreingeniería para un solo cliente administrativo interno.
- Almacenar access token en localStorage: vulnerable a XSS.
