# Plataforma de Gestion, Comunicacion y Educacion para la Salud

Repositorio documental y tecnico del proyecto **Plataforma de Gestion, Comunicacion y Educacion para la Salud** para la **Jurisdiccion Sanitaria de Huejutla de Reyes, Hidalgo**.

La capacidad central del producto es:

> **Publicar informacion confiable.**

El producto no busca ser solamente un portal institucional. Su proposito es transformar el conocimiento institucional de salud publica en conocimiento accesible, claro, confiable y util para la poblacion.

---

## Proposito del Proyecto

La plataforma permitira a la Jurisdiccion Sanitaria centralizar, organizar, publicar, preservar y distribuir informacion oficial de salud publica.

El conocimiento institucional es el activo principal del sistema. Este conocimiento puede expresarse como contenido publicable, recursos visuales, documentos, campanas, comunicados, avisos, informacion historica, preguntas frecuentes y materiales de orientacion para la poblacion.

La tecnologia es un medio para fortalecer la comunicacion publica, la prevencion, la educacion en salud y la confianza institucional.

---

## Vision del Producto

La plataforma debera convertirse en el principal mecanismo digital de comunicacion entre la Jurisdiccion Sanitaria y la poblacion.

Debe permitir que una persona pueda:

- encontrar informacion oficial rapidamente;
- comprender mejor como prevenir enfermedades;
- identificar campanas vigentes;
- resolver dudas frecuentes con orientacion clara;
- acceder a materiales visuales y documentos confiables;
- regresar al portal cuando necesite informacion institucional confiable.

El documento rector de esta vision es:

- `docs/01-product/vision.md`

---

## Alcance MVP

La version 1.0 esta orientada a entregar valor institucional temprano y controlar el alcance.

El MVP contempla:

- gestion central de contenido institucional;
- portal publico para consulta de informacion publicada;
- linea del tiempo publica y administrable;
- gestion multimedia basica;
- preparacion para compartir contenido en canales de comunicacion;
- administracion inicial mediante acceso autenticado;
- configuracion basica del sitio y contenido destacado;
- trazabilidad basica de fuente, autoria y responsabilidad institucional.

Quedan fuera del MVP capacidades como chatbot RAG funcional, publicacion programada, analitica avanzada, multiples roles, busqueda semantica, flujos editoriales avanzados, expediente clinico, diagnostico, consulta medica y sistemas hospitalarios o administrativos ajenos a la comunicacion y educacion en salud publica.

El documento rector del alcance es:

- `docs/01-product/scope.md`

---

## Documentacion Oficial

La documentacion es la fuente de verdad del proyecto. La conversacion o notas externas no deben sustituir los documentos oficiales.

Orden recomendado de lectura:

1. `PROJECT_TRANSFER_PACKAGE.md`
2. `CONTEXT_TRANSFER_PACKAGE.md`
3. `docs/00-foundation/project-charter.md`
4. `docs/00-foundation/architecture-guide.md`
5. `docs/01-product/vision.md`
6. `docs/01-product/scope.md`
7. `docs/01-product/product-principles.md`
8. `docs/01-product/personas.md`

Si existe una contradiccion entre documentos, debe reportarse antes de proponer o implementar una solucion.

---

## Estructura Documental

```text
docs/
├── 00-foundation/
│   ├── project-charter.md
│   └── architecture-guide.md
├── 01-product/
│   ├── vision.md
│   ├── scope.md
│   ├── product-principles.md
│   └── personas.md
├── 02-domain/
│   ├── ubiquitous-language.md
│   ├── domain.md
│   ├── business-rules.md
│   └── use-cases.md
├── 03-architecture/
│   ├── architecture.md
│   └── adr/
│       └── README.md
├── 04-database/
│   ├── database.md
│   ├── erd.md
│   ├── schema-prisma.md
│   └── schema.prisma
├── 05-api/
│   ├── api.md
│   └── authentication.md
├── 06-frontend/
│   └── frontend.md
├── 07-backend/
│   └── backend.md
├── 08-ai/
│   ├── chatbot.md
│   ├── rag.md
│   └── embeddings.md
└── 09-devops/
    └── deployment.md
```

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
- los canales de comunicacion no deben reemplazar la fuente institucional.

---

## Personas y Actores

El proyecto modela Personas como roles dentro del ecosistema del conocimiento institucional, no como perfiles demograficos o personajes ficticios.

Personas principales:

- Ciudadano;
- Responsable Editorial;
- Administrador de Plataforma;
- Profesional de la Salud;
- Estudiante;
- Autoridad Sanitaria;
- Investigador;
- Medio de Comunicacion.

Actores Organizacionales:

- Jurisdiccion Sanitaria;
- Programas de Salud;
- Secretaria de Salud;
- Gobierno;
- Organismos Internacionales como OMS / OPS.

Documento relacionado:

- `docs/01-product/personas.md`

---

## Enfoque Arquitectonico

La arquitectura debera proteger la vision del producto, evitar decisiones tecnicas prematuras y mantener coherencia documental.

Criterios permanentes:

- Clean Architecture;
- SOLID;
- DDD Lite;
- monolito modular;
- separacion entre dominio, aplicacion, infraestructura y presentacion;
- contenido y conocimiento institucional como nucleo;
- evolucion sostenible antes que sobreingenieria;
- documentacion como parte del producto.

La guia rectora es:

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

Project Charter → Vision → Scope → Product Principles → Personas → Ubiquitous Language → Domain → Business Rules → Use Cases → Architecture → Database → API → Frontend → Backend → AI → DevOps → Implementation.

No debe generarse codigo si estan pendientes documentos esenciales de vision, alcance, principios, lenguaje ubicuo, dominio, reglas de negocio, arquitectura, base de datos o API.

---

## Estado Actual

El proyecto se encuentra en etapa de documentacion fundacional y definicion arquitectonica.

Documentos ya elaborados:

- Project Charter;
- Architecture Guide;
- Vision;
- Scope;
- Product Principles;
- Personas.

Documentos posteriores preparados:

- Ubiquitous Language;
- Domain;
- Business Rules;
- Use Cases;
- Architecture;
- Database;
- API;
- Frontend;
- Backend;
- AI;
- DevOps.

---

## Limites del Producto

La plataforma no pretende:

- sustituir al personal de salud;
- emitir diagnosticos;
- reemplazar la consulta medica;
- almacenar expedientes clinicos;
- convertirse en un sistema hospitalario;
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

---

## Licencia

Pendiente de definicion.
