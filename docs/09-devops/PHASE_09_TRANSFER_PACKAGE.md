# PHASE 09 TRANSFER PACKAGE — DevOps

| Campo | Valor |
|-------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Phase 09 Transfer Package — DevOps |
| Fase cerrada | Phase 09 — DevOps |
| Estado recomendado | Baseline completa |
| Fecha de cierre | 2026-07-09 |
| Siguiente fase documental | Phase 10 — Implementation |
| Rol de continuidad | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect & DevOps Architect |

---

## 1. Estado de cierre

La **Phase 09 — DevOps** queda cerrada como baseline documental.

Esta fase definió la estrategia inicial de operación, despliegue, ambientes, configuración, seguridad operativa, respaldos y continuidad técnica para el MVP, sin introducir infraestructura productiva obligatoria ni implementación.

El objetivo de esta fase fue preparar al proyecto para una entrega operable, segura, mantenible y de bajo costo, preservando la capacidad central vigente:

> **Publicar información confiable.**

---

## 2. Estado general del proyecto al cierre de Phase 09

```text
Foundation      ✅ Baseline
Product         ✅ Baseline
Domain          ✅ Baseline
Architecture    ✅ Baseline
Database        ✅ Baseline
API             ✅ Baseline
Frontend        ✅ Baseline
Backend         ✅ Baseline
AI              ✅ Baseline
DevOps          ✅ Baseline
Implementation  ⏳ Pendiente
```

El proyecto continúa en fase documental. La implementación productiva, creación de infraestructura, ejecución de migraciones, despliegues reales y configuración definitiva de proveedores deberán iniciar únicamente cuando el Lead Developer lo autorice explícitamente.

---

## 3. Documentos aprobados en Phase 09

La estructura final recomendada para la fase es:

```text
docs/09-devops/
├── devops.md                  ✅ Baseline
├── deployment-strategy.md      ✅ Baseline
├── environment-strategy.md     ✅ Baseline
└── transfer-package.md         ✅ Cierre de fase
```

Documentos generados y consolidados:

```text
devops.md                  ✅ Baseline
deployment-strategy.md      ✅ Baseline
environment-strategy.md     ✅ Baseline
PHASE_09_TRANSFER_PACKAGE.md ✅ Cierre de Phase 09
```

---

## 4. Propósito consolidado de DevOps

DevOps no se diseñó como infraestructura empresarial completa.

La fase definió una estrategia inicial para:

- operar el MVP con seguridad básica;
- desplegar frontend, backend y base de datos de forma controlada;
- mantener configuración separada por ambiente;
- proteger secretos;
- respaldar PostgreSQL y recursos multimedia;
- controlar migraciones Prisma;
- validar cambios antes de producción;
- permitir rollback básico;
- mantener bajo costo operativo;
- evitar sobreingeniería.

---

## 5. Decisiones DevOps consolidadas

### DEVOPS-DEC-001 — Estrategia inicial para MVP

Phase 09 DevOps documenta una estrategia inicial, segura y mantenible para operar y desplegar el MVP, sin diseñar una arquitectura DevOps empresarial completa.

### DEVOPS-DEC-002 — Proveedor neutral

La fase no obliga un proveedor específico. La estrategia permanece compatible con distintos proveedores o infraestructura institucional.

Criterio operativo adicional:

```text
Para desplegar el MVP se preferirá la alternativa de menor costo posible, siempre que no sacrifique funcionalidades requeridas del MVP, seguridad básica, disponibilidad mínima, respaldo de datos ni mantenibilidad operativa.
```

### DEVOPS-DEC-003 — Separación conceptual de unidades de despliegue

El despliegue del MVP separa conceptualmente:

```text
Frontend React/Vite
Backend NestJS
PostgreSQL
Recursos multimedia
```

No exige proveedores separados ni infraestructura distribuida avanzada.

### DEVOPS-DEC-004 — Docker recomendado, no obligatorio

Docker queda recomendado para consistencia local, portabilidad y evolución futura, pero no es requisito obligatorio para desplegar el MVP.

Condición operativa:

```text
El Lead Developer tiene experiencia inicial con Docker, por lo que la estrategia DevOps no deberá depender de una operación avanzada de contenedores para entregar el MVP.
```

### DEVOPS-DEC-005 — Kubernetes fuera del MVP

Kubernetes, orquestación avanzada, despliegue multi-nodo y arquitectura distribuida quedan fuera del MVP.

### DEVOPS-DEC-006 — Ambientes objetivo

La estrategia contempla:

```text
local
development
staging / preproduction
production
```

Para el MVP, `development` y `staging` pueden consolidarse temporalmente por costo o simplicidad, siempre que exista validación controlada antes de producción.

### DEVOPS-DEC-007 — Validación antes de producción

Todo cambio sensible debe validarse antes de producción en un entorno controlado.

Esto aplica especialmente a:

- backend;
- base de datos;
- autenticación;
- configuración;
- despliegue;
- contenido público crítico;
- migraciones.

### DEVOPS-DEC-008 — Variables de entorno y secretos

La configuración sensible se gestiona mediante variables de entorno por ambiente.

Los secretos reales no se versionan en Git.

El repositorio debe incluir archivos `.env.example` sin valores sensibles.

### DEVOPS-DEC-009 — Migraciones Prisma controladas

Las migraciones Prisma en producción deberán ejecutarse de forma controlada, explícita y validada.

No deberán correr automáticamente en cada despliegue productivo.

Toda migración relevante deberá probarse previamente en un entorno controlado y contar con respaldo o estrategia de mitigación.

### DEVOPS-DEC-010 — Backups PostgreSQL

Producción deberá contar con backups automáticos diarios de PostgreSQL.

Retención definida:

```text
Mínimo MVP: 14 días
Objetivo recomendado si el costo lo permite: 30 días
```

Las restauraciones deberán probarse periódicamente y los backups relevantes deberán verificarse antes de migraciones productivas.

### DEVOPS-DEC-011 — Backups multimedia

La estrategia de respaldo debe incluir tanto PostgreSQL como recursos multimedia administrados por la plataforma.

Los backups deberán preservar la consistencia lógica entre publicaciones, metadatos y archivos asociados.

### DEVOPS-DEC-012 — Almacenamiento multimedia inicial

El MVP puede iniciar con almacenamiento local controlado de recursos multimedia si reduce costo y complejidad, siempre que:

- se use una abstracción tipo `StorageProvider`;
- se garantice persistencia de archivos en producción;
- se incluya respaldo de recursos;
- no se impida migrar a almacenamiento externo en el futuro.

### DEVOPS-DEC-013 — CI básico y despliegue controlado

El MVP deberá contar con CI básico para validar calidad técnica mínima antes de despliegue.

El despliegue a producción será inicialmente manual o controlado, no automático por cada merge.

Staging podrá automatizarse si no aumenta costo ni complejidad.

### DEVOPS-DEC-014 — Rollback

La estrategia inicial de rollback prioriza redeploy de una versión anterior de la aplicación.

La restauración de base de datos o multimedia desde backup será excepcional, controlada y documentada, debido al riesgo de pérdida de contenido, trazabilidad o cambios institucionales posteriores al respaldo.

### DEVOPS-DEC-015 — Observabilidad mínima

El MVP deberá contar con observabilidad mínima basada en:

- logs de aplicación;
- logs de errores;
- monitoreo básico de disponibilidad;
- revisión operativa manual.

Quedan fuera del MVP:

- APM avanzado;
- tracing distribuido;
- monitoreo empresarial;
- dashboards complejos.

### DEVOPS-DEC-016 — Health check

El backend deberá exponer un health check técnico básico para operación, sin revelar información sensible.

Puede validar:

- estado de aplicación;
- conectividad con base de datos;
- estado básico de almacenamiento cuando aplique.

### DEVOPS-DEC-017 — Seguridad operativa mínima

Producción deberá cumplir controles mínimos:

- HTTPS;
- cookies seguras;
- CORS restringido;
- secretos fuera del repositorio;
- base de datos no expuesta públicamente;
- backups protegidos;
- logs sin datos sensibles;
- panel administrativo protegido por autenticación.

### DEVOPS-DEC-018 — HTTPS y CORS

Producción deberá operar con HTTPS habilitado y política CORS restringida a dominios autorizados por ambiente.

La definición exacta de dominios, subdominios o rutas dependerá del proveedor elegido.

No se permite CORS abierto en producción.

### DEVOPS-DEC-019 — Datos no productivos

Los ambientes `development` y `staging` deberán usar datos de prueba, semillas controladas o datos anonimizados.

Las copias de producción fuera de producción solo deberán permitirse como operación excepcional, autorizada, protegida y documentada.

### DEVOPS-DEC-020 — Primer usuario administrativo

La creación del primer usuario administrativo deberá realizarse mediante un mecanismo técnico controlado fuera de la API pública.

No se permitirá:

- registro público;
- credenciales por defecto;
- usuarios hardcodeados;
- secretos versionados en Git.

---

## 6. Decisiones específicas de Environment Strategy

### ENV-DEC-001 — Modelo de ambientes

La estrategia de ambientes define `local`, `development`, `staging/preproduction` y `production` como modelo objetivo.

Para el MVP, `development` y `staging` podrán consolidarse temporalmente por costo o simplicidad, siempre que exista validación controlada antes de producción.

### ENV-DEC-002 — Configuración independiente por ambiente

Cada ambiente deberá tener configuración independiente mediante variables de entorno propias.

No deberán reutilizarse secretos productivos en ambientes no productivos.

### ENV-DEC-003 — `.env.example`

El repositorio deberá incluir archivos `.env.example` para documentar variables requeridas por ambiente o componente, sin valores sensibles ni secretos reales.

### ENV-DEC-004 — Secretos fuera del repositorio

Los secretos deberán gestionarse fuera del repositorio mediante variables de entorno no versionadas o el gestor de secretos del proveedor elegido.

Los secretos productivos no deberán compartirse, reutilizarse en otros ambientes ni documentarse en archivos del proyecto.

### ENV-DEC-005 — Base de datos independiente por ambiente

Cada ambiente deberá utilizar una base de datos PostgreSQL independiente.

Production no deberá compartirse con `local`, `development` ni `staging`.

### ENV-DEC-006 — Datos de prueba o anonimizados

Los ambientes `local`, `development` y `staging` deberán usar datos de prueba, semillas controladas o datos anonimizados.

Las copias de datos productivos fuera de producción solo se permitirán como excepción autorizada, protegida y documentada.

### ENV-DEC-007 — Cookies por ambiente

La configuración de cookies deberá definirse por ambiente.

En producción, las cookies de autenticación deberán usar `HttpOnly` y `Secure`, operar bajo HTTPS y configurarse de forma compatible con la topología final de frontend/backend.

La configuración `SameSite`, `Domain` y CORS deberá validarse antes de producción.

### ENV-DEC-008 — CORS por ambiente

CORS deberá configurarse por ambiente mediante una lista explícita de orígenes permitidos.

En producción no se permitirá CORS abierto ni credenciales desde orígenes no autorizados.

### ENV-DEC-009 — URLs por ambiente

Cada ambiente deberá declarar explícitamente URLs públicas y técnicas del frontend, portal público, panel administrativo y backend/API según aplique.

Estas URLs deberán usarse para CORS, cookies, cliente HTTP, enlaces públicos y configuración operativa.

### ENV-DEC-010 — Almacenamiento multimedia separado

Cada ambiente deberá utilizar almacenamiento multimedia separado.

Production no deberá compartir carpeta, volumen o bucket con `local`, `development` ni `staging`.

En producción, el almacenamiento deberá ser persistente e incluirse en la estrategia de respaldo.

### ENV-DEC-011 — Logging por ambiente

Cada ambiente deberá definir un nivel de logging adecuado.

Producción deberá evitar logs verbose o debug permanentes.

Ningún ambiente deberá registrar secretos, tokens, contraseñas, cookies o datos sensibles.

### ENV-DEC-012 — Primer usuario administrativo por ambiente

La creación del primer usuario administrativo deberá manejarse por ambiente mediante un mecanismo técnico controlado.

Las credenciales no deberán reutilizarse entre ambientes ni versionarse.

En producción no se permitirán usuarios hardcodeados, contraseñas por defecto ni endpoints públicos de registro.

---

## 7. Límites explícitos de Phase 09

Phase 09 no autoriza:

- crear infraestructura real;
- contratar proveedor;
- configurar producción;
- ejecutar migraciones Prisma;
- crear usuarios administrativos reales;
- desplegar frontend;
- desplegar backend;
- publicar portal público;
- ejecutar CI/CD real;
- crear buckets o volúmenes definitivos;
- modificar `schema.prisma`;
- introducir IA, embeddings, pgvector o chatbot;
- introducir Kubernetes;
- diseñar Terraform;
- implementar Docker avanzado;
- exponer base de datos públicamente;
- usar datos productivos en ambientes no productivos sin control.

Toda ejecución técnica pertenece a la fase Implementation o a una autorización explícita del Lead Developer.

---

## 8. Documentos no generados intencionalmente

No se generaron como documentos obligatorios:

```text
ci-cd.md
docker.md
kubernetes.md
terraform.md
monitoring.md
logging.md
backup-policy.md
security-hardening.md
incident-response.md
cloud-architecture.md
cost-optimization.md
```

Motivo: generar todos estos documentos antes de implementación introduciría sobredocumentación y riesgo de sobreingeniería.

Sus criterios mínimos quedaron cubiertos en:

```text
devops.md
deployment-strategy.md
environment-strategy.md
```

---

## 9. Riesgos pendientes para Implementation

La siguiente fase deberá cuidar especialmente:

1. No ejecutar migraciones sin revisión previa.
2. No usar secretos reales en archivos versionados.
3. No desplegar producción sin HTTPS.
4. No dejar CORS abierto en producción.
5. No usar filesystem efímero para multimedia productiva.
6. No crear usuario administrador mediante endpoint público.
7. No automatizar despliegue a producción sin control explícito.
8. No restaurar base de datos sin evaluar pérdida de contenido posterior.
9. No copiar producción a staging/local sin autorización y protección.
10. No introducir IA o pgvector como consecuencia de decisiones DevOps.

---

## 10. Recomendaciones para iniciar Phase 10 — Implementation

La fase Implementation deberá comenzar con una revisión operativa mínima antes de ejecutar cualquier comando técnico.

Recomendación de primer orden:

```text
1. Confirmar estructura real del repositorio.
2. Confirmar scripts disponibles del frontend y backend.
3. Confirmar si existe workspace monorepo o repos separados.
4. Confirmar estrategia local de PostgreSQL.
5. Confirmar variables `.env.example` necesarias.
6. Confirmar mecanismo de creación del primer usuario admin.
7. Confirmar comandos Prisma permitidos.
8. Confirmar proveedor o ruta temporal de despliegue.
9. Confirmar estrategia real de almacenamiento multimedia.
10. Confirmar checklist de primer despliegue.
```

La implementación deberá respetar el orden aprobado:

```text
Negocio
↓
Dominio
↓
Arquitectura
↓
Persistencia
↓
API
↓
Frontend
↓
Backend
↓
AI futura
↓
DevOps
↓
Implementation
```

---

## 11. Estado final recomendado

```text
Phase 09 — DevOps ✅ Baseline completa
```

La fase puede cerrarse formalmente.

Siguiente fase:

```text
Phase 10 — Implementation
```

Documento inicial recomendado:

```text
docs/10-implementation/implementation-start.md
```

Alternativa si se prefiere iniciar directamente con ejecución técnica controlada:

```text
Revisión de repositorio y plan técnico de arranque antes de ejecutar comandos.
```

---

## 12. Conclusión

Phase 09 deja una estrategia DevOps suficiente para iniciar implementación sin sobreingeniería.

La estrategia protege:

- bajo costo;
- seguridad mínima;
- separación de ambientes;
- control de secretos;
- respaldo de conocimiento institucional;
- despliegue controlado;
- migraciones seguras;
- operación inicial mantenible;
- evolución futura sin acoplar el MVP a infraestructura compleja.

La decisión central de cierre es:

```text
DevOps debe permitir operar el MVP de forma segura, simple y recuperable, sin convertir la primera entrega en un problema de infraestructura.
```
