# CONTEXT_TRANSFER_PACKAGE.md

**Proyecto:** Plataforma de Gestión, Comunicación y Educación para la Salud
**Cliente:** Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo
**Versión:** 2.0.0
**Estado:** Vigente
**Fecha:** 2026-07-02

---

# Propósito

Este documento representa el contexto oficial del proyecto y constituye el punto de entrada para cualquier nueva conversación, desarrollador o agente de IA.

A partir de esta versión, **la documentación sustituye al historial de conversaciones como fuente principal de contexto**.

Ningún asistente deberá depender del historial del chat para comprender el estado del proyecto.

---

# Estado del Proyecto

El proyecto ha concluido la fase de descubrimiento del producto.

Actualmente se encuentra en la fase de definición arquitectónica y documentación.

No deben repetirse entrevistas de descubrimiento ni redefinirse:

* propósito;
* misión;
* visión;
* público objetivo;
* principios del producto;
* tecnologías base;
* arquitectura general.

Todas esas decisiones ya fueron tomadas y documentadas.

---

# Objetivo del Producto

El producto consiste en desarrollar una plataforma institucional para la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

La capacidad central del sistema es:

> **Publicar información confiable.**

Toda funcionalidad deberá contribuir directa o indirectamente a este objetivo.

---

# Estado de la Documentación

## Foundation

* ✅ project-charter.md
* ✅ architecture-guide.md

## Product

* ✅ vision.md
* ✅ scope.md
* ⬜ product-principles.md
* ⬜ personas.md

## Domain

* ⬜ ubiquitous-language.md
* ⬜ domain.md
* ⬜ business-rules.md
* ⬜ use-cases.md

## Architecture

* ⬜ architecture.md
* ⬜ ADRs

## Database

* ⬜ database.md
* ⬜ erd.md
* ⬜ schema-prisma.md
* ⬜ schema.prisma

## API

* ⬜ api.md
* ⬜ authentication.md

## Frontend

* ⬜ frontend.md

## Backend

* ⬜ backend.md

## AI

* ⬜ chatbot.md
* ⬜ rag.md
* ⬜ embeddings.md

## DevOps

* ⬜ deployment.md

---

# Decisiones Arquitectónicas Aprobadas

Las siguientes decisiones ya están aprobadas y no deberán replantearse sin una justificación formal.

* El producto gira alrededor de publicar información confiable.
* La información institucional constituye el activo principal del sistema.
* El conocimiento institucional será representado mediante contenido estructurado.
* El dominio tendrá como abstracción principal el concepto **Content**.
* El proyecto seguirá Clean Architecture.
* Se aplicarán principios SOLID.
* Se utilizará DDD Lite.
* La arquitectura inicial será un Modular Monolith.
* No se implementarán microservicios en la primera versión.
* El sistema será Cloud Ready.
* La documentación forma parte del producto.
* No se desarrollará código antes de completar el modelado del dominio.

---

# Stack Tecnológico

## Frontend

* React
* TypeScript
* Vite
* Material UI

## Backend

* NestJS
* TypeScript

## Persistencia

* PostgreSQL
* Prisma ORM

## Seguridad

* JWT
* Refresh Tokens
* Argon2

## Editor

* Tiptap

---

# Principios Permanentes

Los siguientes principios son inmutables:

* Información confiable.
* Lenguaje claro.
* Contenido fácil de comprender.
* Prevención antes que reacción.
* Tecnología como medio.
* Adaptabilidad a nuevos canales.
* Accesibilidad del conocimiento.
* Evolución a largo plazo.
* Bajo acoplamiento.
* Alta mantenibilidad.

---

# Convenciones del Proyecto

* La documentación es la fuente de verdad.
* No generar código prematuramente.
* No diseñar primero la base de datos.
* No diseñar primero la API.
* Todo parte del dominio.
* Toda decisión importante debe justificarse.
* Todo cambio importante debe documentarse.
* Evitar duplicidad entre documentos.
* Mantener coherencia documental permanente.

---

# Orden Oficial del Proyecto

Project Charter

↓

Architecture Guide

↓

Vision

↓

Scope

↓

Product Principles

↓

Personas

↓

Ubiquitous Language

↓

Domain

↓

Business Rules

↓

Use Cases

↓

Architecture

↓

Database

↓

Prisma Schema

↓

API

↓

Frontend

↓

Backend

↓

AI

↓

DevOps

↓

Implementation

---

# Forma de Trabajo

En cada documento se deberá:

* mantener consistencia con los anteriores;
* evitar contradicciones;
* justificar decisiones importantes;
* separar negocio de implementación;
* pensar en una evolución mínima de diez años;
* escribir documentación útil tanto para personas como para agentes de IA.

Si existe contradicción entre documentos, deberá reportarse antes de proponer cambios.

---

# Próximo Entregable

El siguiente documento a desarrollar es:

`docs/01-product/product-principles.md`

No deberá avanzarse al siguiente documento hasta terminar y revisar completamente este.
