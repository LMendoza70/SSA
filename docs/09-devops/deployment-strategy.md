# Estrategia de Despliegue

| Campo | Valor |
|-------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Estrategia de Despliegue |
| Código | DOC-020 |
| Versión | 1.0.0 |
| Estado | Draft corregido para revisión |
| Fase | Phase 09 — DevOps |
| Documento anterior | `docs/09-devops/devops.md` |
| Documento siguiente | `docs/09-devops/environment-strategy.md` |
| Rol arquitectónico | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect & DevOps Architect |
| Fecha | 2026-07-09 |

---

## 1. Información del Documento

Este documento pertenece a la **Phase 09 — DevOps** del proyecto **Plataforma de Gestión, Comunicación y Educación para la Salud** para la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su responsabilidad es definir una estrategia inicial de despliegue para el MVP, alineada con `docs/09-devops/devops.md`, sin fijar todavía proveedor obligatorio, sin ejecutar infraestructura y sin convertir la estrategia en una guía operativa definitiva.

Este documento no implementa despliegue. En particular, no define:

- proveedor obligatorio;
- comandos productivos definitivos;
- archivos reales de CI/CD;
- Dockerfiles definitivos;
- configuración real de servidores;
- infraestructura como código;
- Kubernetes;
- balanceadores avanzados;
- autoescalado;
- alta disponibilidad avanzada;
- dominios definitivos;
- certificados reales;
- migraciones ejecutadas;
- usuarios administrativos reales;
- credenciales;
- cambios en `schema.prisma`;
- implementación de frontend, backend o base de datos.

La estrategia de despliegue define criterios, flujo, validaciones y límites para que la implementación posterior pueda realizarse de forma controlada.

---

## 2. Propósito

El propósito de `deployment-strategy.md` es establecer cómo deberá desplegarse progresivamente el MVP sin comprometer seguridad operativa, recuperabilidad, trazabilidad ni bajo costo.

El despliegue debe proteger la capacidad central del producto y no debe tratarse como una actividad meramente técnica:

> **Publicar información confiable.**

Un despliegue incorrecto puede afectar el portal público, la administración de contenido, la autenticación, la base de datos, los recursos multimedia, la disponibilidad pública o la confianza institucional. Por tanto, la estrategia de despliegue debe ser simple, verificable y reversible.

---

## 3. Relación con `devops.md`

Este documento deriva directamente de `docs/09-devops/devops.md`.

`devops.md` establece la postura general de operación:

- estrategia inicial para MVP;
- proveedor-neutral;
- menor costo posible sin sacrificar funcionalidades del MVP;
- separación conceptual de frontend, backend y base de datos;
- Docker recomendado pero no obligatorio;
- Kubernetes fuera del MVP;
- ambientes local, development, staging/preproduction y production;
- validación antes de producción;
- variables de entorno y secretos fuera de Git;
- migraciones Prisma controladas;
- backups diarios;
- respaldo de multimedia;
- CI básico;
- despliegue productivo manual o controlado;
- rollback inicial;
- observabilidad mínima;
- health check;
- seguridad operativa mínima.

`deployment-strategy.md` traduce esa postura hacia una estrategia concreta de despliegue inicial, sin convertirla todavía en implementación.

---

## 4. Principio Rector de Despliegue

> El MVP deberá poder desplegarse con una estrategia de bajo costo, segura, controlada y reversible, manteniendo separación conceptual entre frontend, backend y base de datos sin introducir infraestructura distribuida avanzada.

Este principio implica:

- no desplegar directamente a producción sin validación previa;
- no acoplar la arquitectura a un proveedor específico;
- no depender de Kubernetes ni orquestación avanzada;
- no ejecutar migraciones productivas automáticamente;
- no exponer secretos ni base de datos públicamente;
- no usar almacenamiento efímero para recursos persistentes;
- no automatizar producción sin control explícito;
- no sacrificar backups ni HTTPS por reducir costo.

---

## 5. Alcance de la Estrategia de Despliegue

Este documento sí define a nivel estratégico y operativo preliminar:

- unidades de despliegue del MVP;
- criterios de selección de proveedor;
- topologías aceptables de despliegue inicial;
- flujo recomendado de despliegue;
- validación previa a producción;
- estrategia de migraciones en despliegue;
- estrategia de rollback;
- despliegue de frontend;
- despliegue de backend;
- despliegue de base de datos;
- despliegue de recursos multimedia;
- uso de HTTPS y dominios;
- checklist de despliegue;
- límites explícitos.

No define implementación real ni ejecuta operaciones.

---

## 6. Unidades de Despliegue

El MVP deberá tratarse como tres unidades operativas principales separadas conceptualmente:

```text
Frontend React/Vite
Backend NestJS
PostgreSQL
```

Además, deberá considerarse una cuarta responsabilidad operativa transversal:

```text
Recursos multimedia persistentes
```

Los recursos multimedia pueden residir en almacenamiento local controlado, volumen persistente o servicio externo, según la alternativa de menor costo viable. No deberán depender de almacenamiento efímero ni quedar fuera de la estrategia de respaldo.

### 6.1 Frontend

El frontend corresponde a la superficie pública y administrativa desarrollada con React, TypeScript, Vite y Material UI.

Estrategia inicial recomendada:

- generar build estático;
- servir como sitio estático o aplicación web desde proveedor compatible;
- configurar variables públicas no sensibles;
- apuntar al backend/API autorizado;
- operar bajo HTTPS en producción;
- validar rutas públicas y administrativas antes de producción.

### 6.2 Backend

El backend corresponde al servicio NestJS con TypeScript, Modular Monolith y Prisma como infraestructura de persistencia.

Estrategia inicial recomendada:

- desplegar como servicio Node.js;
- configurar variables de entorno por ambiente;
- exponer API `/api/v1`;
- exponer health check técnico básico;
- restringir CORS;
- conectarse a PostgreSQL mediante `DATABASE_URL` segura;
- escribir logs operativos sin secretos.

### 6.3 Base de datos

La base de datos corresponde a PostgreSQL.

Estrategia inicial recomendada:

- usar servicio administrado o instancia controlada según costo y capacidades;
- no exponerla públicamente;
- habilitar backups automáticos diarios en producción;
- validar migraciones en entorno controlado antes de producción;
- ejecutar migraciones productivas de forma explícita y controlada.

### 6.4 Recursos multimedia

Los recursos multimedia incluyen imágenes, infografías, PDFs, documentos y recursos asociados a publicaciones o línea del tiempo.

Estrategia inicial recomendada:

- permitir almacenamiento local controlado si reduce costo;
- exigir almacenamiento persistente en producción;
- incluir los archivos en la estrategia de backup;
- evitar filesystem efímero;
- conservar una abstracción tipo `StorageProvider` para migración futura.

---

## 7. Criterios de Selección de Proveedor

El documento se mantiene proveedor-neutral. La alternativa seleccionada para el MVP deberá priorizar menor costo posible sin sacrificar funcionalidades necesarias.

Criterios mínimos:

| Criterio | Requerido para MVP |
|---------|---------------------|
| Frontend estático | Sí |
| Backend Node.js/NestJS | Sí |
| PostgreSQL | Sí |
| Variables de entorno | Sí |
| Secretos fuera de Git | Sí |
| HTTPS | Sí |
| Logs básicos | Sí |
| Backups de base de datos | Sí |
| Persistencia de archivos | Sí, si usa almacenamiento local |
| CORS configurable | Sí |
| Dominio o subdominio configurable | Recomendado para producción |
| CI/CD integrado | Deseable, no obligatorio |
| Docker | Deseable, no obligatorio |
| Escalabilidad avanzada | No requerida para MVP |
| Kubernetes | No requerido |

### 7.1 Proveedores posibles

El documento no obliga proveedor, pero deberá permitir evaluar opciones como:

- infraestructura institucional;
- VPS económico;
- plataforma PaaS de bajo costo;
- proveedor con frontend estático + backend Node.js + PostgreSQL;
- combinación de proveedor estático para frontend y proveedor backend/base de datos.

La selección final deberá documentarse durante Implementation o durante la preparación real de despliegue. Esa decisión deberá registrar costo, restricciones, riesgos, estrategia de backup, manejo de secretos y limitaciones operativas del proveedor elegido.

---

## 8. Topologías Aceptables para MVP

### 8.1 Topología mínima aceptable

```text
Frontend estático
Backend Node.js
PostgreSQL
Almacenamiento persistente para multimedia
```

Puede vivir en una misma plataforma o proveedor si cumple seguridad, backups, persistencia, HTTPS y configuración por ambiente.

### 8.2 Topología recomendada de bajo costo

```text
Frontend como sitio estático económico
Backend como servicio Node.js gestionado
PostgreSQL administrado o instancia controlada
Multimedia en almacenamiento persistente respaldado
```

Esta alternativa conserva separación conceptual sin introducir complejidad distribuida.

### 8.3 Topología futura posible

```text
Frontend con CDN
Backend en contenedor o servicio gestionado
PostgreSQL administrado con backups avanzados
Storage externo compatible con S3 o equivalente
Observabilidad más completa
```

Esta topología no es requisito del MVP.

### 8.4 Topologías excluidas del MVP

Quedan fuera del MVP:

- Kubernetes;
- microservicios;
- multi-región;
- balanceadores avanzados;
- alta disponibilidad empresarial;
- infraestructura como código obligatoria;
- despliegue IA;
- vector database;
- pgvector;
- servicios de embeddings;
- colas o workers por necesidades no presentes en MVP.

---

## 9. Flujo General de Despliegue

El flujo recomendado para cambios relevantes será:

```text
Desarrollo local
↓
Validaciones técnicas básicas
↓
Build frontend/backend
↓
Validación en development o staging
↓
Backup previo si hay migración o cambio sensible
↓
Despliegue controlado a producción
↓
Validación posterior
↓
Monitoreo básico
```

### 9.1 Desarrollo local

El entorno local deberá permitir:

- ejecutar frontend;
- ejecutar backend;
- conectarse a PostgreSQL local o de desarrollo;
- configurar `.env` local;
- validar build básico;
- probar autenticación y flujos administrativos principales.

Docker podrá utilizarse para PostgreSQL local, pero no será requisito obligatorio si el Lead Developer usa otra alternativa segura, consistente y de menor fricción operativa.

### 9.2 Validaciones técnicas básicas

Antes de despliegue, deberán ejecutarse validaciones como:

- lint;
- typecheck;
- build frontend;
- build backend;
- validación de Prisma sin ejecutar migraciones productivas automáticas;
- pruebas disponibles, cuando existan.

### 9.3 Validación en entorno controlado

Todo cambio sensible deberá validarse antes de producción.

Cambios sensibles incluyen:

- backend;
- autenticación;
- variables de entorno;
- CORS;
- cookies;
- conexión a PostgreSQL;
- migraciones;
- recursos multimedia;
- rutas públicas principales;
- panel administrativo;
- publicación y consulta de contenido.

### 9.4 Despliegue productivo

El despliegue productivo deberá ser manual o controlado inicialmente.

No se recomienda despliegue automático a producción por cada merge.

---

## 10. Estrategia de Despliegue del Frontend

El frontend deberá desplegarse como build estático generado por Vite.

### 10.1 Requisitos de despliegue frontend

- HTTPS en producción;
- configuración correcta de URL de API;
- rutas públicas funcionales;
- rutas administrativas protegidas;
- assets estáticos servidos correctamente;
- fallback adecuado para React Router si aplica;
- variables públicas sin secretos;
- caché razonable para assets versionados.

### 10.2 Validación mínima frontend

Antes de producción, validar:

- home pública;
- listado de publicaciones;
- detalle de publicación;
- campañas;
- enfermedades;
- línea del tiempo;
- login administrativo;
- navegación administrativa básica;
- carga de recursos multimedia;
- comportamiento responsive básico.

---

## 11. Estrategia de Despliegue del Backend

El backend deberá desplegarse como servicio Node.js ejecutando la aplicación NestJS.

### 11.1 Requisitos de despliegue backend

- variables de entorno por ambiente;
- conexión segura a PostgreSQL;
- CORS restringido;
- cookies configuradas para producción;
- logs básicos;
- health check;
- manejo de errores sin exponer información sensible;
- límites razonables de carga de archivos si aplica;
- acceso a almacenamiento multimedia persistente.

### 11.2 Validación mínima backend

Antes de producción, validar:

- arranque de aplicación;
- health check;
- conexión a PostgreSQL;
- login;
- refresh token;
- logout;
- endpoint `/api/v1/auth/me`;
- endpoints públicos principales;
- endpoints administrativos protegidos;
- carga o asociación de recursos multimedia;
- errores controlados.

---

## 12. Estrategia de Despliegue de PostgreSQL

PostgreSQL es el mecanismo aprobado de persistencia para el MVP.

### 12.1 Requisitos de producción

- no exposición pública innecesaria;
- credenciales seguras;
- conexión mediante variable de entorno;
- backups automáticos diarios;
- retención mínima de 14 días;
- 30 días como objetivo si el costo lo permite;
- posibilidad de restauración;
- validación previa a migraciones;
- monitoreo básico de disponibilidad.

### 12.2 Migraciones Prisma

Las migraciones en producción deberán ser controladas, explícitas y validadas.

Flujo recomendado:

```text
Revisar migración
↓
Probar en local/development
↓
Probar en staging/preproduction
↓
Verificar backup reciente
↓
Ejecutar migración en producción de forma explícita
↓
Validar aplicación y datos principales
```

No se deberán ejecutar migraciones productivas automáticamente en cada deploy.

La estrategia exacta de comandos, orden de ejecución y permisos operativos deberá definirse durante Implementation, cuando exista repositorio, proveedor y pipeline reales.

---

## 13. Estrategia de Despliegue de Multimedia

El almacenamiento multimedia deberá tratarse como parte del despliegue, no como detalle secundario.

### 13.1 Requisitos

- almacenamiento persistente;
- ruta o bucket configurable por ambiente;
- acceso controlado;
- respaldo incluido en la política de backup;
- no depender de filesystem efímero;
- compatibilidad con futura abstracción `StorageProvider`.

### 13.2 Riesgos

| Riesgo | Consecuencia | Mitigación |
|-------|--------------|------------|
| Filesystem efímero | Pérdida de archivos tras redeploy | Usar volumen persistente o storage externo |
| Backup solo de PostgreSQL | Publicaciones restauradas sin archivos | Respaldar base y multimedia como conjunto lógico |
| Rutas hardcodeadas | Dificultad de migración | Configurar rutas por ambiente |
| Acceso público no controlado | Exposición de archivos no previstos | Separar recursos públicos y privados si aplica |

La consistencia exacta entre PostgreSQL y multimedia se detallará durante Implementation o en documentación operativa específica si resulta necesario. Este documento solo fija el criterio: una restauración no debe dejar publicaciones sin sus recursos asociados cuando esos recursos sean parte de la publicación.

---

## 14. HTTPS, Dominio y CORS

Producción deberá operar con HTTPS habilitado.

La definición exacta de dominio, subdominio o ruta dependerá del proveedor elegido.

Opciones conceptuales válidas:

```text
Frontend: https://dominio-institucional
API:      https://api.dominio-institucional
```

O bien:

```text
Frontend: https://dominio-institucional
API:      https://dominio-institucional/api
```

La decisión final deberá evaluarse según costo, proveedor, configuración de cookies, simplicidad operativa y facilidad de mantenimiento.

### 14.1 CORS

CORS deberá restringirse a dominios autorizados por ambiente.

No deberá quedar abierto en producción.

### 14.2 Cookies

La configuración de cookies deberá considerar:

- `HttpOnly`;
- `Secure` en producción;
- `SameSite` según separación frontend/backend;
- dominio correcto;
- path correcto;
- expiración acorde a autenticación aprobada.

---

## 15. Estrategia de CI/CD para Despliegue

La estrategia inicial será:

```text
CI básico obligatorio
CD productivo manual o controlado
```

### 15.1 CI básico

Debe validar:

- lint;
- typecheck;
- build frontend;
- build backend;
- validación Prisma;
- tests cuando existan.

### 15.2 CD

Para staging, el despliegue podrá automatizarse si no aumenta costo ni complejidad.

Para production, el despliegue deberá requerir acción explícita del responsable técnico.

Automatizar staging no autoriza despliegue automático a producción ni elimina la obligación de validación previa.

---

## 16. Estrategia de Rollback

El rollback inicial priorizará redeploy de una versión anterior de frontend o backend.

### 16.1 Rollback de aplicación

Se permite cuando:

- una versión rompe rutas públicas;
- falla autenticación;
- falla administración;
- falla integración con API;
- se detecta error crítico después del despliegue.

### 16.2 Rollback de datos

Restaurar PostgreSQL o multimedia desde backup será excepcional.

Solo deberá considerarse ante:

- corrupción de datos;
- migración fallida grave;
- pérdida de archivos;
- error operativo severo.

Debe documentarse riesgo de pérdida de cambios posteriores al backup.

---

## 17. Validación Posterior a Despliegue

Después de desplegar a producción, deberá ejecutarse una validación mínima:

```text
Portal público carga correctamente
API responde health check
Base de datos responde
Login administrativo funciona
Refresh/logout funcionan
Rutas públicas principales funcionan
Panel administrativo carga
Publicaciones principales se consultan
Recursos multimedia cargan
Logs no muestran errores críticos
```

Si la validación falla, deberá evaluarse rollback de aplicación o mitigación inmediata antes de permitir operación normal.

---

## 18. Primer Despliegue Productivo

Antes del primer despliegue productivo deberán estar resueltos:

- proveedor elegido;
- dominios o URLs temporales aceptadas;
- HTTPS;
- variables de entorno productivas;
- base de datos productiva;
- política de backups activa;
- almacenamiento multimedia persistente;
- mecanismo técnico controlado para primer usuario administrativo;
- CORS configurado;
- cookies configuradas;
- health check;
- validación de build frontend/backend;
- migraciones iniciales revisadas;
- checklist de smoke test.

El primer despliegue productivo no deberá crear registro público de usuarios, exponer credenciales por defecto ni dejar habilitado ningún mecanismo temporal de bootstrap administrativo.

---

## 19. Checklist de Despliegue

### 19.1 Antes de producción

- [ ] Build frontend exitoso.
- [ ] Build backend exitoso.
- [ ] Variables de entorno revisadas.
- [ ] Secretos fuera de Git.
- [ ] CORS restringido.
- [ ] Cookies configuradas.
- [ ] PostgreSQL disponible.
- [ ] Backups activados.
- [ ] Multimedia persistente configurada.
- [ ] Migraciones probadas en entorno controlado.
- [ ] Backup reciente verificado antes de migración relevante.
- [ ] Health check funcional.
- [ ] Login administrativo validado.
- [ ] Rutas públicas principales validadas.
- [ ] Plan de rollback definido.

### 19.2 Después de producción

- [ ] Portal público responde.
- [ ] API responde.
- [ ] Health check responde.
- [ ] Login funciona.
- [ ] Publicaciones se consultan.
- [ ] Recursos multimedia cargan.
- [ ] Logs revisados.
- [ ] No hay errores críticos.
- [ ] Backup programado confirmado.

---

## 20. Límites Explícitos

Este documento no autoriza ni sustituye aprobación explícita para:

- crear infraestructura productiva sin aprobación del Lead Developer;
- ejecutar migraciones;
- desplegar producción;
- definir proveedor definitivo;
- introducir Kubernetes;
- introducir Terraform obligatorio;
- agregar IA;
- agregar pgvector;
- crear vector database;
- automatizar publicación de contenido;
- crear usuarios administrativos reales fuera del mecanismo técnico controlado;
- almacenar secretos en Git;
- exponer base de datos públicamente;
- usar almacenamiento efímero para multimedia productiva.

---

## 21. Decisiones de Despliegue

### DEPLOY-DEC-001 — Despliegue proveedor-neutral

La estrategia de despliegue no obliga un proveedor. Define criterios para seleccionar la alternativa de menor costo que cubra los requisitos del MVP.

### DEPLOY-DEC-002 — Separación operativa mínima

Frontend, backend y PostgreSQL se tratarán como unidades operativas separadas, aunque puedan desplegarse en un mismo proveedor.

### DEPLOY-DEC-003 — Producción controlada

Producción no se desplegará automáticamente por cada merge. Requerirá acción explícita del responsable técnico.

### DEPLOY-DEC-004 — Migraciones controladas

Las migraciones productivas se ejecutarán explícitamente, después de validación y con backup disponible.

### DEPLOY-DEC-005 — Multimedia persistente

Los recursos multimedia deberán almacenarse en un medio persistente y respaldable. No se permite depender de almacenamiento efímero en producción.

### DEPLOY-DEC-006 — Rollback de aplicación primero

La primera estrategia de recuperación ante falla de despliegue será redeploy de versión anterior. Restaurar datos será excepcional.

### DEPLOY-DEC-007 — Sin sobreingeniería operativa

Kubernetes, multi-región, autoescalado avanzado y alta disponibilidad empresarial quedan fuera del MVP.

---

## 22. Relación con Documento Siguiente

El siguiente documento recomendado es:

```text
docs/09-devops/environment-strategy.md
```

Ese documento deberá detallar, sin reabrir las decisiones aprobadas aquí:

- ambientes;
- variables de entorno;
- secretos;
- configuración por ambiente;
- datos de prueba;
- diferencias entre local, development, staging y production;
- criterios de `.env.example`;
- restricciones operativas por ambiente.

`environment-strategy.md` no deberá contradecir esta estrategia de despliegue.

---

## 23. Conclusión

La estrategia de despliegue del MVP debe ser deliberadamente simple, segura y reversible.

El producto no requiere infraestructura empresarial para comenzar, pero sí necesita proteger su base institucional: publicaciones, contenido, fuentes, validaciones, trazabilidad, usuarios administrativos y recursos multimedia.

La ruta recomendada es:

```text
Bajo costo
+ separación conceptual
+ validación previa
+ producción controlada
+ backups
+ HTTPS
+ secretos protegidos
+ rollback básico
```

Esta estrategia permite iniciar operación real sin comprometer la evolución futura del producto.
