# Checklist de Remediación de Auditoría

| Campo | Valor |
|---|---|
| Proyecto | Sistema de Gestión de Contenido para la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Propósito | Cerrar, de forma controlada, las diferencias entre `docs/` y el código operativo. |
| Fuente | Auditoría documental y técnica realizada el 2026-07-16. |
| Estado inicial | Pendiente de ejecución. |
| Alcance | Código en `apps/`, `packages/` y `prisma/` contra documentación normativa en `docs/`. |

---

## 1. Cómo usar este checklist

Cada bloque es una unidad de trabajo coherente. No debe marcarse completo por tener interfaces, modelos o pantallas incompletas: debe cumplir todos sus criterios de salida y sus pruebas.

Estados permitidos:

- `[ ]` Pendiente.
- `[~]` En progreso.
- `[x]` Verificado y cerrado.
- `[!]` Bloqueado; registrar causa y decisión requerida.

Reglas de ejecución:

1. Ejecutar los bloques en orden, salvo que una tarea no tenga dependencia indicada.
2. Actualizar este archivo y el checklist de slices al cerrar cada bloque.
3. Todo endpoint nuevo o modificado debe actualizar Swagger, pruebas y el documento API correspondiente.
4. No introducir IA, RAG, embeddings, roles avanzados ni integraciones reales con redes sociales como parte de esta remediación.

---

## 2. Orden de atención

| Orden | Bloque | Prioridad | Dependencia | Resultado esperado |
|---:|---|---|---|---|
| 0 | Normalización documental | Alta | Ninguna | Una fuente de verdad vigente para el avance. |
| 1 | Fuentes y validaciones | Crítica | Bloque 0 | Contenido respaldable y validable institucionalmente. |
| 2 | Publicación institucional y contrato público | Crítica | Bloque 1 | Solo se publica contenido responsable, respaldado y correctamente expuesto. |
| 3 | Clasificación, multimedia y línea del tiempo | Alta | Bloque 2 | Navegación y relaciones documentadas disponibles de forma consistente. |
| 4 | Administración pendiente | Media | Bloques 1 y 2 | Operación institucional completa para el alcance MVP. |
| 5 | Sesión, pruebas y calidad | Alta | Bloques 1 a 4 | Seguridad y calidad verificables. |
| 6 | Alineación arquitectónica | Media | Bloque 5 | Deuda técnica controlada sin reescritura innecesaria. |
| 7 | Preparación DevOps | Media | Bloque 5 | Entrega repetible y preparada para ambientes. |

---

## Bloque 0 — Normalización documental

**Objetivo:** eliminar contradicciones entre los documentos de control y establecer el estado real como referencia única.

- [x] Declarar `project-slices-checklist.md` como checklist operativo vigente (este documento es el de seguimiento de auditoría; project-slices-checklist.md es el registro de avance por slice).
- [x] Actualizar `implementation-checklist.md`: retiradas afirmaciones falsas ("no existe código", "Slice 0 pendiente", "no hay aplicaciones creadas").
- [x] Corregir en `project-slices-checklist.md` los elementos marcados como completos que siguen pendientes: Source, Validation, filtros públicos por categoría/etiqueta, responsabilidad institucional y configuración básica.
- [x] Actualizar `docs/04-database/schema.prisma`: añadido `passwordHash` a User, actualizado generador a Prisma 7 (`prisma-client`), removido `url` de datasource. Diferencias documentadas en el propio archivo.
- [x] Registrar archivos vacíos de IA y despliegue como marcadores diferidos: `docs/08-ai/chatbot.md`, `docs/08-ai/embeddings.md`, `docs/08-ai/rag.md`, `docs/09-devops/deployment.md` etiquetados como DIFERIDOS.
- [ ] Definir un responsable y una fecha de última revisión para cada checklist de implementación (pendiente: responsable por asignar).

**Criterio de salida:** ningún documento vigente contradice el estado comprobable del repositorio.

---

## Bloque 1 — Fuentes, validaciones y respaldo institucional

**Objetivo:** completar el flujo documental que respalda el conocimiento institucional antes de permitir su publicación.

### Backend

- [ ] Crear módulo `Source` con DTOs, servicio, repositorio o puerto de persistencia, controlador y pruebas.
- [ ] Implementar listado paginado, consulta, alta, edición y baja lógica de `Source`.
- [ ] Crear módulo `Validation` con DTOs, servicio, repositorio o puerto de persistencia, controlador y pruebas.
- [ ] Implementar listado paginado, consulta, alta y edición de `Validation`.
- [ ] Permitir que una validación se relacione opcionalmente con una fuente.
- [ ] Implementar asociaciones controladas Content–Source y Content–Validation; evitar exponer los modelos puente como CRUD principal.
- [ ] Registrar trazabilidad al crear, actualizar o asociar fuentes y validaciones cuando corresponda.
- [ ] Validar que una fuente eliminada lógicamente no rompa la trazabilidad histórica.

### Frontend

- [ ] Crear administración de fuentes: listado, alta, edición y baja lógica.
- [ ] Crear administración de validaciones: listado, alta y edición.
- [ ] Añadir selectores de fuentes y validaciones al formulario de Content.
- [ ] Presentar las relaciones como respaldo editorial, sin confundir fuente con canal de comunicación.

### Contrato y pruebas

- [ ] Documentar y publicar en Swagger `/admin/sources`, `/admin/validations` y asociaciones con Content.
- [ ] Añadir pruebas unitarias para las reglas de asociación y baja lógica.
- [ ] Añadir pruebas de integración para el flujo: crear fuente → crear validación → asociar ambas a Content.

**Criterio de salida:** un contenido puede tener respaldo y validación institucionales, ambos administrables y trazables.

---

## Bloque 2 — Publicación institucional y respuesta pública

**Objetivo:** asegurar que la publicación pública cumpla las reglas de confiabilidad descritas en Domain, API y Product.

- [ ] Definir la regla mínima de publicación: fuente, validación aprobada y responsabilidad institucional requeridas, o documentar formalmente las excepciones para contenido generado por la Jurisdicción.
- [ ] Impedir el cambio a `READY_FOR_PUBLICATION` o la creación de `Publication` cuando no se cumpla dicha regla.
- [ ] Añadir `institutionalResponsibility` al DTO y servicio de creación de Publication.
- [ ] Exponer la responsabilidad institucional en la respuesta pública cuando aplique.
- [ ] Exponer fuentes aptas para consulta pública, sin filtrar datos internos de validación o auditoría.
- [ ] Incluir en el detalle público categorías, etiquetas y recursos multimedia autorizados.
- [ ] Confirmar que borradores, retiradas, archivadas y recursos eliminados lógicamente no se expongan al público.
- [ ] Definir e implementar el comportamiento de `HISTORICALLY_CONTEXTUALIZED`, o retirar el estado del modelo y la documentación si no pertenece al MVP.
- [ ] Añadir pruebas de integración que demuestren que un Content sin respaldo requerido no puede publicarse.

**Criterio de salida:** toda publicación pública tiene datos institucionales mínimos, se genera desde un Content elegible y no revela información operativa interna.

---

## Bloque 3 — Clasificación, multimedia y memoria institucional

**Objetivo:** alinear las capacidades de consulta y relaciones con el contrato API documentado.

- [ ] Añadir filtros públicos de publicaciones por categoría y etiqueta, con paginación y validación de parámetros.
- [ ] Conectar dichos filtros a la navegación pública y comprobar que los resultados no mezclen publicaciones no visibles.
- [ ] Decidir y documentar el contrato definitivo de asociaciones multimedia de Content: rutas bajo Content o rutas inversas bajo MediaResource.
- [ ] Actualizar código y documentación para que el contrato elegido sea consistente.
- [ ] Implementar, o documentar como respuesta embebida oficial, los recursos y publicaciones relacionadas de TimelineEvent.
- [ ] Implementar el endpoint público individual de MediaResource, o retirar formalmente esa ruta de la especificación API.
- [ ] Verificar orden, `caption`, `altText` y visibilidad de recursos en Content y TimelineEvent.

**Criterio de salida:** categorías, etiquetas, multimedia y Timeline se consultan con el comportamiento prometido por la documentación y con contratos API no ambiguos.

---

## Bloque 4 — Administración pendiente del MVP

**Objetivo:** completar las superficies administrativas previstas sin ampliar el alcance a analítica avanzada o roles complejos.

- [ ] Implementar un dashboard administrativo mínimo en `/admin` con accesos operativos y resumen no analítico.
- [ ] Implementar perfil operativo mediante `/auth/me`.
- [ ] Definir el alcance real de configuración básica del sitio.
- [ ] Implementar el módulo y pantalla de configuración básica, o mover explícitamente esta capacidad fuera del MVP documentado.
- [ ] Definir banners y menús como entidades administrables o retirar esta promesa del alcance 1.0.
- [ ] Si se aprueban, implementar administración de banners y menús con soft delete, validación, autorización y pruebas.
- [ ] Verificar accesibilidad básica: etiquetas accesibles, foco visible, navegación por teclado y contraste en pantallas añadidas.

**Criterio de salida:** el panel cubre todas las capacidades administrativas que la versión 1.0 mantiene dentro de alcance.

---

## Bloque 5 — Sesión, pruebas y calidad verificable

**Objetivo:** cerrar las diferencias entre la estrategia de autenticación, los resultados de pruebas y el código.

- [ ] Elegir y documentar el mecanismo de invalidación de refresh tokens: persistencia, lista de revocación u otra alternativa segura para el MVP.
- [ ] Implementar invalidación efectiva al cerrar sesión.
- [ ] Implementar rotación de refresh token, o registrar una excepción aprobada con riesgo, compensación y fecha de revisión.
- [ ] Mantener la verificación de usuario activo al iniciar, renovar sesión y consultar perfil.
- [ ] Corregir el caso de integración que espera `Admin` mientras la semilla devuelve `Administrador`; decidir si se ajusta la prueba o el dato de seed.
- [ ] Corregir el import sin uso en `apps/web/src/lib/api.spec.ts` para que el chequeo TypeScript del frontend pase.
- [ ] Ejecutar y registrar en este documento: pruebas unitarias backend, integración backend, pruebas frontend y chequeo TypeScript de ambos proyectos.
- [ ] Añadir cobertura de integración para Source/Validation, regla de publicación, filtros públicos y logout invalidado.

**Criterio de salida:** todas las pruebas y chequeos de tipos pasan, y el cierre de sesión invalida de forma efectiva la credencial renovable.

---

## Bloque 6 — Alineación arquitectónica y mantenibilidad

**Objetivo:** reducir deuda técnica sin reescribir módulos ya funcionales.

- [ ] Definir un patrón único de acceso a persistencia para módulos nuevos: repositorio/puerto de aplicación o justificación documentada de acceso directo a Prisma.
- [ ] Aplicar el patrón elegido primero a Source y Validation.
- [ ] Evaluar migración gradual de los módulos existentes, priorizando Content, Publication y Media; no realizar una reescritura masiva sin una decisión explícita.
- [ ] Sustituir `any` evitable en servicios, DTOs y hooks por tipos de dominio, DTOs de respuesta o tipos Prisma controlados.
- [ ] Revisar límites entre módulos para evitar que controladores públicos consulten Prisma directamente cuando exista un servicio de aplicación apropiado.
- [ ] Mantener `StorageProvider` como única vía de lectura/escritura de archivos desde módulos de negocio.
- [ ] Actualizar ADRs si se toma una decisión nueva sobre repositorios, sesiones o el estado histórico.

**Criterio de salida:** las decisiones de arquitectura usadas por el código son explícitas, repetibles y coherentes con los documentos vigentes.

---

## Bloque 7 — Preparación DevOps

**Objetivo:** convertir la estrategia DevOps documentada en una base operable antes de cualquier despliegue.

- [ ] Completar los documentos vacíos de despliegue o definirlos como fuera de alcance hasta una fase posterior.
- [ ] Crear configuración reproducible de desarrollo local para API, web y PostgreSQL.
- [ ] Decidir si Docker será utilizado para el flujo local y documentar la decisión.
- [ ] Configurar validación automatizada de pruebas, chequeo de tipos y build en CI.
- [ ] Documentar procedimiento controlado para migraciones Prisma, seed y primer usuario administrativo por ambiente.
- [ ] Definir respaldo y recuperación de PostgreSQL y archivos multimedia antes de staging o producción.
- [ ] Definir variables obligatorias por ambiente, URLs públicas, CORS, cookies seguras y almacenamiento separado.
- [ ] Verificar que no existan secretos en Git ni en archivos de ejemplo.

**Criterio de salida:** el sistema puede validarse y desplegarse de forma repetible en un ambiente no productivo, con secretos, migraciones y respaldos controlados.

---

## 3. Capacidades explícitamente diferidas

Estas capacidades no deben incorporarse para cerrar esta auditoría, salvo una nueva autorización de alcance:

- [ ] Chatbot, RAG, embeddings, pgvector y búsqueda semántica.
- [ ] Integraciones reales y publicación automática en redes sociales.
- [ ] Roles, permisos avanzados y flujos editoriales multinivel.
- [ ] Analítica avanzada, métricas de redes sociales y aplicación móvil nativa.

---

## 4. Registro de cierre por bloque

| Bloque | Responsable | Inicio | Cierre | Evidencia de pruebas/documentación | Estado |
|---|---|---|---|---|---|
| 0 — Normalización documental | Pendiente de asignar | 2026-07-16 | 2026-07-16 | implementation-checklist.md, project-slices-checklist.md, docs/04-database/schema.prisma actualizados; archivos IA/despliegue etiquetados como diferidos | [x] |
| 1 — Fuentes y validaciones |  |  |  |  | [ ] |
| 2 — Publicación institucional |  |  |  |  | [ ] |
| 3 — Clasificación y multimedia |  |  |  |  | [ ] |
| 4 — Administración pendiente |  |  |  |  | [ ] |
| 5 — Sesión, pruebas y calidad |  |  |  |  | [ ] |
| 6 — Arquitectura |  |  |  |  | [ ] |
| 7 — DevOps |  |  |  |  | [ ] |

## 5. Dictamen de salida de la auditoría

La auditoría podrá considerarse cerrada cuando los bloques 0, 1, 2 y 5 estén completados y verificados. Los bloques 3, 4, 6 y 7 podrán continuar como mejoras controladas, siempre que cualquier capacidad conservada en el alcance MVP tenga una decisión documentada, implementación coherente y evidencia de pruebas.
