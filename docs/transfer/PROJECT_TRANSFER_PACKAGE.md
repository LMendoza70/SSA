# PROJECT TRANSFER PACKAGE
Version: 1.0
Estado: OFICIAL
Fecha: 2026-07-02

---

# IMPORTANTE

Este documento representa el estado oficial del proyecto.

Debe ser leído completamente antes de continuar cualquier desarrollo.

NO volver a realizar entrevistas de descubrimiento del producto.

NO volver a preguntar sobre la visión del sistema.

Toda esa etapa ya fue concluida.

El siguiente paso del proyecto consiste en redactar el documento:

docs/01-product/vision.md

---

# ROL DEL ASISTENTE

A partir de este momento el asistente debe asumir permanentemente el siguiente rol.

Software Architect
Product Architect
Solution Architect

Responsabilidades:

• Guiar el diseño del producto antes de escribir código.

• Cuestionar cualquier decisión que pueda afectar la mantenibilidad.

• Priorizar la arquitectura sobre la velocidad de implementación.

• Mantener coherencia entre todos los documentos del proyecto.

• Evitar generar código cuando aún existan decisiones de negocio sin resolver.

• Documentar todas las decisiones importantes.

• Pensar siempre en la evolución del sistema a 10 años.

El asistente no actúa únicamente como un generador de código.

Actúa como el Arquitecto del Producto.

---

# ROL DEL USUARIO

Lead Developer

Responsabilidades

• Responsable funcional del proyecto.

• Toma la decisión final.

• Implementará el sistema.

• Validará las propuestas arquitectónicas.

---

# DESCRIPCIÓN DEL PROYECTO

Nombre provisional

Plataforma de Gestión, Comunicación y Educación para la Salud

Cliente

Jurisdicción Sanitaria de Huejutla de Reyes Hidalgo

---

# PROBLEMA ACTUAL

Actualmente la Jurisdicción no cuenta con un portal institucional.

La comunicación con la población ocurre principalmente mediante redes sociales.

La información se encuentra dispersa.

No existe un repositorio institucional del conocimiento.

No existe una plataforma que centralice la generación y difusión del contenido.

---

# PROPÓSITO DEL PROYECTO

Construir una plataforma que permita generar, administrar, preservar y distribuir información oficial relacionada con la salud pública utilizando los canales de comunicación consumidos por la población.

---

# MISIÓN DESCUBIERTA

Garantizar que la población tenga acceso oportuno a información oficial, confiable, clara y comprensible sobre salud pública utilizando los canales de comunicación más relevantes.

---

# VISIÓN DESCUBIERTA

Convertirse en la principal plataforma digital de comunicación y educación para la salud de la Jurisdicción Sanitaria, centralizando el conocimiento institucional y distribuyéndolo mediante los canales utilizados por la población para fortalecer la prevención y el cuidado de la salud.

---

# OBJETIVO PRINCIPAL

Publicar información confiable.

Todo el sistema gira alrededor de esta capacidad.

El chatbot, las redes sociales, el buscador, la línea del tiempo y el CMS existen para apoyar este objetivo.

---

# PÚBLICO OBJETIVO

Principal

La población en general.

Secundario

Personal de salud.

Estudiantes.

Autoridades.

Investigadores.

Medios de comunicación.

---

# IMPACTO ESPERADO

Dentro de diez años se espera que:

La población esté mejor informada.

Las campañas preventivas tengan mayor alcance.

La información oficial llegue mediante los medios consumidos por la población.

La plataforma sea considerada una fuente confiable.

---

# PRINCIPIOS DEL PRODUCTO

1.
Información confiable.

2.
Lenguaje claro.

3.
Contenido fácil de comprender.

4.
Uso intensivo de recursos visuales.

5.
Adaptabilidad a nuevos canales de comunicación.

6.
La tecnología es un medio.

No el objetivo.

7.
La prevención tiene prioridad.

8.
El conocimiento debe ser accesible.

---

# DIFERENCIADOR DEL PRODUCTO

No será otro portal gubernamental.

Será una plataforma donde:

La información sea fácil de encontrar.

Las infografías faciliten el aprendizaje.

El chatbot resuelva dudas.

El contenido esté actualizado.

La población tenga motivos para regresar.

---

# FUNCIONALIDADES IDENTIFICADAS

CMS

Noticias

Enfermedades

Campañas

Programas

Eventos

Documentos

Infografías

FAQ

Información Institucional

Línea del tiempo

Chatbot RAG

Buscador

SEO

Publicación en redes sociales

Programación de publicaciones

Republicación

Gestor multimedia

Administración del sitio

---

# DESCUBRIMIENTOS IMPORTANTES

El administrador NO es el creador del conocimiento.

Es el responsable institucional de publicarlo.

La información puede provenir de:

Programas.

Secretaría de Salud.

Gobierno.

OMS.

OPS.

Información histórica.

Contenido propio.

---

# DECISIONES ARQUITECTÓNICAS

No diseñar primero la base de datos.

Orden del proyecto

Vision

↓

Scope

↓

Lenguaje Ubicuo

↓

Dominio

↓

Reglas del Negocio

↓

Arquitectura

↓

Base de Datos

↓

API

↓

Código

---

# MODELO DEL DOMINIO

Todo gira alrededor del concepto:

Content

No existirán múltiples modelos independientes.

Noticias

Campañas

Enfermedades

Eventos

Documentos

Infografías

FAQ

Programas

Todos derivarán del concepto Content.

---

# STACK TECNOLÓGICO ACORDADO

Frontend

React

TypeScript

Vite

Material UI

Backend

NestJS

TypeScript

ORM

Prisma

Base de datos

PostgreSQL

Autenticación

JWT

Refresh Tokens

Argon2

Editor

Tiptap

Arquitectura

Clean Architecture

SOLID

DDD Lite

Modular Monolith

---

# DESPLIEGUE

Cloud Ready.

Durante desarrollo

Render

Railway

Vercel

Posteriormente

Servidor institucional

AWS

Azure

Google Cloud

---

# DOCUMENTACIÓN PLANIFICADA

00-product

vision.md

scope.md

product-principles.md

personas.md

01-domain

ubiquitous-language.md

domain.md

business-rules.md

use-cases.md

02-architecture

architecture.md

03-database

database.md

erd.md

schema-prisma.md

04-api

api.md

authentication.md

05-frontend

frontend.md

06-backend

backend.md

07-ai

chatbot.md

rag.md

embeddings.md

08-devops

deployment.md

---

# ESTADO ACTUAL

FASE

Descubrimiento del Producto

Estado

COMPLETADO

Descubrimiento inicial ✔

Objetivos ✔

Público ✔

Misión ✔

Visión ✔

Principios ✔

Tecnologías ✔

Arquitectura inicial ✔

Pendiente

Redactar vision.md

---

# QUÉ NO DEBE HACER EL NUEVO ASISTENTE

No volver a preguntar:

¿Por qué nace el proyecto?

¿Quién es el usuario?

¿Cuál es el objetivo?

¿Qué tecnologías usar?

Todo eso ya fue definido.

---

# PRÓXIMO PASO

Redactar

docs/01-product/vision.md

Debe ser un documento profesional.

No una introducción.

Debe servir como fundamento para todos los documentos posteriores.

---

# PROMPT PARA CONTINUAR EL PROYECTO

Actúa como el Software Architect y Product Architect de este proyecto.

Lee completamente el archivo PROJECT_TRANSFER_PACKAGE.md antes de responder.

No vuelvas a realizar preguntas sobre la visión del producto, ya fueron resueltas.

Considera este documento como la fuente oficial del estado del proyecto.

Trabajaremos siguiendo una metodología basada en:

Vision → Scope → Domain → Architecture → Database → API → Implementación.

Tu responsabilidad principal será ayudarme a construir un producto de software de calidad empresarial, documentando y justificando todas las decisiones arquitectónicas antes de escribir código.

El siguiente entregable es:

docs/01-product/vision.md

Quiero que ese documento tenga calidad profesional y sirva como base para todo el proyecto.
