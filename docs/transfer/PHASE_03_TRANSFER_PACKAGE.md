# PHASE_03_TRANSFER_PACKAGE.md

# Phase 03 Transfer Package

## Proyecto

**Plataforma de Gestión, Comunicación y Educación para la Salud (SSA)**

---

# Estado del Proyecto

```text
Foundation      ✅ Baseline
Product         ✅ Baseline
Domain          ✅ Baseline
Architecture    ✅ Baseline

Current Phase:

Phase 04 — Database
```

La Fase 03 se considera concluida y aprobada.

El documento `docs/03-architecture/architecture.md` constituye la referencia arquitectónica oficial del proyecto.

---

# Objetivo de la Fase 03

El propósito de la Fase 03 fue definir la arquitectura técnica completa del sistema sin invadir fases posteriores.

La arquitectura debía:

* preservar íntegramente el dominio;
* traducir el conocimiento del negocio en una arquitectura sostenible;
* establecer reglas para las fases siguientes;
* evitar decisiones prematuras de implementación;
* convertirse en el documento rector técnico del proyecto.

La tecnología debía adaptarse al dominio.

Nunca al contrario.

---

# Documentos Utilizados

Durante esta fase se utilizaron como fuente oficial:

## Foundation

* Project Charter
* Architecture Guide

## Product

* Vision
* Scope
* Product Principles
* Personas

## Domain

* Ubiquitous Language
* Domain
* Business Rules
* Use Cases

Además de:

* PROJECT_TRANSFER_PACKAGE.md
* CONTEXT_TRANSFER_PACKAGE.md
* PHASE_01_TRANSFER_PACKAGE.md
* PHASE_02_TRANSFER_PACKAGE.md
* ARCHITECTURE_ROADMAP.md

No se redefinió ninguno de estos documentos.

Toda la arquitectura deriva de ellos.

---

# Documento Generado

La Fase 03 produce como documento principal:

```text
docs/03-architecture/architecture.md
```

Este documento pasa a formar parte de la baseline del proyecto.

---

# Resultado Alcanzado

La arquitectura dejó de describir únicamente componentes técnicos.

Ahora representa explícitamente el dominio institucional.

El proyecto deja de entenderse como un CMS y pasa a concebirse como una plataforma para la gestión del conocimiento institucional en salud pública.

La arquitectura quedó alineada con la filosofía del producto y del dominio.

---

# Decisiones Arquitectónicas Aprobadas

## ADR-001

### Knowledge Core como núcleo arquitectónico

El sistema se organiza alrededor del concepto de **Knowledge Core**.

Este núcleo representa el conocimiento institucional y su ciclo de vida.

No representa una carpeta.

No representa un módulo físico.

No representa un microservicio.

No representa una clase.

Es un concepto arquitectónico.

---

## ADR-002

### Arquitectura híbrida con prioridad al dominio

Los módulos principales representan capacidades del negocio.

Las capacidades técnicas permanecen como soporte transversal.

El dominio gobierna la arquitectura.

La infraestructura sirve al dominio.

---

## ADR-003

### Modular Monolith

La primera versión del sistema se implementará como Modular Monolith.

La decisión privilegia:

* simplicidad;
* mantenibilidad;
* cohesión;
* evolución incremental;
* facilidad de despliegue.

No se descarta una futura evolución.

No existe necesidad actual de microservicios.

---

## ADR-004

### Clean Architecture

La arquitectura adopta Clean Architecture como regla principal de dependencia.

Las dependencias siempre apuntan hacia el dominio.

El dominio permanece independiente de:

* frameworks;
* persistencia;
* API;
* interfaz de usuario;
* proveedores externos.

---

## ADR-005

### Módulos orientados al dominio

La organización arquitectónica se basa en capacidades del dominio y no en elementos técnicos.

Entre ellas:

* Knowledge Core
* Publications
* Campaigns
* Diseases
* Timeline
* Media Resources
* Communication Channels
* Public Consultation
* Search
* Administration
* Identity & Access

---

## ADR-006

### Canales desacoplados

Los canales de comunicación son únicamente mecanismos de distribución.

Nunca representan la fuente oficial de la información.

La publicación institucional siempre se origina dentro del sistema.

---

## ADR-007

### IA como capacidad futura

La arquitectura queda preparada para incorporar IA.

Sin embargo:

* la IA no gobierna el sistema;
* la IA no reemplaza al conocimiento institucional;
* la IA únicamente podrá trabajar sobre información validada.

---

# Principios Arquitectónicos Consolidados

Durante esta fase quedaron consolidados los siguientes principios.

* Documentation First.
* Domain First.
* Architecture First.
* Clean Architecture.
* Modular Monolith.
* SOLID.
* Separation of Concerns.
* DRY.
* KISS.

La arquitectura deberá preservar estos principios en todas las fases posteriores.

---

# Knowledge Core

Una de las decisiones más importantes del proyecto consiste en reconocer que el verdadero activo institucional es el conocimiento.

El sistema no administra únicamente publicaciones.

Administra conocimiento institucional.

El flujo conceptual aprobado permanece como referencia obligatoria:

```text
Conocimiento Institucional
        ↓
Información Oficial
        ↓
Content
        ↓
Publicación
        ↓
Distribución
```

Este flujo no debe modificarse en fases posteriores.

---

# Knowledge Lifecycle

La arquitectura incorpora además el concepto de ciclo de vida del conocimiento.

```text
Fuente

↓

Validación

↓

Redacción

↓

Content

↓

Publicación

↓

Distribución

↓

Consulta Pública

↓

Actualización

↓

Archivado

↓

Memoria Institucional
```

Este ciclo orientará las decisiones de persistencia, API y futuras capacidades de IA.

---

# Restricciones Arquitectónicas

Quedan establecidas las siguientes restricciones.

No diseñar desde:

* tablas;
* endpoints;
* controladores;
* ORM;
* frameworks;
* interfaces gráficas.

Toda decisión deberá derivarse del dominio.

---

# Riesgos Mitigados

Durante la Fase 03 quedaron mitigados los siguientes riesgos.

## Convertir el sistema en un CMS

Mitigado mediante Knowledge Core.

---

## Diseñar desde Content

Mitigado mediante la incorporación del Conocimiento Institucional como activo principal.

---

## Acoplar dominio e infraestructura

Mitigado mediante Clean Architecture.

---

## Diseñar desde la tecnología

Mitigado mediante Domain First.

---

## Acoplar canales externos

Mitigado mediante adaptadores futuros.

---

## Introducir IA prematuramente

Mitigado estableciendo IA como capacidad futura.

---

# Riesgos Pendientes

Los siguientes riesgos deberán vigilarse en fases posteriores.

* Diseñar la base de datos antes del modelo de persistencia.
* Introducir reglas de negocio dentro de Prisma.
* Diseñar la API desde endpoints.
* Duplicar el dominio en modelos técnicos.
* Confundir Content con Knowledge Core.
* Romper la independencia del dominio.
* Introducir complejidad innecesaria.

---

# Qué NO debe volver a discutirse

Las siguientes decisiones se consideran cerradas.

* Filosofía Documentation First.
* Filosofía Domain First.
* Filosofía Architecture First.
* Knowledge Core.
* Knowledge Lifecycle.
* Modular Monolith.
* Clean Architecture.
* Organización por módulos de dominio.
* Capacidades transversales.
* Canales desacoplados.
* IA como capacidad futura.
* La documentación forma parte del producto.
* El dominio no conoce tecnología.

Estas decisiones forman parte de la baseline.

---

# Preparación para la Fase 04

La siguiente fase corresponde a:

```text
Phase 04 — Database
```

Su propósito NO será diseñar tablas inmediatamente.

Primero deberá definirse el modelo de persistencia derivado del dominio y de la arquitectura.

La base de datos deberá adaptarse al dominio.

Nunca al contrario.

---

# Información Disponible para la Fase 04

La Fase 04 puede asumir como completamente definidos:

* visión;
* alcance;
* principios del producto;
* personas;
* lenguaje ubicuo;
* dominio;
* reglas de negocio;
* casos de uso;
* arquitectura;
* módulos;
* restricciones arquitectónicas;
* reglas de dependencia.

No deberá volver a descubrir esta información.

---

# Dinámica de Trabajo Consolidada

Durante esta fase quedó establecida la siguiente forma de colaboración.

El asistente debe actuar como:

* Lead Software Architect;
* Solution Architect;
* Domain Architect.

Debe:

* proteger la arquitectura;
* preservar la baseline;
* detectar contradicciones;
* justificar decisiones importantes;
* tomar decisiones cuando la información sea suficiente;
* formular preguntas únicamente cuando exista un verdadero bloqueo arquitectónico.

Cuando el usuario solicite un entregable, deberá generarlo directamente.

Las propuestas adicionales deberán limitarse a situaciones donde exista un riesgo real para el proyecto.

El flujo de trabajo consolidado es:

```text
Análisis

↓

Decisiones

↓

Prompt para Codex

↓

Documento

↓

Architecture Review

↓

Corrección (si aplica)

↓

Aprobación

↓

Transfer Package

↓

Siguiente Fase
```

Esta dinámica forma parte del proyecto y deberá mantenerse en las conversaciones futuras.

---

# Estado Final de la Fase

```text
Foundation      ✅
Product         ✅
Domain          ✅
Architecture    ✅

Baseline consolidada.
```

La Fase 03 concluye formalmente.

La siguiente conversación deberá iniciar directamente en **Phase 04 — Database**, utilizando este documento y el nuevo `CONTEXT_TRANSFER_PROMPT.md` como referencia oficial.
