# Guía de Arquitectura y Documentación

| Campo | Valor |
|--------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Guía de Arquitectura y Documentación |
| Código | DOC-003 |
| Versión | 1.0.0 |
| Estado | Draft |
| Autor | Equipo del Proyecto |
| Rol arquitectónico | Software Architect, Product Architect & Solution Architect |
| Fecha | 2026-07-02 |

---

# 1. Propósito del Documento

Este documento define la guía fundacional de arquitectura, documentación y toma de decisiones para la **Plataforma de Gestión, Comunicación y Educación para la Salud** de la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su propósito es establecer reglas de trabajo, criterios de arquitectura, orden documental, principios de diseño y criterios de decisión que deberán observarse durante todo el proyecto.

Esta guía funciona como una constitución del proyecto para humanos y agentes de IA. Su objetivo es proteger la visión, evitar decisiones prematuras, mantener coherencia documental y asegurar que cada decisión contribuya al propósito central:

> **Publicar información confiable.**

Este documento no sustituye a `architecture.md`. Lo prepara.

`architecture.md` deberá definir posteriormente la arquitectura técnica formal del sistema. Esta guía establece los criterios y restricciones que deberán orientar ese documento y todos los entregables posteriores.

---

# 2. Fuentes Oficiales de Verdad

El proyecto deberá tomar decisiones con base en documentos oficiales y validados.

El orden de autoridad documental es:

1. `PROJECT_TRANSFER_PACKAGE.md`
2. `docs/00-foundation/project-charter.md`
3. `docs/01-product/vision.md`
4. `docs/01-product/scope.md`
5. Documentos posteriores validados

Nota de estructura: la visión y el alcance vigentes se encuentran en `docs/01-product`.

Si existe contradicción entre documentos, el equipo o agente responsable deberá reportarla antes de proponer una solución. No deberá resolver contradicciones de forma silenciosa ni asumir cambios de visión, alcance o dominio sin dejar evidencia documental.

---

# 3. Rol del Arquitecto

El Arquitecto del proyecto actúa como Software Architect, Product Architect y Solution Architect.

Sus responsabilidades son:

- proteger la visión del producto;
- evitar decisiones técnicas prematuras;
- mantener coherencia documental;
- identificar riesgos funcionales, técnicos y organizacionales;
- justificar decisiones relevantes;
- priorizar mantenibilidad sobre velocidad aparente;
- pensar en evolución a más de diez años;
- cuestionar decisiones que fragmenten el dominio;
- asegurar que las decisiones se alineen con publicar información confiable;
- evitar que el producto se convierta en una plataforma clínica, hospitalaria o ajena a la comunicación pública.

El Arquitecto no debe actuar como generador automático de código. Su primera responsabilidad es preservar la calidad estructural del producto.

---

# 4. Rol del Lead Developer

El Lead Developer es responsable funcional y técnico de la implementación.

Sus responsabilidades son:

- validar decisiones propuestas por arquitectura;
- implementar el sistema;
- mantener documentación sincronizada con el desarrollo;
- tomar decisiones finales cuando existan alternativas razonables;
- reportar desviaciones de visión, alcance, arquitectura o dominio;
- solicitar aclaración cuando una decisión pueda afectar mantenibilidad, seguridad o evolución futura;
- asegurar que el código implementado respete las decisiones documentadas.

El Lead Developer podrá ajustar decisiones tácticas durante la implementación, pero los cambios relevantes deberán documentarse y mantenerse consistentes con esta guía.

---

# 5. Principios Permanentes del Producto

Los principios permanentes del producto son:

- información confiable;
- lenguaje claro;
- contenido fácil de comprender;
- uso de recursos visuales para facilitar aprendizaje;
- adaptabilidad a nuevos canales de comunicación;
- tecnología como medio, no como fin;
- prevención como prioridad;
- accesibilidad del conocimiento para la población.

Estos principios no son aspiracionales. Deben actuar como criterios de aceptación para decisiones de producto, arquitectura, diseño, contenido y operación.

---

# 6. Principios de Arquitectura

## 6.1 Clean Architecture

La arquitectura deberá separar responsabilidades y proteger el dominio del producto frente a detalles de infraestructura, frameworks o proveedores externos.

Las reglas de negocio no deberán depender de detalles técnicos accidentales.

## 6.2 SOLID

El diseño deberá favorecer componentes con responsabilidades claras, bajo acoplamiento y capacidad de cambio.

SOLID deberá aplicarse como criterio práctico de mantenibilidad, no como sobreingeniería.

## 6.3 DDD Lite

El proyecto deberá modelarse desde el dominio institucional de comunicación y educación en salud pública.

El lenguaje del sistema deberá reflejar conceptos del negocio como conocimiento institucional, contenido, publicación, fuente, canal, recurso multimedia y línea del tiempo.

## 6.4 Modular Monolith

El sistema deberá iniciar como un monolito modular.

Los límites internos deberán ser claros, pero no se deberán introducir microservicios prematuros. La separación lógica deberá preparar evolución futura sin aumentar innecesariamente complejidad operativa.

## 6.5 Separación de Capas

El diseño deberá separar dominio, aplicación, infraestructura y presentación.

Esta separación deberá evitar que reglas institucionales queden mezcladas con detalles de interfaz, persistencia, proveedores externos o mecanismos técnicos.

## 6.6 Desacoplamiento de Canales

Los canales de comunicación deberán tratarse como mecanismos de distribución reemplazables.

El contenido institucional debe existir independientemente de Facebook, Instagram, X, TikTok, YouTube, WhatsApp u otros canales presentes o futuros.

## 6.7 Contenido y Conocimiento como Núcleo

El núcleo del sistema es el conocimiento institucional transformado en contenido confiable, organizado y publicable.

Las funcionalidades deben existir para preservar, organizar, publicar, distribuir o facilitar la consulta de ese conocimiento.

## 6.8 Evolución antes que Sobreingeniería

El diseño deberá permitir evolución futura sin construir complejidad innecesaria en el MVP.

Se deberá evitar resolver problemas que aún no existen cuando eso comprometa claridad, entrega o mantenibilidad.

## 6.9 Documentación como Parte del Producto

La documentación no es un entregable accesorio. Es parte del producto.

Cada decisión relevante deberá estar documentada de forma clara para que desarrolladores, arquitectos y agentes de IA puedan continuar el proyecto sin repetir descubrimiento.

---

# 7. Orden Obligatorio de Trabajo

El proyecto deberá avanzar siguiendo este flujo documental y conceptual:

1. Project Charter
2. Vision
3. Scope
4. Product Principles
5. Personas
6. Ubiquitous Language
7. Domain
8. Business Rules
9. Use Cases
10. Architecture
11. Database
12. Prisma Schema
13. API
14. Frontend
15. Backend
16. AI
17. DevOps
18. Implementation

Este orden no deberá alterarse sin justificación arquitectónica explícita.

La razón de este flujo es evitar código prematuro, decisiones de infraestructura antes de comprender el dominio y diseños técnicos que contradigan la visión del producto.

---

# 8. Reglas para Crear Documentación

Cada documento del proyecto deberá:

- tener propósito claro;
- indicar alcance;
- justificar decisiones relevantes;
- evitar ambigüedades;
- no duplicar innecesariamente otros documentos;
- ser entendible por humanos y agentes de IA;
- mantenerse consistente con documentos anteriores;
- indicar estado, versión y fecha;
- separar hechos, decisiones, supuestos y pendientes;
- evitar introducir decisiones que pertenezcan a documentos posteriores.

Cuando un documento dependa de otro, deberá respetar su autoridad. Si necesita modificarlo, deberá indicar la contradicción o cambio requerido en lugar de resolverlo de manera implícita.

---

# 9. Reglas para Tomar Decisiones Arquitectónicas

Toda decisión importante deberá responder:

- ¿Qué problema resuelve?
- ¿Qué alternativas existen?
- ¿Por qué se elige esta opción?
- ¿Qué riesgos introduce?
- ¿Qué impacto tiene en mantenibilidad?
- ¿Qué impacto tiene en evolución futura?
- ¿Cómo se alinea con publicar información confiable?

Las decisiones no deberán justificarse únicamente por preferencia tecnológica, familiaridad del equipo o facilidad inmediata.

Una decisión arquitectónica válida debe fortalecer el propósito institucional, proteger el dominio y permitir evolución sostenible.

---

# 10. Reglas para Evitar Código Prematuro

No deberá generarse código si están pendientes o no han sido validados los documentos o decisiones de:

- visión;
- alcance;
- principios de producto;
- lenguaje ubicuo;
- dominio;
- reglas de negocio;
- arquitectura;
- base de datos;
- API.

La implementación debe ocurrir después de comprender el dominio y definir las reglas necesarias.

Generar código antes de documentar estas decisiones aumenta el riesgo de retrabajo, acoplamiento, ambigüedad funcional y desviación del propósito central.

---

# 11. Reglas para el Dominio

El núcleo conceptual del producto gira alrededor del conocimiento y contenido institucional.

`Content` será una abstracción central en el modelo del sistema, pero el lenguaje de dominio deberá mantener una visión institucional: contenido institucional como activo de conocimiento publicable, trazable, reutilizable y asociado a fuentes oficiales.

Noticias, campañas, enfermedades, programas, eventos, documentos, infografías y preguntas frecuentes no deberán modelarse como sistemas aislados sin análisis previo. Deberán entenderse inicialmente como variantes o especializaciones de contenido institucional.

El dominio deberá distinguir, como mínimo:

- conocimiento institucional;
- contenido;
- publicación;
- fuente;
- canal;
- recurso multimedia;
- línea del tiempo;
- responsabilidad institucional.

No deberá diseñarse la base de datos antes de comprender el dominio.

Las tablas, esquemas y persistencia deberán derivarse del modelo de dominio, no al revés.

---

# 12. Reglas para la Arquitectura Técnica

Las decisiones técnicas base del proyecto son:

- backend con NestJS;
- frontend con React, TypeScript, Vite y Material UI;
- PostgreSQL como base de datos;
- Prisma como ORM;
- JWT, refresh tokens y Argon2 para autenticación;
- Tiptap como editor;
- monolito modular como estilo inicial;
- diseño cloud-ready sin dependencia rígida de un proveedor específico.

Estas decisiones deberán aplicarse sin introducir microservicios prematuros ni acoplamientos innecesarios.

El sistema deberá organizarse para que módulos y capacidades puedan evolucionar sin romper el núcleo de contenido institucional.

La arquitectura técnica formal será definida posteriormente en `architecture.md`. Este documento solo establece las reglas y restricciones fundacionales.

---

# 13. Reglas para IA y Automatización

La IA no debe generar información pública sin supervisión institucional.

El chatbot futuro deberá usar únicamente conocimiento institucional validado, publicado o aprobado por la institución.

La estrategia de IA deberá evitar alucinaciones mediante un enfoque de recuperación de conocimiento institucional antes de generar respuestas.

Se deberá priorizar trazabilidad de fuentes, claridad de límites y responsabilidad institucional.

La IA es una capacidad secundaria. No es el objetivo central del producto.

El objetivo central sigue siendo publicar información confiable y facilitar el acceso de la población a conocimiento oficial.

---

# 14. Reglas para Canales de Comunicación

El sistema no deberá acoplarse a una red social específica.

Facebook, Instagram, X, TikTok, YouTube, WhatsApp u otros medios deberán tratarse como canales reemplazables.

El contenido debe existir independientemente del canal.

La distribución del contenido no deberá comprometer la confiabilidad, trazabilidad ni responsabilidad institucional.

Los canales de comunicación son mecanismos de difusión. No son la fuente de verdad del sistema.

---

# 15. Reglas de Seguridad y Confianza

El sistema deberá proteger la confianza institucional.

Las reglas mínimas son:

- acceso administrativo autenticado;
- publicación con responsabilidad institucional;
- protección contra publicación anónima;
- trazabilidad mínima de fuente, autoría o responsable;
- no procesar datos clínicos personales;
- no convertir el sistema en expediente clínico;
- no emitir diagnósticos;
- no reemplazar atención médica profesional;
- mantener supervisión institucional sobre contenido público.

La seguridad no debe entenderse únicamente como protección técnica. También incluye responsabilidad, trazabilidad y confiabilidad de la información publicada.

---

# 16. Reglas para Cambios de Alcance

Una nueva funcionalidad solo deberá aceptarse si:

- fortalece publicar información confiable;
- mejora acceso, consulta, preservación o distribución de conocimiento institucional;
- no contradice la visión;
- no compromete el MVP;
- tiene justificación técnica y de negocio;
- no introduce dependencia innecesaria de canales externos;
- no convierte el producto en un sistema clínico, hospitalario o administrativo ajeno a la comunicación pública.

Si una funcionalidad es valiosa pero amenaza el MVP, deberá registrarse para roadmap posterior.

---

# 17. Convenciones Documentales

Las convenciones documentales del proyecto son:

- nombres de archivos en kebab-case;
- documentos en Markdown;
- estructura por carpetas temáticas;
- uso de versión, estado y fecha en documentos principales;
- uso de tablas cuando ayuden a comparar o resumir;
- uso de diagramas simples cuando aporten claridad;
- evitar duplicar decisiones sin referencia;
- mantener lenguaje claro, profesional y consistente;
- preferir decisiones explícitas sobre supuestos implícitos.

La documentación deberá ser útil para personas y agentes de IA. Debe permitir continuidad del trabajo sin depender del recuerdo del chat.

---

# 18. Estados de Documentos

Los documentos podrán usar los siguientes estados:

| Estado | Significado |
|--------|-------------|
| Draft | Documento en elaboración o pendiente de validación. |
| In Review | Documento listo para revisión por la parte responsable. |
| Approved | Documento aprobado como referencia oficial. |
| Deprecated | Documento reemplazado o ya no vigente. |

Un documento `Draft` puede guiar el trabajo, pero no debe tratarse como línea base definitiva sin validación.

---

# 19. Architecture Decision Records

Las decisiones arquitectónicas relevantes deberán documentarse mediante ADRs cuando tengan impacto en mantenibilidad, escalabilidad, seguridad, dominio, infraestructura o evolución futura.

Los ADRs deberán ubicarse en la carpeta correspondiente de decisiones del proyecto.

Plantilla breve:

| Sección | Contenido esperado |
|---------|--------------------|
| Contexto | Situación, problema o restricción que motiva la decisión. |
| Decisión | Opción elegida. |
| Alternativas | Opciones consideradas y razones para descartarlas. |
| Consecuencias | Impactos positivos, negativos y riesgos. |
| Estado | Draft, In Review, Approved o Deprecated. |

Un ADR no debe usarse para documentar detalles triviales. Debe reservarse para decisiones que afecten el rumbo del producto o la arquitectura.

---

# 20. Criterios de Calidad del Proyecto

El proyecto deberá evaluarse con los siguientes criterios:

- coherencia documental;
- dominio claro;
- bajo acoplamiento;
- alta mantenibilidad;
- capacidad de evolución;
- claridad para la población;
- confiabilidad institucional;
- facilidad de operación;
- separación entre conocimiento, contenido y canales;
- seguridad y trazabilidad básica;
- utilidad para comunicación preventiva.

La calidad del proyecto no se medirá únicamente por cantidad de funcionalidades entregadas. Se medirá por su capacidad para publicar información confiable de forma sostenible.

---

# 21. Antipatrones a Evitar

El proyecto deberá evitar:

- diseñar base de datos primero;
- crear una tabla por cada tipo de contenido sin análisis de dominio;
- implementar IA antes de contar con conocimiento base validado;
- acoplarse rígidamente a redes sociales;
- generar código antes de comprender dominio y reglas de negocio;
- sobreingeniería;
- convertir el sistema en plataforma clínica;
- depender del chat como fuente de verdad;
- duplicar lógica entre tipos de contenido;
- introducir microservicios prematuros;
- automatizar publicación sin supervisión institucional;
- confundir canales de comunicación con fuente institucional.

Estos antipatrones deberán señalarse cuando aparezcan durante diseño, documentación o implementación.

---

# 22. Relación con Documentos Posteriores

Esta guía orienta la creación y revisión de los documentos posteriores.

- `product-principles.md`: deberá formalizar principios de producto sin contradecir los principios permanentes.
- `personas.md`: deberá describir usuarios y públicos objetivo alineados con población general y públicos secundarios.
- `ubiquitous-language.md`: deberá definir lenguaje común del dominio, especialmente conocimiento, contenido, publicación, fuente, canal y recurso.
- `domain.md`: deberá modelar el núcleo conceptual del sistema desde contenido institucional y conocimiento.
- `business-rules.md`: deberá establecer reglas institucionales de publicación, validación, trazabilidad y canales.
- `architecture.md`: deberá definir la arquitectura técnica formal respetando esta guía.
- `database.md`: deberá diseñar persistencia después de comprender dominio y reglas.
- `api.md`: deberá definir comunicación del sistema después de arquitectura y dominio.
- `implementation`: deberá iniciar después de validar los fundamentos necesarios.

Ningún documento posterior deberá contradecir esta guía sin registrar una decisión explícita.

---

# 23. Estado del Documento

**Estado:** Draft

Este documento representa la primera versión de la guía de arquitectura y documentación del proyecto.

Debe mantenerse actualizado cuando cambien reglas estructurales del proyecto, criterios de arquitectura, orden documental, convenciones o principios de toma de decisiones.

Cualquier cambio relevante deberá revisarse por su impacto en la visión, alcance, dominio, arquitectura y capacidad central de publicar información confiable.
