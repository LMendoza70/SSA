# Phase 02 Transfer Package

| Campo | Valor |
|--------|-------|
| Proyecto | SSA |
| Fase | 02 – Domain |
| Estado | Baseline |
| Fecha | 2026-07-03 |
| Preparado por | Architecture Team |

---

# 1. Propósito

Este documento marca el cierre oficial de la Fase 02 – Domain y constituye el paquete de transferencia hacia la Fase 03 – Architecture.

Su propósito es preservar el contexto del dominio y evitar que las siguientes fases reinterpreten el negocio.

La documentación oficial continúa siendo la única fuente de verdad.

---

# 2. Estado General

✅ Baseline aprobada.

Todos los documentos de Domain fueron revisados arquitectónicamente.

---

# 3. Documentos aprobados

- ubiquitous-language.md
- domain.md
- business-rules.md
- use-cases.md

---

# 4. Objetivos alcanzados

Durante esta fase se logró:

- Definir el Lenguaje Ubicuo oficial.
- Modelar el dominio conceptual.
- Formalizar las reglas de negocio.
- Definir los casos de uso institucionales.
- Establecer la frontera definitiva del dominio.
- Consolidar la trazabilidad entre Product y Architecture.

---

# 5. Decisiones Arquitectónicas Inmutables

## DA-009

El activo principal del sistema es el Conocimiento Institucional.

---

## DA-010

Content es la abstracción conceptual central del dominio.

---

## DA-011

Publicación es el término operativo institucional.

---

## DA-012

La Jurisdicción Sanitaria mantiene la responsabilidad institucional de toda publicación.

---

## DA-013

Los canales distribuyen información.

Nunca son fuente de verdad.

---

## DA-014

El dominio no conoce tecnología.

---

## DA-015

El dominio no conoce persistencia.

---

## DA-016

El dominio no conoce API.

---

## DA-017

La arquitectura deberá adaptarse al dominio.

Nunca al revés.

---

# 6. Restricciones

Architecture NO puede modificar:

- Vision
- Scope
- Product Principles
- Personas
- Ubiquitous Language
- Domain
- Business Rules
- Use Cases

---

# 7. Riesgos

Durante Architecture deberán evitarse:

- Acoplamiento entre módulos.
- Contaminación del dominio con decisiones técnicas.
- Duplicidad de modelos.
- Diseño basado en tablas.
- Diseño basado en endpoints.

---

# 8. Próxima Fase

Architecture

Documentos:

- architecture.md
- ADR-001...
- ADR-n

---

# 9. Objetivo de la Fase 03

Diseñar una arquitectura capaz de implementar íntegramente el dominio sin alterar el modelo de negocio aprobado.