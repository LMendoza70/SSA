# Plataforma de Gestion, Comunicacion y Educacion para la Salud

Repositorio documental y tecnico de la plataforma institucional para la **Jurisdiccion Sanitaria de Huejutla de Reyes, Hidalgo**.

La capacidad central del producto es:

> **Publicar informacion confiable.**

El sistema no es un CMS generico ni una plataforma clinica. Su proposito es administrar, preservar, publicar, distribuir y consultar conocimiento institucional sobre salud publica de forma clara, confiable, trazable y accesible para la poblacion.

---

## Estado Actual del Proyecto

El proyecto ya completo la baseline documental principal y entro a la etapa de **Implementation / Phase 10 operativa**.

El repositorio, al momento de esta revision, se encuentra en estado **documental**. Todavia no existe una aplicacion implementada con `apps/web`, `apps/api`, `package.json`, scripts de ejecucion, migraciones Prisma, backend NestJS o frontend React.

La autorizacion vigente permite iniciar unicamente:

```text
Slice 0 - Preparacion controlada
```

Esto incluye preparar estructura, documentacion, archivos de ejemplo sin secretos y revision estatica del schema. No incluye migraciones, seeds, conexion real a base de datos, despliegues ni cambios de dominio.

Documento rector de la etapa actual:

- `docs/10-implementation/implementation-start.md`

Checklist operativo:

- `docs/10-implementation/implementation-checklist.md`

---

## Resumen de Avance

| Area | Estado | Observacion |
|---|---|---|
| Foundation | Baseline | Charter y guia arquitectonica definidos. |
| Product | Baseline documental | Vision, alcance, principios y personas documentados. Algunos archivos conservan estado interno `Draft`; revisar antes de cierre formal. |
| Domain | Baseline documental | Lenguaje ubicuo, dominio, reglas y casos de uso definidos. |
| Architecture | Baseline documental | Clean Architecture, Modular Monolith y DDD Lite definidos. |
| Database | Baseline documental | Modelo Prisma de referencia ubicado en `docs/04-database/schema.prisma`. No esta migrado ni validado por Prisma CLI. |
| API | Baseline | Superficies publica, administrativa y auth documentadas. |
| Frontend | Baseline documental | Experiencia publica y administrativa definida a nivel arquitectonico. |
| Backend | Baseline documental | Modulos, limites y plan incremental documentados. |
| AI | Baseline futura | RAG y chatbot documentados como capacidad futura, fuera del MVP. |
| DevOps | Baseline | Estrategia MVP proveedor-neutral, sin infraestructura real creada. |
| Implementation | Baseline de arranque | Autorizado solo Slice 0 - Preparacion controlada. |
| Codigo de aplicacion | Pendiente | No hay frontend, backend, workspace ni scripts de ejecucion todavia. |

---

## Alcance MVP

La version 1.0 debe enfocarse en entregar una plataforma institucional capaz de:

- gestionar contenido institucional desde un panel autenticado;
- publicar informacion oficial y consultable;
- ofrecer portal publico responsive;
- permitir busqueda basica;
- organizar informacion por tipos editoriales, categorias y etiquetas;
- administrar campanas y enfermedades como entidades organizadoras;
- administrar una linea del tiempo institucional;
- asociar recursos multimedia reutilizables;
- preparar distribucion asistida hacia canales de comunicacion;
- conservar trazabilidad minima de autoria operativa, fuente, validacion y responsabilidad institucional.

Quedan fuera del MVP:

- chatbot RAG funcional;
- busqueda semantica;
- embeddings y pgvector en implementacion;
- publicacion programada;
- integracion automatica completa con redes sociales;
- roles avanzados;
- workflow editorial multinivel;
- auditoria avanzada;
- expediente clinico, diagnostico, consulta medica, citas, farmacia o inventario.

---

## Principios Arquitectonicos

El desarrollo debe respetar:

- Clean Architecture;
- SOLID;
- DRY;
- KISS;
- Separation of Concerns;
- Modular Monolith;
- DDD Lite;
- documentacion como fuente de verdad;
- dominio antes que base de datos, API o UI;
- seguridad desde el inicio;
- bajo acoplamiento a proveedores externos.

Reglas clave que no deben romperse:

- `Content` y `Publication` son conceptos separados.
- `Publication` no debe reducirse a un booleano.
- `contents` es la base editorial comun; no crear sistemas principales separados para news, notices, documents, infographics o faqs.
- `Campaign` y `Disease` son entidades organizadoras, no `Content`, categorias ni etiquetas.
- `Source` y `Validation` son entidades separadas.
- `TraceabilityRecord` representa trazabilidad minima, no auditoria avanzada.
- La linea del tiempo es memoria institucional administrable, no agenda.
- La IA queda fuera del MVP funcional.
- Los canales distribuyen informacion; no son fuente de verdad.
- Todo almacenamiento de archivos debe pasar por una abstraccion tipo `StorageProvider`.

---

## Stack Tecnologico Previsto

Frontend:

- React
- TypeScript
- Vite
- Material UI
- React Router
- TanStack Query
- React Hook Form
- Zod
- Axios
- Tiptap Editor

Backend:

- Node.js
- NestJS
- TypeScript
- Prisma ORM

Base de datos:

- PostgreSQL
- `pgvector` previsto para una fase futura de IA, no para el MVP funcional

Autenticacion:

- JWT
- Refresh tokens
- Cookies HttpOnly
- Argon2
- Sin registro publico

DevOps MVP:

- proveedor neutral;
- menor costo posible sin sacrificar seguridad minima;
- Docker recomendado, no obligatorio;
- Kubernetes fuera del MVP;
- CI basico;
- despliegue productivo manual/controlado;
- migraciones Prisma controladas;
- secretos fuera de Git;
- HTTPS y CORS restringido en produccion.

---

## Estructura Actual del Repositorio

```text
.
|-- AGENTS.md
|-- README.md
|-- START_HERE.md
|-- first_prompt.md
|-- continue_propmt.md
|-- LICENSE
`-- docs/
    |-- 00-foundation/
    |-- 01-product/
    |-- 02-domain/
    |-- 03-architecture/
    |-- 04-database/
    |-- 05-api/
    |-- 06-frontend/
    |-- 07-backend/
    |-- 08-ai/
    |-- 09-devops/
    |-- 10-implementation/
    `-- transfer/
```

Nota importante:

- El archivo Prisma de referencia existe actualmente en `docs/04-database/schema.prisma`.
- Algunos documentos mencionan `prisma/schema.prisma` como ubicacion futura/aprobada, pero esa carpeta todavia no existe en el repositorio actual.
- `START_HERE.md` conserva contexto historico de una etapa anterior y no representa el estado mas reciente. Para continuar, usar `docs/10-implementation/implementation-start.md`.

---

## Estructura Aprobada para Implementation

La estructura objetivo aprobada para preparar el monorepo ligero es:

```text
.
|-- docs/
|-- prisma/
|   `-- schema.prisma
|-- apps/
|   |-- web/
|   `-- api/
|-- packages/
|   `-- shared/
|-- .env.example
|-- package.json
`-- README.md
```

Esta estructura todavia esta pendiente de creacion. Debe abordarse dentro de `Slice 0 - Preparacion controlada`.

---

## Documentacion Principal

Lectura recomendada para ubicarse rapidamente:

1. `docs/10-implementation/implementation-start.md`
2. `docs/10-implementation/implementation-checklist.md`
3. `docs/09-devops/PHASE_09_TRANSFER_PACKAGE.md`
4. `docs/07-backend/implementation-plan.md`
5. `docs/05-api/api.md`
6. `docs/04-database/schema-prisma.md`
7. `docs/04-database/schema.prisma`
8. `docs/03-architecture/architecture.md`
9. `docs/02-domain/use-cases.md`
10. `docs/01-product/scope.md`

Si existe una contradiccion entre documentos, debe registrarse antes de implementar.

---

## Siguiente Paso Recomendado

Continuar con `Slice 0 - Preparacion controlada`:

1. Confirmar la rama de trabajo.
2. Crear estructura base del monorepo.
3. Mover o copiar controladamente el schema hacia `prisma/schema.prisma` si se autoriza.
4. Crear `.env.example` sin secretos.
5. Preparar `package.json` y workspace `pnpm`.
6. Revisar `schema.prisma` de forma estatica.
7. No ejecutar Prisma todavia sin autorizacion explicita.

---

## Acciones No Autorizadas Todavia

No ejecutar sin autorizacion explicita del Lead Developer:

```bash
npx prisma validate
npx prisma format
npx prisma generate
npx prisma migrate dev
npx prisma db push
```

Tampoco esta autorizado todavia:

- crear migraciones;
- crear seeds;
- crear usuario administrador inicial;
- conectar backend con base de datos;
- desplegar staging o produccion;
- configurar proveedores reales;
- modificar el dominio por conveniencia tecnica;
- introducir IA, chatbot, embeddings o pgvector en el MVP funcional.

---

## Licencia

Pendiente de definicion.
