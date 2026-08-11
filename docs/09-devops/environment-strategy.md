# Estrategia de Ambientes y Configuración

| Campo | Valor |
|-------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Estrategia de Ambientes y Configuración |
| Código | DOC-021 |
| Versión | 1.0.0 |
| Estado | Baseline |
| Fase | Phase 09 — DevOps |
| Documento anterior | `docs/09-devops/deployment-strategy.md` |
| Documento siguiente | `docs/09-devops/transfer-package.md` |
| Rol arquitectónico | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect & DevOps Architect |
| Fecha | 2026-07-09 |

---

## 1. Información del Documento

Este documento pertenece a la **Phase 09 — DevOps** del proyecto **Plataforma de Gestión, Comunicación y Educación para la Salud** para la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su responsabilidad es definir la estrategia de ambientes, configuración, variables, secretos, datos, cookies, CORS, almacenamiento, logging y bootstrap administrativo para operar el MVP de forma segura, simple y mantenible.

Este documento no implementa ambientes. En particular, no define:

- infraestructura real;
- proveedor obligatorio;
- archivos `.env` reales;
- secretos reales;
- connection strings productivos;
- usuarios administrativos reales;
- scripts de creación de usuario;
- comandos productivos definitivos;
- pipelines CI/CD;
- configuración real de dominios;
- certificados TLS reales;
- buckets, volúmenes o rutas productivas definitivas;
- migraciones ejecutadas;
- cambios en `schema.prisma`;
- implementación backend, frontend o base de datos.

La estrategia de ambientes define criterios y restricciones para que la implementación posterior pueda configurar el sistema sin comprometer seguridad, trazabilidad, datos productivos ni operación institucional.

---

## 2. Propósito

El propósito de `environment-strategy.md` es establecer cómo deberán separarse, configurarse y protegerse los ambientes del proyecto para sostener una operación controlada del MVP.

La configuración por ambiente debe proteger la capacidad central del producto:

> **Publicar información confiable.**

Un ambiente mal configurado puede afectar autenticación, cookies, CORS, conexión a base de datos, recursos multimedia, publicación pública, administración institucional, backups, trazabilidad y seguridad operativa.

Por tanto, la estrategia de ambientes deberá priorizar:

- separación entre producción y pruebas;
- configuración explícita;
- secretos fuera del repositorio;
- datos productivos protegidos;
- almacenamiento multimedia persistente;
- CORS y cookies correctos por ambiente;
- validación previa antes de producción;
- bajo costo sin sacrificar seguridad mínima.

---

## 3. Relación con la Baseline Oficial

Este documento deriva de la baseline aprobada del proyecto.

| Fuente | Relación con este documento |
|--------|------------------------------|
| Foundation | Define documentación, decisiones trazables y arquitectura antes de implementación. |
| Product | Define la capacidad central: publicar información confiable. |
| Domain | Define Conocimiento Institucional, Fuente, Validación, Content, Publicación, Trazabilidad y Memoria Institucional como conceptos que deben protegerse también desde operación. |
| Database | Define PostgreSQL y Prisma como mecanismos de persistencia subordinados al dominio. |
| API | Define las superficies `/api/v1/public`, `/api/v1/admin` y `/api/v1/auth`. |
| Authentication | Define JWT, refresh token en cookie HttpOnly, Argon2, ausencia de registro público y primer usuario mediante mecanismo técnico controlado. |
| Frontend | Define React, TypeScript, Vite y Material UI como superficies pública y administrativa. |
| Backend | Define NestJS, TypeScript, Modular Monolith, Clean Architecture y Prisma. |
| AI | Mantiene IA fuera del MVP, sin embeddings, pgvector, chatbot ni infraestructura adicional. |
| DevOps | Define estrategia inicial para MVP, proveedor-neutral, bajo costo, validación previa, backups, observabilidad mínima y despliegue controlado. |
| Deployment Strategy | Define unidades de despliegue, flujo de despliegue, criterios de proveedor, rollback, PostgreSQL y multimedia. |

Este documento no reinterpreta esas decisiones. Las aterriza al manejo de ambientes.

---

## 4. Relación con `devops.md` y `deployment-strategy.md`

`devops.md` establece la postura general de operación del MVP.

`deployment-strategy.md` define cómo deberán desplegarse las unidades operativas del sistema.

`environment-strategy.md` complementa ambos documentos definiendo cómo se configuran y separan los ambientes.

```text
DevOps Strategy
↓
Deployment Strategy
↓
Environment Strategy
↓
Implementation
```

Este documento no autoriza todavía crear ambientes reales. Define la baseline para configurarlos correctamente cuando comience la implementación.

---

## 5. Principio Rector de Ambientes

> Cada ambiente deberá estar suficientemente separado para evitar que pruebas, errores de configuración, secretos débiles, datos ficticios o recursos temporales afecten la operación productiva institucional.

La separación no implica necesariamente infraestructura costosa. Implica límites explícitos de configuración, datos, secretos, base de datos, almacenamiento, dominios, CORS, cookies y operación.

---

## 6. Modelo de Ambientes

### ENV-DEC-001 — Ambientes objetivo

La estrategia de ambientes definirá los siguientes ambientes como modelo objetivo:

```text
local
development
staging / preproduction
production
```

Para el MVP, `development` y `staging` podrán consolidarse temporalmente por costo o simplicidad, siempre que exista validación controlada antes de producción.

### 6.1 `local`

Ambiente individual utilizado por el Lead Developer para desarrollo y pruebas iniciales.

Debe permitir:

- ejecutar frontend local;
- ejecutar backend local;
- conectar a PostgreSQL local o de desarrollo;
- usar recursos multimedia locales;
- probar autenticación con configuración segura para desarrollo;
- ejecutar migraciones y pruebas sin afectar datos productivos.

No debe usar secretos productivos.

### 6.2 `development`

Ambiente de integración técnica temprana.

Puede existir como ambiente compartido si el costo y la operación lo justifican.

Debe permitir:

- validar integración frontend/backend;
- probar configuración compartida;
- verificar builds y despliegues tempranos;
- usar datos de prueba;
- aislar pruebas técnicas de producción.

Para MVP de bajo costo, puede omitirse temporalmente si `staging` cubre la validación previa.

### 6.3 `staging / preproduction`

Ambiente de validación antes de producción.

Debe aproximarse a producción en configuración operativa, sin usar datos productivos reales como práctica ordinaria.

Debe permitir validar:

- build frontend;
- build backend;
- conexión a PostgreSQL;
- variables de entorno;
- cookies;
- CORS;
- login administrativo;
- rutas públicas principales;
- rutas administrativas principales;
- publicación y consulta de contenido;
- carga o acceso a recursos multimedia;
- búsqueda básica;
- migraciones Prisma antes de producción;
- health check;
- rollback de aplicación.

Para MVP de bajo costo, staging puede ser temporal o fusionarse con development, pero no debe eliminarse la validación controlada previa a producción.

### 6.4 `production`

Ambiente público institucional.

Debe operar con:

- HTTPS;
- secretos productivos fuertes;
- CORS restringido;
- cookies seguras;
- PostgreSQL independiente;
- almacenamiento multimedia persistente;
- backups de base de datos y multimedia;
- logs adecuados;
- health check técnico;
- panel administrativo protegido;
- despliegue manual o controlado;
- migraciones explícitas y validadas;
- primer usuario administrativo creado mediante mecanismo técnico controlado.

Production no debe compartir base de datos, almacenamiento ni secretos con otros ambientes.

---

## 7. Configuración por Ambiente

### ENV-DEC-002 — Configuración independiente

Cada ambiente deberá tener configuración independiente mediante variables de entorno propias.

No deberán reutilizarse secretos productivos en ambientes no productivos.

Variables relevantes por ambiente:

```text
NODE_ENV
APP_ENV
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
FRONTEND_URL
PUBLIC_SITE_URL
ADMIN_SITE_URL
API_BASE_URL
BACKEND_URL
CORS_ALLOWED_ORIGINS
COOKIE_SECURE
COOKIE_SAME_SITE
COOKIE_DOMAIN
STORAGE_PROVIDER
STORAGE_PATH
LOG_LEVEL
```

La lista es orientativa. La definición exacta podrá ajustarse durante Implementation sin contradecir este documento.

---

## 8. Archivos `.env.example`

### ENV-DEC-003 — Ejemplos sin secretos

El repositorio deberá incluir archivos `.env.example` para documentar las variables requeridas por ambiente o componente, sin valores sensibles ni secretos reales.

Estrategias aceptables:

```text
.env.example
apps/frontend/.env.example
apps/backend/.env.example
```

La estructura exacta dependerá de la organización final del repositorio.

Los archivos `.env.example` pueden incluir valores ficticios como:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ssa_dev
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
FRONTEND_URL=http://localhost:5173
API_BASE_URL=http://localhost:3000/api/v1
```

No deberán incluir:

- secretos reales;
- credenciales productivas;
- tokens;
- passwords reales;
- connection strings reales;
- claves privadas;
- datos de acceso institucionales.

---

## 9. Gestión de Secretos

### ENV-DEC-004 — Secretos fuera del repositorio

Los secretos deberán gestionarse fuera del repositorio mediante variables de entorno no versionadas o el gestor de secretos del proveedor elegido.

Los secretos productivos no deberán compartirse, reutilizarse en otros ambientes ni documentarse en archivos del proyecto.

Secretos considerados:

```text
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
DATABASE_URL productiva
credenciales de PostgreSQL
credenciales de almacenamiento
secretos de cookies, si aplica
tokens de proveedores futuros
credenciales SMTP futuras
```

Reglas:

- no versionar secretos;
- no compartir secretos productivos por chat, documentos o commits;
- no reutilizar secretos entre ambientes;
- no usar secretos débiles en producción;
- rotar secretos si se exponen accidentalmente;
- limitar acceso a secretos productivos al personal técnico autorizado.

---

## 10. Base de Datos por Ambiente

### ENV-DEC-005 — PostgreSQL independiente por ambiente

Cada ambiente deberá utilizar una base de datos PostgreSQL independiente.

Production no deberá compartirse con local, development ni staging.

Para reducir costo:

- `local` puede usar PostgreSQL local;
- `development` puede omitirse temporalmente;
- `staging` puede usar una base económica o temporal;
- `production` debe tener su base protegida e independiente.

Riesgos que evita:

- modificación accidental de datos productivos;
- pruebas sobre contenido real;
- ejecución accidental de migraciones en producción;
- confusión entre datos de prueba y datos institucionales;
- riesgo sobre usuarios administrativos reales.

---

## 11. Datos de Prueba y Datos Productivos

### ENV-DEC-006 — Datos no productivos controlados

Los ambientes local, development y staging deberán usar datos de prueba, semillas controladas o datos anonimizados.

Las copias de datos productivos fuera de producción solo se permitirán como excepción autorizada, protegida y documentada.

Aunque el sistema no administra expedientes clínicos, producción puede contener:

- usuarios administrativos reales;
- publicaciones institucionales reales;
- fuentes;
- validaciones;
- trazabilidad;
- recursos multimedia;
- configuración operativa;
- contenido todavía no público.

No se deberá copiar producción a local, development o staging como práctica ordinaria.

Una copia excepcional deberá ser:

- autorizada;
- documentada;
- protegida;
- anonimizada cuando aplique;
- restringida en acceso;
- eliminada cuando deje de ser necesaria.

---

## 12. Cookies por Ambiente

### ENV-DEC-007 — Cookies configuradas por ambiente

La configuración de cookies deberá definirse por ambiente.

En producción, las cookies de autenticación deberán usar `HttpOnly` y `Secure`, operar bajo HTTPS y configurarse de forma compatible con la topología final de frontend/backend.

La configuración `SameSite`, `Domain` y CORS deberá validarse antes de producción.

### 12.1 Configuración conceptual para local

```text
HttpOnly = true
Secure = false
SameSite = Lax o None según separación frontend/backend local
Domain = no definir, salvo necesidad explícita
```

### 12.2 Configuración conceptual para production

```text
HttpOnly = true
Secure = true
SameSite = Lax o None según topología final
Domain = dominio institucional o subdominio autorizado
HTTPS obligatorio
```

Si frontend y backend quedan en dominios o subdominios distintos, `SameSite`, `Secure`, CORS y credentials deberán validarse en staging antes de producción.

---

## 13. CORS por Ambiente

### ENV-DEC-008 — CORS restringido por ambiente

CORS deberá configurarse por ambiente mediante una lista explícita de orígenes permitidos.

En producción no se permitirá CORS abierto ni credenciales desde orígenes no autorizados.

### 13.1 Configuración conceptual

```text
local:
permitir únicamente el origen local del frontend.
Ejemplo: http://localhost:5173

development/staging:
permitir únicamente los dominios del frontend de ese ambiente.

production:
permitir únicamente el dominio o subdominio público autorizado.
```

No deberá permitirse:

- CORS abierto con `*` en producción;
- orígenes no documentados;
- credenciales desde cualquier origen;
- configuración productiva copiada desde local sin revisión.

---

## 14. URLs Públicas y Técnicas por Ambiente

### ENV-DEC-009 — URLs explícitas por ambiente

Cada ambiente deberá declarar explícitamente las URLs públicas y técnicas del frontend, portal público, panel administrativo y backend/API según aplique.

Estas URLs deberán usarse para:

- CORS;
- cookies;
- cliente HTTP;
- enlaces públicos;
- configuración operativa;
- redirecciones;
- SEO básico;
- links compartidos;
- refresh token;
- panel administrativo.

Variables recomendadas:

```text
FRONTEND_URL
PUBLIC_SITE_URL
ADMIN_SITE_URL
API_BASE_URL
BACKEND_URL
```

Ejemplo conceptual:

```text
local:
FRONTEND_URL=http://localhost:5173
API_BASE_URL=http://localhost:3000/api/v1

production:
FRONTEND_URL=https://dominio-institucional
API_BASE_URL=https://api.dominio-institucional/api/v1
```

No se fija dominio real en este documento. La definición final dependerá del proveedor, dominio institucional y topología seleccionada.

---

## 15. Almacenamiento Multimedia por Ambiente

### ENV-DEC-010 — Almacenamiento separado por ambiente

Cada ambiente deberá utilizar almacenamiento multimedia separado.

Production no deberá compartir carpeta, volumen o bucket con local, development ni staging.

En producción, el almacenamiento deberá ser persistente y estar incluido en la estrategia de respaldo.

### 15.1 Estrategia conceptual

```text
local:
carpeta local controlada.

development:
carpeta o volumen separado, si existe el ambiente.

staging:
carpeta/volumen separado o storage temporal controlado.

production:
volumen persistente o storage externo controlado.
Nunca filesystem efímero.
```

Riesgos que evita:

- eliminación accidental de archivos productivos;
- pruebas sobre recursos reales;
- publicaciones restauradas sin archivos asociados;
- mezcla de archivos temporales con archivos institucionales;
- confusión entre multimedia real y multimedia de prueba.

Esta estrategia debe respetar la decisión de DevOps que permite almacenamiento local controlado para MVP mediante abstracción tipo `StorageProvider`, sin impedir migración futura a almacenamiento externo.

---

## 16. Logging por Ambiente

### ENV-DEC-011 — Niveles de logging diferenciados

Cada ambiente deberá definir un nivel de logging adecuado.

Producción deberá evitar logs verbose o debug permanentes.

Ningún ambiente deberá registrar secretos, tokens, contraseñas, cookies o datos sensibles.

### 16.1 Recomendación por ambiente

```text
local:
debug o verbose permitido.

development:
debug controlado.

staging:
info + warning + error.

production:
info + warning + error.
debug solo para diagnóstico temporal controlado.
```

No deberá registrarse:

- contraseñas;
- tokens;
- cookies;
- JWT completos;
- secretos;
- `DATABASE_URL`;
- headers de autorización completos;
- datos sensibles;
- información interna que facilite ataques.

---

## 17. Primer Usuario Administrativo por Ambiente

### ENV-DEC-012 — Bootstrap administrativo controlado

La creación del primer usuario administrativo deberá manejarse por ambiente mediante un mecanismo técnico controlado.

Las credenciales no deberán reutilizarse entre ambientes ni versionarse.

En producción no se permitirán usuarios hardcodeados, contraseñas por defecto ni endpoints públicos de registro.

### 17.1 Estrategia conceptual por ambiente

```text
local:
puede usar seed o script de desarrollo con credenciales ficticias.

development/staging:
puede usar seed controlado o comando administrativo con credenciales no productivas.

production:
debe usar mecanismo técnico controlado, ejecutado una sola vez o bajo autorización explícita.
```

No deberá permitirse:

- registro público;
- usuario admin hardcodeado;
- password por defecto en producción;
- credenciales versionadas;
- reutilizar el mismo password de admin entre ambientes;
- dejar habilitado un bootstrap abierto después de producción.

Esta estrategia preserva la decisión aprobada de autenticación: no existe registro público y el primer usuario administrativo se crea fuera de la API pública mediante mecanismo técnico controlado.

---

## 18. Matriz de Ambientes

| Aspecto | Local | Development | Staging / Preproduction | Production |
|---------|-------|-------------|--------------------------|------------|
| Propósito | Desarrollo individual | Integración temprana | Validación previa | Operación pública institucional |
| Obligatorio en MVP | Sí | No necesariamente | Recomendado | Sí |
| Base de datos | Local o dev | Independiente | Independiente | Independiente y protegida |
| Datos | Prueba | Prueba | Prueba o anonimizados | Productivos |
| Secretos | Locales no versionados | No productivos | No productivos | Productivos protegidos |
| CORS | Origen local | Origen dev | Origen staging | Orígenes autorizados |
| Cookies Secure | No | Según HTTPS | Según HTTPS | Sí |
| Multimedia | Carpeta local | Separado | Separado | Persistente y respaldado |
| Logging | Debug permitido | Debug controlado | Info/warn/error | Info/warn/error |
| Migraciones | Flexible | Flexible controlada | Prueba previa | Controlada explícita |
| Usuario inicial | Seed/script ficticio | Seed/script no productivo | Seed/script no productivo | Mecanismo controlado autorizado |

---

## 19. Checklist de Configuración por Ambiente

Antes de habilitar un ambiente, validar:

- [ ] Tiene `DATABASE_URL` propio.
- [ ] No usa secretos productivos salvo production.
- [ ] Tiene URLs explícitas de frontend y backend/API.
- [ ] CORS está limitado a orígenes autorizados.
- [ ] Cookies están configuradas según HTTPS, dominio y topología.
- [ ] El almacenamiento multimedia está separado.
- [ ] El almacenamiento productivo es persistente.
- [ ] Los logs no exponen secretos ni tokens.
- [ ] El nivel de logging corresponde al ambiente.
- [ ] Los datos no productivos son de prueba o anonimizados.
- [ ] El primer usuario administrativo se crea mediante mecanismo permitido.
- [ ] No existen credenciales por defecto en producción.
- [ ] `.env.example` no contiene secretos reales.
- [ ] Las migraciones no apuntan accidentalmente a producción desde ambientes no productivos.
- [ ] Staging valida configuración sensible antes de producción.

---

## 20. Límites Explícitos

Este documento no autoriza:

- crear ambientes reales;
- ejecutar despliegues;
- crear usuarios reales;
- versionar secretos;
- copiar producción a otros ambientes;
- ejecutar migraciones productivas;
- modificar `schema.prisma`;
- crear infraestructura cloud;
- definir proveedor obligatorio;
- habilitar registro público;
- usar CORS abierto en producción;
- usar filesystem efímero para multimedia productiva;
- compartir base de datos productiva;
- compartir almacenamiento productivo;
- introducir IA, embeddings, pgvector o chatbot.

Cualquier ejecución operativa deberá realizarse posteriormente durante Implementation o despliegue controlado autorizado por el Lead Developer.

---

## 21. Decisiones Cerradas

```text
ENV-DEC-001  Ambientes objetivo: local, development, staging/preproduction y production.
ENV-DEC-002  Configuración independiente por ambiente.
ENV-DEC-003  Uso de archivos .env.example sin secretos reales.
ENV-DEC-004  Secretos fuera del repositorio.
ENV-DEC-005  Base de datos independiente por ambiente.
ENV-DEC-006  Datos de prueba o anonimizados fuera de producción.
ENV-DEC-007  Cookies configuradas por ambiente.
ENV-DEC-008  CORS restringido por ambiente.
ENV-DEC-009  URLs explícitas por ambiente.
ENV-DEC-010  Almacenamiento multimedia separado por ambiente.
ENV-DEC-011  Logging diferenciado por ambiente.
ENV-DEC-012  Primer usuario administrativo controlado por ambiente.
```

---

## 22. Criterios de Aprobación

El documento puede considerarse aprobado si cumple:

- [x] Define ambientes objetivo sin exigir infraestructura costosa.
- [x] Permite consolidar development y staging temporalmente por costo.
- [x] Mantiene production separado y protegido.
- [x] Exige configuración independiente por ambiente.
- [x] Prohíbe secretos en Git.
- [x] Exige `.env.example` sin secretos reales.
- [x] Exige PostgreSQL independiente por ambiente.
- [x] Protege datos productivos.
- [x] Define cookies por ambiente.
- [x] Restringe CORS por ambiente.
- [x] Exige URLs explícitas.
- [x] Separa multimedia por ambiente.
- [x] Define logging diferenciado.
- [x] Protege bootstrap administrativo.
- [x] No introduce proveedor obligatorio.
- [x] No introduce Kubernetes.
- [x] No introduce IA, embeddings ni pgvector.
- [x] No autoriza implementación ni despliegue real.

---

## 23. Conclusión

La estrategia de ambientes protege la operación inicial del MVP mediante separación conceptual y práctica entre desarrollo, validación y producción.

El objetivo no es aumentar infraestructura ni costo. El objetivo es evitar que una mala configuración afecte información institucional, autenticación, recursos multimedia, datos productivos, trazabilidad o publicación pública.

La postura aprobada es:

```text
Ambientes simples.
Configuración explícita.
Secretos protegidos.
Producción aislada.
Validación antes de producción.
Bajo costo sin sacrificar seguridad mínima.
```

Con este documento, Phase 09 cuenta con una baseline suficiente para configurar ambientes durante Implementation sin reabrir decisiones DevOps centrales.
