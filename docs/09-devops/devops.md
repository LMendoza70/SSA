# Estrategia DevOps

| Campo | Valor |
|-------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Estrategia DevOps |
| Código | DOC-019 |
| Versión | 1.0.0 |
| Estado | Draft corregido para revisión |
| Fase | Phase 09 — DevOps |
| Documento anterior | `docs/08-ai/ai.md` |
| Documento siguiente | `docs/09-devops/deployment-strategy.md` |
| Rol arquitectónico | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect & DevOps Architect |
| Fecha | 2026-07-09 |

---

## 1. Información del Documento

Este documento pertenece a la **Phase 09 — DevOps** del proyecto **Plataforma de Gestión, Comunicación y Educación para la Salud** para la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su responsabilidad es definir la estrategia DevOps inicial para preparar el despliegue, operación, configuración, seguridad básica, respaldo, observabilidad y continuidad técnica del MVP.

Este documento no implementa infraestructura. En particular, no define:

- proveedor obligatorio de hosting;
- scripts de despliegue productivos;
- pipelines completos de CI/CD;
- configuración real de servidores;
- contenedores productivos definitivos;
- infraestructura como código;
- Kubernetes;
- alta disponibilidad avanzada;
- autoescalado;
- monitoreo empresarial;
- política formal de respuesta a incidentes;
- acuerdos de nivel de servicio formales;
- costos definitivos;
- dominio público definitivo;
- migraciones ejecutadas;
- cambios en `schema.prisma`;
- implementación backend, frontend o base de datos.

La Phase 09 prepara la operación inicial del MVP. No sustituye la fase de Implementation, no ejecuta despliegues y no autoriza crear infraestructura productiva sin validación posterior del Lead Developer.

---

## 2. Propósito

El propósito de `devops.md` es establecer cómo deberá prepararse el producto para desplegarse, operarse y mantenerse de forma segura, simple, recuperable y consistente con la baseline aprobada.

La estrategia DevOps debe proteger la capacidad central del producto:

> **Publicar información confiable.**

La operación técnica no es un fin por sí misma. Su función es permitir que el portal público, el panel administrativo, la API, la base de datos, los recursos multimedia, la autenticación y la publicación institucional funcionen de manera confiable, segura y recuperable.

---

## 3. Relación con la Baseline Oficial

Este documento deriva de la baseline aprobada:

| Fuente | Relación con este documento |
|--------|------------------------------|
| Foundation | Define documentación, decisiones trazables y arquitectura antes que implementación. |
| Product | Define la capacidad central: publicar información confiable. |
| Product Principles | Prioriza seguridad institucional, confiabilidad, claridad, mantenibilidad y tecnología como medio. |
| Domain | Define el Knowledge Lifecycle y la necesidad de proteger Conocimiento Institucional, Fuente, Validación, Content, Publicación, Trazabilidad y Memoria Institucional. |
| Database | Define PostgreSQL y Prisma como mecanismos de persistencia subordinados al dominio. |
| API | Define separación `/api/v1/public`, `/api/v1/admin` y `/api/v1/auth`. |
| Authentication | Define JWT, refresh token en cookie HttpOnly, Argon2 y ausencia de registro público. |
| Frontend | Define React, TypeScript, Vite y Material UI como superficie pública y administrativa. |
| Backend | Define NestJS, TypeScript, Modular Monolith, Clean Architecture y Prisma como infraestructura. |
| AI | Mantiene IA fuera del MVP, sin embeddings, pgvector, chatbot ni servicios adicionales. |

DevOps no debe reinterpretar estas decisiones. Debe crear condiciones operativas para respetarlas.

---

## 4. Alcance de DevOps en MVP

Phase 09 documenta una estrategia inicial de operación y despliegue para el MVP.

Incluye:

- estrategia operativa inicial;
- criterios de proveedor e infraestructura;
- separación conceptual de componentes;
- ambientes;
- variables de entorno y secretos;
- validación antes de producción;
- migraciones controladas;
- backups;
- almacenamiento multimedia;
- CI básico;
- despliegue controlado;
- rollback inicial;
- observabilidad mínima;
- health check;
- seguridad operativa inicial;
- HTTPS, dominio y CORS;
- manejo de datos por ambiente;
- creación inicial del usuario administrativo;
- límites explícitos para evitar sobreingeniería.

No incluye:

- arquitectura DevOps empresarial;
- Kubernetes;
- Terraform;
- autoescalado avanzado;
- despliegue multi-región;
- alta disponibilidad avanzada;
- APM avanzado;
- SIEM;
- WAF avanzado;
- rotación automática sofisticada de secretos;
- infraestructura definitiva por proveedor;
- integración IA;
- pgvector;
- vector database;
- automatización editorial.

---

## 5. Principio Rector DevOps

> La estrategia DevOps debe permitir operar el MVP con seguridad, confiabilidad, recuperabilidad y bajo costo, sin sacrificar funcionalidades esenciales ni contaminar la arquitectura con sobreingeniería prematura.

Este principio implica que cada decisión operativa debe evaluarse con las siguientes preguntas:

- ¿Protege la disponibilidad del portal público?
- ¿Protege el acceso administrativo?
- ¿Protege la base de datos institucional?
- ¿Protege los recursos multimedia asociados a publicaciones?
- ¿Facilita recuperar el sistema ante fallos?
- ¿Evita exposición de secretos?
- ¿Mantiene bajo costo sin comprometer el MVP?
- ¿Puede evolucionar sin rehacer el producto?

---

## 6. Prioridades DevOps

Las decisiones DevOps deberán seguir este orden de prioridad:

1. Seguridad operativa.
2. Confiabilidad del servicio.
3. Protección de datos y conocimiento institucional.
4. Recuperabilidad.
5. Mantenibilidad.
6. Simplicidad operativa.
7. Costo razonable.
8. Automatización.

La automatización no deberá superar seguridad, confiabilidad ni recuperabilidad.

---

## 7. Decisiones DevOps Aprobadas para el Documento

### DEVOPS-DEC-001 — Estrategia inicial para MVP

Phase 09 DevOps documentará una estrategia inicial, segura y mantenible para operar y desplegar el MVP, sin diseñar una arquitectura DevOps empresarial completa.

**Justificación:** el proyecto aún no requiere operación compleja. DevOps debe preparar despliegue, seguridad básica, ambientes, backups, variables y operación mínima viable.

---

### DEVOPS-DEC-002 — Proveedor-neutral y bajo costo

Phase 09 DevOps no obligará un proveedor específico. El documento definirá criterios de selección y mantendrá la estrategia compatible con distintos proveedores o infraestructura institucional.

Para desplegar el MVP se preferirá la alternativa de menor costo posible, siempre que no sacrifique funcionalidades requeridas del MVP, seguridad básica, disponibilidad mínima, respaldo de datos ni mantenibilidad operativa.

**Justificación:** aún no existe proveedor aprobado. El documento debe guiar selección sin bloquear opciones futuras.

---

### DEVOPS-DEC-003 — Separación conceptual de componentes

El despliegue del MVP separará conceptualmente frontend, backend y base de datos, sin exigir proveedores separados ni infraestructura distribuida avanzada.

**Componentes operativos:**

```text
Frontend React/Vite
Backend NestJS
Base de datos PostgreSQL
```

**Justificación:** cada componente tiene ciclo de build, configuración, despliegue, logs, backups y riesgos distintos.

---

### DEVOPS-DEC-004 — Docker recomendado, no obligatorio

Docker será recomendado para consistencia local, portabilidad y evolución futura, pero no será requisito obligatorio para desplegar el MVP si el proveedor elegido permite una operación segura y funcional sin contenedores.

El Lead Developer tiene experiencia inicial con Docker, por lo que la estrategia DevOps no deberá depender de una operación avanzada de contenedores para entregar el MVP.

**Justificación:** Docker ayuda, pero hacerlo obligatorio puede elevar riesgo y complejidad inicial.

---

### DEVOPS-DEC-005 — Kubernetes fuera del MVP

Kubernetes, orquestación avanzada, despliegue multi-nodo y arquitectura distribuida quedan fuera del MVP. La operación inicial deberá privilegiar simplicidad, bajo costo y mantenibilidad.

**Justificación:** el backend inicia como Modular Monolith. Kubernetes sería sobreingeniería para la primera versión.

---

### DEVOPS-DEC-006 — Ambientes objetivo

La estrategia DevOps contemplará los ambientes local, development, staging/preproduction y production como modelo objetivo. Para el MVP, development y staging podrán consolidarse temporalmente si se requiere reducir costo, siempre que exista al menos una validación controlada antes de producción.

**Ambientes:**

```text
local       → entorno en máquina de desarrollo.
development → integración temprana o ambiente compartido.
staging     → validación previa a producción.
production  → entorno público institucional.
```

---

### DEVOPS-DEC-007 — Validación antes de producción

Todo cambio sensible deberá validarse antes de producción en un entorno controlado. Para reducir costo, staging podrá ser temporal o fusionarse con development, pero no se deberá desplegar a producción sin validación previa explícita.

**Cambios sensibles:**

- backend;
- base de datos;
- autenticación;
- variables de entorno;
- configuración de dominio;
- almacenamiento;
- publicación/consulta de contenido;
- migraciones Prisma;
- seguridad operativa.

---

### DEVOPS-DEC-008 — Variables de entorno y secretos

La configuración sensible se gestionará mediante variables de entorno por ambiente. Los secretos reales no deberán versionarse en Git. El repositorio deberá incluir archivos `.env.example` sin valores sensibles para facilitar configuración local y despliegue.

**Secretos o configuración sensible:**

- `DATABASE_URL`;
- secretos JWT;
- secretos de refresh token;
- configuración de cookies;
- credenciales de base de datos;
- credenciales de almacenamiento;
- tokens de proveedores futuros;
- claves SMTP futuras;
- claves de servicios externos.

---

### DEVOPS-DEC-009 — Migraciones Prisma controladas

Las migraciones Prisma en producción deberán ejecutarse de forma controlada, explícita y validada. No deberán correr automáticamente en cada despliegue productivo. Toda migración relevante deberá probarse previamente en un entorno controlado y contar con respaldo o estrategia de mitigación.

**Diferencia por ambiente:**

```text
local/development → operación flexible.
staging           → prueba de migraciones antes de producción.
production        → ejecución explícita y controlada.
```

---

### DEVOPS-DEC-010 — Backups PostgreSQL

Producción deberá contar con backups automáticos diarios de PostgreSQL. Para el MVP se define una retención mínima de 14 días, con 30 días como objetivo recomendado si el costo lo permite. Las restauraciones deberán probarse periódicamente y los backups relevantes deberán verificarse antes de migraciones productivas.

---

### DEVOPS-DEC-011 — Backups de recursos multimedia

La estrategia de respaldo deberá incluir tanto PostgreSQL como recursos multimedia administrados por la plataforma. Los backups deberán preservar la consistencia lógica entre publicaciones, metadatos y archivos asociados.

---

### DEVOPS-DEC-012 — Almacenamiento multimedia inicial

El MVP podrá iniciar con almacenamiento local controlado de recursos multimedia si reduce costo y complejidad, siempre que se use una abstracción tipo `StorageProvider`, se garantice persistencia de archivos en producción, se incluya respaldo de recursos y no se impida migrar a almacenamiento externo en el futuro.

---

### DEVOPS-DEC-013 — CI básico y CD controlado

El MVP deberá contar con CI básico para validar calidad técnica mínima antes de despliegue. El despliegue a producción será inicialmente manual o controlado, no automático por cada merge. Staging podrá automatizarse si no aumenta costo ni complejidad.

**CI básico recomendado:**

- lint;
- typecheck;
- build frontend;
- build backend;
- validación Prisma sin migrar producción automáticamente;
- tests cuando existan.

---

### DEVOPS-DEC-014 — Rollback inicial

La estrategia inicial de rollback priorizará redeploy de una versión anterior de la aplicación. La restauración de base de datos o multimedia desde backup será excepcional, controlada y documentada, debido al riesgo de pérdida de contenido, trazabilidad o cambios institucionales posteriores al respaldo.

---

### DEVOPS-DEC-015 — Observabilidad mínima

El MVP deberá contar con observabilidad mínima basada en logs de aplicación, logs de errores, monitoreo básico de disponibilidad y revisión operativa manual. Herramientas avanzadas de APM, tracing distribuido o monitoreo empresarial quedan fuera del MVP.

---

### DEVOPS-DEC-016 — Health check técnico

El backend deberá exponer un health check técnico básico para operación, sin revelar información sensible. El health check podrá validar estado de aplicación, conectividad con base de datos y estado básico de almacenamiento cuando aplique.

---

### DEVOPS-DEC-017 — Seguridad operativa mínima

Producción deberá cumplir controles mínimos de seguridad operativa: HTTPS, cookies seguras, CORS restringido, secretos fuera del repositorio, base de datos no expuesta públicamente, backups protegidos, logs sin datos sensibles y panel administrativo protegido por autenticación.

---

### DEVOPS-DEC-018 — HTTPS y CORS restringido

Producción deberá operar con HTTPS habilitado y política CORS restringida a dominios autorizados por ambiente. La definición exacta de dominios, subdominios o rutas dependerá del proveedor elegido, pero no deberá dejarse CORS abierto en producción.

---

### DEVOPS-DEC-019 — Datos por ambiente

Los ambientes development y staging deberán usar datos de prueba, semillas controladas o datos anonimizados. Las copias de producción fuera de producción solo deberán permitirse como operación excepcional, autorizada, protegida y documentada.

---

### DEVOPS-DEC-020 — Primer usuario administrativo

La creación del primer usuario administrativo deberá realizarse mediante un mecanismo técnico controlado fuera de la API pública. No se permitirá registro público, credenciales por defecto, usuarios hardcodeados ni secretos versionados en Git.

---

## 8. Estrategia de Infraestructura

La infraestructura del MVP deberá elegirse bajo criterios de bajo costo, simplicidad operativa, seguridad básica y compatibilidad con la arquitectura aprobada.

### 8.1 Criterios de selección de proveedor

El proveedor o infraestructura elegida deberá permitir, como mínimo:

- desplegar frontend React/Vite;
- ejecutar backend Node.js/NestJS;
- conectar PostgreSQL;
- configurar variables de entorno por ambiente;
- habilitar HTTPS;
- configurar CORS;
- acceder a logs básicos;
- realizar backups o integrarse con una estrategia de backups;
- conservar almacenamiento persistente para recursos multimedia, si se usa almacenamiento local;
- evitar almacenamiento efímero para archivos institucionales;
- permitir despliegue controlado;
- mantener costo razonable para MVP.

### 8.2 Criterios de rechazo

No deberá elegirse una alternativa que:

- obligue a exponer la base de datos públicamente;
- no permita HTTPS;
- no permita variables de entorno seguras;
- no ofrezca persistencia suficiente para archivos, si se usa almacenamiento local;
- dependa de almacenamiento efímero para recursos multimedia;
- dificulte backups;
- impida migrar a otra solución futura;
- requiera Kubernetes u operación avanzada para el MVP;
- fuerce IA, vector database o servicios no incluidos en el MVP.

---

## 9. Componentes Operativos del MVP

### 9.1 Frontend

El frontend corresponde a la aplicación React/Vite que contiene:

- portal público;
- panel administrativo;
- vistas de autenticación;
- integración con API;
- consumo de recursos multimedia.

DevOps deberá considerar:

- build estático;
- variables públicas seguras;
- URL de API por ambiente;
- HTTPS;
- cache básico cuando aplique;
- despliegue separado conceptualmente del backend.

### 9.2 Backend

El backend corresponde a la aplicación NestJS que contiene:

- API pública;
- API administrativa;
- autenticación;
- aplicación de reglas y casos de uso;
- integración con Prisma;
- integración con almacenamiento;
- health check.

DevOps deberá considerar:

- proceso Node.js estable;
- variables de entorno;
- conexión a PostgreSQL;
- logs;
- CORS;
- cookies seguras;
- protección de secretos;
- despliegue controlado;
- validación posterior al despliegue.

### 9.3 Base de datos

La base de datos PostgreSQL conserva el conocimiento institucional persistido:

- contenidos;
- publicaciones;
- fuentes;
- validaciones;
- campañas;
- enfermedades;
- recursos;
- canales;
- línea del tiempo;
- trazabilidad;
- usuarios administrativos.

DevOps deberá considerar:

- acceso restringido;
- backups diarios;
- migraciones controladas;
- restauración probada;
- no exposición pública directa;
- separación por ambiente;
- protección de credenciales.

### 9.4 Recursos multimedia

Los recursos multimedia forman parte del valor institucional publicado.

DevOps deberá considerar:

- almacenamiento persistente;
- prohibición de almacenar archivos institucionales en filesystem efímero de build o runtime;
- respaldo;
- recuperación;
- rutas configurables por ambiente;
- no dependencia de almacenamiento efímero;
- abstracción mediante `StorageProvider`;
- migración futura a almacenamiento externo.

---

## 10. Estrategia de Ambientes

### 10.1 Local

Uso:

- desarrollo individual;
- pruebas rápidas;
- ejecución local de frontend/backend;
- base de datos local o temporal;
- experimentación técnica controlada.

Restricciones:

- no usar secretos productivos;
- no usar datos productivos reales;
- no simular producción como fuente de verdad operativa.

### 10.2 Development

Uso:

- integración temprana;
- validación compartida;
- pruebas de configuración;
- revisión técnica antes de staging.

Restricciones:

- usar datos de prueba;
- secretos propios del ambiente;
- acceso limitado a responsables técnicos.

### 10.3 Staging / Preproduction

Uso:

- validación previa a producción;
- prueba de migraciones;
- revisión de despliegue;
- validación de login administrativo;
- validación de rutas públicas y administrativas críticas.

Restricciones:

- no usar producción como campo de pruebas;
- no usar datos productivos sin anonimización o autorización explícita;
- no permitir CORS abierto;
- usar configuración cercana a producción cuando sea viable.

### 10.4 Production

Uso:

- portal público institucional;
- panel administrativo real;
- API pública y administrativa real;
- base de datos institucional;
- recursos multimedia reales;
- operación bajo responsabilidad institucional.

Restricciones:

- HTTPS obligatorio;
- secretos protegidos;
- backups activos;
- logs sin datos sensibles;
- despliegue controlado;
- migraciones explícitas;
- base de datos no expuesta públicamente.

---

## 11. Estrategia de Configuración y Secretos

La configuración debe estar separada por ambiente.

### 11.1 Variables recomendadas

El listado exacto será definido durante implementación, pero DevOps debe preparar al menos estas categorías:

```text
DATABASE_URL
APP_ENV
APP_PORT
FRONTEND_URL
API_BASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN
COOKIE_DOMAIN
COOKIE_SECURE
COOKIE_SAME_SITE
CORS_ALLOWED_ORIGINS
STORAGE_PROVIDER
STORAGE_LOCAL_PATH
MAX_UPLOAD_SIZE
```

### 11.2 Reglas

- Los secretos reales no se versionan.
- `.env.example` sí se versiona sin valores sensibles.
- Cada ambiente tiene sus propios secretos.
- Producción no debe reutilizar secretos de development.
- Los secretos deben poder rotarse si existe sospecha de exposición.

---

## 12. Estrategia de Migraciones

Las migraciones de Prisma deberán tratarse como operación sensible.

### 12.1 Local y development

Pueden usarse flujos más flexibles para iteración técnica, siempre que no se confundan con producción.

### 12.2 Staging

Toda migración productiva prevista debe probarse antes en staging o ambiente equivalente.

### 12.3 Production

En producción se requiere:

1. revisar la migración;
2. validar impacto;
3. confirmar backup reciente;
4. ejecutar explícitamente;
5. validar sistema después de migrar;
6. documentar incidencias si ocurren.

No se aprueba migración automática en cada deploy productivo.

---

## 13. Estrategia de Backups y Recuperación

### 13.1 PostgreSQL

Producción requiere:

- backup automático diario;
- retención mínima de 14 días;
- objetivo recomendado de 30 días si el costo lo permite;
- verificación antes de migraciones relevantes;
- prueba periódica de restauración.

### 13.2 Multimedia

Los recursos multimedia deberán respaldarse junto con la base de datos como conjunto lógico.

El backup debe permitir recuperar publicaciones con sus archivos o referencias asociadas. La estrategia exacta de consistencia entre base de datos y archivos se definirá en `deployment-strategy.md`, pero el principio obligatorio es que una restauración no debe dejar publicaciones sin sus recursos institucionales asociados cuando estos sean administrados por la plataforma.

### 13.3 Restauración

La restauración no debe tratarse como operación ordinaria. Debe utilizarse ante:

- corrupción de datos;
- migración fallida grave;
- pérdida de archivos;
- incidente operativo relevante.

La restauración deberá documentar riesgo de pérdida de datos posteriores al respaldo usado.

---

## 14. Estrategia de CI/CD

### 14.1 CI básico

El MVP debe contar con validación técnica mínima:

- instalación de dependencias;
- lint;
- typecheck;
- build de frontend;
- build de backend;
- validación Prisma sin ejecutar migraciones productivas;
- tests cuando existan.

### 14.2 CD controlado

Producción no deberá desplegarse automáticamente por cada merge.

El despliegue productivo deberá requerir acción explícita del responsable técnico.

Staging podrá automatizarse si:

- no incrementa costo de forma relevante;
- no aumenta complejidad operativa;
- no ejecuta migraciones productivas;
- facilita validación previa.

La automatización de staging no autoriza despliegue automático a producción ni ejecución automática de migraciones productivas.

---

## 15. Estrategia de Rollback

### 15.1 Rollback de aplicación

El mecanismo principal será redeploy de una versión anterior del frontend o backend.

Este rollback puede usarse cuando:

- el despliegue introduce error funcional;
- el backend falla después de publicar nueva versión;
- el frontend presenta regresión crítica;
- la autenticación se ve afectada por cambio reciente.

### 15.2 Rollback de datos

La restauración de base de datos o multimedia se considera excepcional.

Debe aplicarse solo cuando:

- existe daño grave;
- existe corrupción;
- una migración afectó datos críticos;
- no existe mitigación segura por código o corrección incremental.

Debe considerarse que restaurar datos puede eliminar cambios posteriores al backup.

---

## 16. Observabilidad y Health Check

### 16.1 Observabilidad mínima

El MVP debe contar con:

- logs de aplicación;
- logs de errores;
- logs de despliegue;
- monitoreo básico de disponibilidad;
- revisión manual posterior a despliegues;
- registro de fallas relevantes.

No se requiere APM avanzado, tracing distribuido ni dashboards complejos.

### 16.2 Health check

El backend deberá exponer un endpoint técnico de health check. Este endpoint podrá ser público si solo devuelve estado seguro y no sensible, o restringido si el proveedor permite monitoreo interno.

Puede validar:

- estado de aplicación;
- conectividad con PostgreSQL;
- estado básico del almacenamiento;
- metadata de versión o build, si aplica.

No debe exponer:

- secretos;
- variables de entorno;
- connection strings;
- tokens;
- stack traces completos;
- detalles internos sensibles.

---

## 17. Seguridad Operativa Inicial

Producción deberá cumplir controles mínimos:

- HTTPS obligatorio;
- cookies `HttpOnly` y `Secure` para refresh token;
- `SameSite` configurado según la estrategia frontend/backend;
- CORS restringido;
- secretos fuera del repositorio;
- base de datos no expuesta públicamente;
- backups protegidos;
- logs sin contraseñas, tokens ni secretos;
- panel administrativo protegido por autenticación;
- primer usuario administrativo creado por mecanismo controlado;
- credenciales productivas no compartidas en texto plano;
- acceso administrativo limitado.

Quedan fuera del MVP:

- WAF avanzado;
- SIEM;
- Zero Trust formal;
- pentesting formal obligatorio;
- gestión empresarial de identidades;
- rotación automática avanzada de secretos.

---

## 18. Dominio, HTTPS y CORS

La definición exacta de dominio dependerá del proveedor elegido.

El documento permite dos estrategias conceptuales:

```text
Frontend público/admin: https://dominio-institucional
Backend API:            https://api.dominio-institucional
```

O una alternativa de bajo costo:

```text
Frontend público/admin: https://dominio-institucional
Backend API:            https://dominio-institucional/api
```

Cualquier alternativa deberá mantener:

- HTTPS;
- CORS restringido;
- cookies compatibles con el dominio;
- configuración por ambiente;
- no exposición de API administrativa sin autenticación.

---

## 19. Manejo de Datos por Ambiente

Development y staging deberán usar:

- datos de prueba;
- semillas controladas;
- datos anonimizados cuando sea necesario;
- contenido ficticio claramente identificable.

Las copias de producción fuera de producción solo se permiten como operación excepcional.

Cuando se haga, deberá ser:

- autorizada;
- protegida;
- documentada;
- limitada temporalmente;
- preferentemente anonimizada.

---

## 20. Primer Usuario Administrativo

La creación del primer usuario administrativo pertenece al proceso inicial de despliegue y operación.

Opciones aceptables para MVP:

- script técnico ejecutado una sola vez;
- seed controlado solo para inicialización;
- comando administrativo interno;
- operación manual documentada por el Lead Developer.

Restricciones:

- no endpoint público de registro;
- no creación anónima de administradores;
- no usuario hardcodeado;
- no contraseña por defecto en producción;
- no password inicial versionado en Git;
- no exposición del mecanismo al portal público.

---

## 21. Relación con IA

La Phase 08 definió IA como capacidad futura.

Por tanto, DevOps MVP no debe preparar infraestructura obligatoria para:

- modelos LLM;
- embeddings;
- pgvector;
- vector database;
- chatbot;
- búsqueda semántica;
- colas de procesamiento IA;
- proveedores IA;
- almacenamiento de prompts productivos;
- evaluación automática de respuestas.

Cualquier necesidad operativa de IA deberá documentarse en una fase futura autorizada.

---

## 22. Antipatrones DevOps

Quedan explícitamente rechazados para el MVP:

- elegir proveedor por moda y no por necesidad;
- introducir Kubernetes sin necesidad operativa;
- ejecutar migraciones productivas automáticamente sin validación;
- almacenar secretos en Git;
- usar producción como ambiente de prueba;
- desplegar sin backup reciente cuando hay migración relevante;
- restaurar base de datos sin documentar impacto;
- dejar CORS abierto en producción;
- exponer base de datos públicamente;
- depender de almacenamiento efímero para multimedia;
- usar credenciales por defecto;
- crear registro público de administradores;
- introducir IA como dependencia operativa del MVP;
- sobredocumentar herramientas que no se usarán en la primera entrega.

---

## 23. Checklist de Validación del Documento

Antes de aprobar Phase 09 DevOps, validar:

- [ ] El documento no obliga proveedor específico.
- [ ] El documento prioriza bajo costo sin sacrificar MVP.
- [ ] El documento separa frontend, backend y base de datos conceptualmente.
- [ ] Docker queda recomendado, no obligatorio.
- [ ] Kubernetes queda fuera del MVP.
- [ ] Existen ambientes objetivo claros.
- [ ] Existe validación previa antes de producción.
- [ ] Secretos quedan fuera de Git.
- [ ] `.env.example` queda permitido sin valores sensibles.
- [ ] Migraciones Prisma productivas son controladas.
- [ ] Backups PostgreSQL diarios tienen retención mínima de 14 días.
- [ ] Multimedia queda incluida en respaldo.
- [ ] Almacenamiento local controlado queda permitido solo si es persistente y respaldado.
- [ ] CI básico queda definido.
- [ ] Producción usa despliegue manual/controlado inicialmente.
- [ ] Rollback de aplicación queda priorizado.
- [ ] Restauración de datos queda como operación excepcional.
- [ ] Observabilidad mínima queda definida.
- [ ] Health check queda definido sin exposición sensible.
- [ ] Seguridad operativa mínima queda definida.
- [ ] HTTPS y CORS restringido quedan definidos.
- [ ] Development/staging no usan datos productivos reales sin control.
- [ ] Primer usuario administrativo se crea fuera de la API pública.
- [ ] IA queda fuera de infraestructura MVP.

---

## 24. Pendientes para Documentos Posteriores de Phase 09

Este documento prepara documentos más específicos. Estos documentos permanecen pendientes hasta que el Lead Developer autorice su generación; no se consideran baseline por el solo hecho de estar referenciados aquí.

### `deployment-strategy.md`

Deberá profundizar en:

- flujo de despliegue;
- estrategia de frontend;
- estrategia de backend;
- estrategia de base de datos;
- validación preproducción;
- checklist de primer deploy;
- rollback operacional.

### `environment-strategy.md`

Deberá profundizar en:

- variables por ambiente;
- diferencias local/development/staging/production;
- datos de prueba;
- secretos;
- CORS por ambiente;
- configuración de cookies;
- configuración de almacenamiento.

### `transfer-package.md`

Deberá cerrar Phase 09 una vez aprobados los documentos de la fase.

---

## 25. Conclusión

La estrategia DevOps del MVP debe mantener equilibrio entre operación realista, bajo costo, seguridad y recuperabilidad.

El producto no requiere una plataforma DevOps empresarial para iniciar. Requiere una base operativa clara que permita desplegar el portal público, el panel administrativo, la API, PostgreSQL y los recursos multimedia sin comprometer la confiabilidad institucional.

La aprobación de este documento no autoriza todavía ejecución de infraestructura, despliegues productivos, migraciones, configuración de dominio ni creación de usuarios reales. Es una baseline estratégica para orientar los documentos operativos posteriores y la fase de Implementation.

La regla de cierre para Phase 09 es:

```text
Primero operación simple y segura.
Después automatización progresiva.
Nunca sobreingeniería antes del MVP.
```
