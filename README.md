# Plataforma de Gestion, Comunicacion y Educacion para la Salud

Repositorio documental y tecnico de la **Plataforma de Gestion, Comunicacion y Educacion para la Salud** para la **Jurisdiccion Sanitaria de Huejutla de Reyes, Hidalgo**.

La capacidad central del producto es:

> **Publicar informacion confiable.**

El producto no es solamente un portal institucional. Su proposito es transformar el conocimiento institucional de salud publica en informacion oficial accesible, clara, confiable y util para la poblacion.

---

## Proposito del Proyecto

La plataforma permitira a la Jurisdiccion Sanitaria centralizar, organizar, validar, publicar, actualizar, preservar y distribuir informacion oficial de salud publica.

El activo principal del sistema es el **Conocimiento Institucional**. Ese conocimiento puede expresarse mediante publicaciones, campanas, informacion sobre enfermedades, comunicados, avisos, documentos, infografias, preguntas frecuentes, recursos visuales y memoria historica institucional.

La tecnologia es un medio para fortalecer la comunicacion publica, la prevencion, la educacion en salud y la confianza institucional.

---

## Vision del Producto

La plataforma debera convertirse en el principal mecanismo digital de comunicacion entre la Jurisdiccion Sanitaria y la poblacion.

Despues de utilizarla, una persona deberia poder:

- encontrar informacion oficial rapidamente;
- comprender mejor como prevenir enfermedades;
- identificar campanas vigentes;
- resolver dudas frecuentes con orientacion clara;
- acceder a materiales visuales y documentos confiables;
- confiar en la informacion publicada;
- regresar al portal cuando necesite orientacion institucional confiable.

Documento rector:

- `docs/01-product/vision.md`

---

## Alcance MVP

La version 1.0 esta orientada a entregar valor institucional temprano con un alcance controlado y realista.

El MVP contempla:

- gestion central de publicaciones y contenido institucional;
- portal publico para consulta de informacion publicada;
- busqueda basica;
- linea del tiempo publica y administrable;
- gestion multimedia basica;
- preparacion para compartir publicaciones en canales de comunicacion;
- administracion inicial mediante acceso autenticado;
- configuracion basica del sitio y elementos destacados;
- trazabilidad basica de fuente, validacion, autoria operativa y responsabilidad institucional.

Quedan fuera del MVP:

- chatbot RAG funcional;
- publicacion programada;
- republicacion avanzada;
- analitica avanzada;
- multiples roles y permisos complejos;
- busqueda semantica;
- flujos editoriales multinivel;
- expediente clinico;
- diagnostico;
- consulta medica;
- sistemas hospitalarios, de citas, farmacia, inventario o administracion clinica.

Documento rector:

- `docs/01-product/scope.md`

---

## Estado Actual

El proyecto se encuentra en etapa de documentacion arquitectonica y modelado del dominio.

| Fase | Estado | Documentos principales |
|---|---|---|
| Foundation | Baseline | `project-charter.md`, `architecture-guide.md` |
| Product | Baseline / Draft documental segun archivo | `vision.md`, `scope.md`, `product-principles.md`, `personas.md` |
| Domain | En cierre documental | `ubiquitous-language.md`, `domain.md`, `business-rules.md`, `use-cases.md` |
| Architecture | Pendiente | `architecture.md`, ADRs |
| Database | Pendiente | `database.md`, `erd.md`, `schema-prisma.md`, `schema.prisma` |
| API | Pendiente | `api.md`, `authentication.md` |
| Frontend | Pendiente | `frontend.md` |
| Backend | Pendiente | `backend.md` |
| AI | Pendiente | `chatbot.md`, `rag.md`, `embeddings.md` |
| DevOps | Pendiente | `deployment.md` |

Nota: el estado formal de cada documento debe tomarse del propio archivo.

---

## Documentacion Oficial

La documentacion es la fuente de verdad del proyecto. La conversacion, notas externas o decisiones informales no deben sustituir documentos oficiales.

Orden recomendado de lectura:

1. `PROJECT_TRANSFER_PACKAGE.md`
2. `CONTEXT_TRANSFER_PACKAGE.md`
3. `PHASE_01_TRANSFER_PACKAGE.md`
4. `ARCHITECTURE_ROADMAP.md`
5. `docs/00-foundation/project-charter.md`
6. `docs/00-foundation/architecture-guide.md`
7. `docs/01-product/vision.md`
8. `docs/01-product/scope.md`
9. `docs/01-product/product-principles.md`
10. `docs/01-product/personas.md`
11. `docs/02-domain/ubiquitous-language.md`
12. `docs/02-domain/domain.md`
13. `docs/02-domain/business-rules.md`
14. `docs/02-domain/use-cases.md`

Si existe una contradiccion entre documentos, debe reportarse antes de proponer, disenar o implementar una solucion.

---

## Estructura Documental

```text
docs/
|-- 00-foundation/
|   |-- project-charter.md
|   `-- architecture-guide.md
|-- 01-product/
|   |-- vision.md
|   |-- scope.md
|   |-- product-principles.md
|   `-- personas.md
|-- 02-domain/
|   |-- ubiquitous-language.md
|   |-- domain.md
|   |-- business-rules.md
|   `-- use-cases.md
|-- 03-architecture/
|   |-- architecture.md
|   `-- adr/
|       `-- README.md
|-- 04-database/
|   |-- database.md
|   |-- erd.md
|   |-- schema-prisma.md
|   `-- schema.prisma
|-- 05-api/
|   |-- api.md
|   `-- authentication.md
|-- 06-frontend/
|   `-- frontend.md
|-- 07-backend/
|   `-- backend.md
|-- 08-ai/
|   |-- chatbot.md
|   |-- rag.md
|   `-- embeddings.md
`-- 09-devops/
    `-- deployment.md
```

---

## Modelo del Dominio

El dominio del producto se entiende como:

> Gestion del ciclo de vida del conocimiento institucional para transformarlo en informacion oficial, confiable, clara, publicable, distribuible, actualizable y preservable.

Decisiones centrales del dominio:

- el activo principal es el Conocimiento Institucional;
- `Content` se mantiene como abstraccion conceptual central;
- `Publicacion` es el lenguaje institucional operativo;
- el flujo oficial es `Fuente -> Validacion -> Redaccion -> Publicacion`;
- la Jurisdiccion Sanitaria es responsable institucional de toda publicacion;
- los Programas de Salud son fuentes institucionales de conocimiento, no propietarios del contenido;
- una Campana es una iniciativa institucional temporal, no una publicacion individual;
- una Enfermedad es un concepto tematico, no una publicacion simple;
- la Linea del Tiempo representa memoria historica institucional;
- los Canales distribuyen informacion, no son fuente de verdad.

Documentos relacionados:

- `docs/02-domain/ubiquitous-language.md`
- `docs/02-domain/domain.md`
- `docs/02-domain/business-rules.md`
- `docs/02-domain/use-cases.md`

---

## Principios de Producto

El producto se gobierna por principios documentados en `docs/01-product/product-principles.md`.

Principios centrales:

- la informacion confiable es la capacidad principal;
- el conocimiento institucional es el activo principal;
- la claridad para la poblacion tiene prioridad;
- la prevencion y educacion en salud guian el valor del producto;
- la plataforma no es clinica, no diagnostica y no sustituye al personal de salud;
- el contenido institucional debe mantenerse organizado, vigente y trazable;
- los canales de comunicacion no deben reemplazar la fuente institucional;
- la documentacion forma parte del producto.

---

## Personas y Actores

El proyecto modela Personas como roles dentro del ecosistema del conocimiento institucional, no como perfiles demograficos ni personajes ficticios.

Personas:

- Ciudadano;
- Responsable Editorial;
- Profesional de la Salud;
- Estudiante;
- Investigador;
- Medio de Comunicacion;
- Autoridad Sanitaria;
- Administrador de Plataforma.

Actores Organizacionales:

- Jurisdiccion Sanitaria de Huejutla de Reyes, Hidalgo;
- Programas de Salud;
- Secretaria de Salud;
- Gobierno;
- Organismos Internacionales.

Documento relacionado:

- `docs/01-product/personas.md`

---

## Casos de Uso del MVP

Los casos de uso describen interacciones actor-dominio, no pantallas ni endpoints.

Casos de uso primarios definidos:

- consultar publicacion;
- buscar informacion publicada;
- consultar campana;
- consultar enfermedad;
- consultar linea del tiempo;
- iniciar sesion administrativa;
- crear publicacion;
- preparar informacion para publicacion;
- publicar informacion confiable;
- actualizar publicacion;
- retirar publicacion de consulta publica;
- archivar publicacion;
- clasificar publicacion;
- asociar recurso a publicacion;
- preparar publicacion para canales;
- gestionar campana;
- gestionar enfermedad como concepto tematico;
- gestionar evento historico institucional;
- consultar trazabilidad.

Documento relacionado:

- `docs/02-domain/use-cases.md`

---

## Enfoque Arquitectonico

La arquitectura debera proteger la vision del producto, evitar decisiones tecnicas prematuras y mantener coherencia documental.

Criterios permanentes:

- Clean Architecture;
- SOLID;
- DDD Lite;
- monolito modular;
- separacion entre dominio, aplicacion, infraestructura y presentacion;
- desacoplamiento de canales;
- contenido y conocimiento institucional como nucleo;
- evolucion sostenible antes que sobreingenieria;
- documentacion como parte del producto.

Guia rectora:

- `docs/00-foundation/architecture-guide.md`

---

## Tecnologia Prevista

La documentacion arquitectonica vigente considera el siguiente stack como referencia tecnica del proyecto:

- Frontend: React, TypeScript, Vite y Material UI.
- Backend: Node.js, NestJS y TypeScript.
- Base de datos: PostgreSQL.
- ORM: Prisma.
- Autenticacion: JWT, refresh tokens y Argon2.
- Editor de contenido: Tiptap.
- IA futura: chatbot basado en RAG sobre conocimiento institucional validado.

La IA no debe generar informacion publica sin supervision institucional y no es la capacidad central del producto.

---

## Reglas de Trabajo

Antes de implementar funcionalidades debe respetarse el orden documental:

```text
Project Charter
-> Vision
-> Scope
-> Product Principles
-> Personas
-> Ubiquitous Language
-> Domain
-> Business Rules
-> Use Cases
-> Architecture
-> Database
-> Prisma Schema
-> API
-> Frontend
-> Backend
-> AI
-> DevOps
-> Implementation
```

No debe generarse codigo si estan pendientes documentos esenciales de vision, alcance, principios, lenguaje ubicuo, dominio, reglas de negocio, arquitectura, base de datos o API.

---

## Limites del Producto

La plataforma no pretende:

- sustituir al personal de salud;
- emitir diagnosticos;
- reemplazar la consulta medica;
- almacenar expedientes clinicos;
- convertirse en un sistema hospitalario;
- convertirse en sistema de citas, farmacia o inventario medico;
- generar contenido sin supervision institucional;
- depender exclusivamente de redes sociales;
- priorizar tecnologia sobre claridad comunicativa.

---

## Convenciones

- Archivos documentales en Markdown.
- Nombres de archivos en `kebab-case`.
- Documentos organizados por carpetas numeradas.
- Cambios importantes deben mantener trazabilidad con la documentacion oficial.
- Las decisiones arquitectonicas relevantes deberan registrarse como ADR cuando corresponda.
- El estado formal de un documento debe declararse dentro del propio archivo.

---

## Licencia

Pendiente de definicion.
