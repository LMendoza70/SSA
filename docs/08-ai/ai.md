# Estrategia de Inteligencia Artificial

| Campo | Valor |
|-------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Estrategia de Inteligencia Artificial |
| Código | DOC-018 |
| Versión | 1.0.0 |
| Estado | Draft para revisión |
| Fase | Phase 08 — AI |
| Documento anterior | `docs/07-backend/implementation-plan.md` |
| Documento siguiente | `docs/09-devops/devops.md` |
| Rol arquitectónico | Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect & AI Architect |
| Fecha | 2026-07-08 |

---

## 1. Información del Documento

Este documento pertenece a la **Phase 08 — AI** del proyecto **Plataforma de Gestión, Comunicación y Educación para la Salud** para la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su responsabilidad es definir la postura arquitectónica, estratégica y de gobernanza sobre el uso futuro de Inteligencia Artificial dentro del producto.

Este documento no diseña implementación. En particular, no define:

- proveedores de IA;
- modelos de lenguaje específicos;
- prompts productivos definitivos;
- embeddings;
- pgvector;
- búsqueda semántica;
- chatbot operativo;
- endpoints;
- controladores;
- servicios;
- repositorios;
- DTOs;
- cambios en `schema.prisma`;
- migraciones;
- infraestructura;
- costos de operación IA;
- automatización editorial productiva.

La IA queda documentada como **capacidad futura**, no como dependencia del MVP.

---

## 2. Propósito

El propósito de este documento es proteger la evolución futura de IA dentro del producto sin comprometer la capacidad central vigente:

> **Publicar información confiable.**

La Inteligencia Artificial podrá considerarse en fases posteriores únicamente como capacidad asistida para facilitar búsqueda, orientación, recuperación, organización o consulta sobre conocimiento institucional previamente validado, publicado, trazable y gobernado.

La IA no deberá convertirse en fuente oficial, responsable editorial, validador institucional, generador autónomo de publicaciones ni mecanismo de atención clínica individual.

Este documento establece:

- límites de IA;
- riesgos institucionales;
- usos futuros permitidos;
- usos prohibidos;
- condiciones mínimas de activación;
- criterios de gobernanza;
- relación con el Knowledge Lifecycle;
- relación con Fuente, Validación, Redacción, Content, Publicación y Trazabilidad;
- decisiones arquitectónicas que deberán preservarse antes de cualquier implementación futura.

---

## 3. Relación con la Baseline Oficial

Este documento deriva de la baseline aprobada:

| Fuente | Relación con este documento |
|--------|------------------------------|
| Foundation | Establece documentación, visión de largo plazo y arquitectura antes que implementación. |
| Product | Define que la capacidad central es publicar información confiable. |
| Product Principles | Define automatización responsable y secundaria, MVP protegido y responsabilidad institucional. |
| Personas | Define actores del ecosistema de conocimiento sin convertir al ciudadano en paciente ni al asistente en autoridad institucional. |
| Ubiquitous Language | Define Conocimiento Institucional, Información Oficial, Content, Publicación, Fuente, Validación, Redacción, Canal, Consulta Pública y Trazabilidad. |
| Domain | Define el dominio como gestión del ciclo de vida del Conocimiento Institucional. |
| Business Rules | Define que toda información debe validarse antes de publicarse y que la redacción no debe introducir afirmaciones sin respaldo. |
| Use Cases | Mantiene búsqueda semántica, recomendación automatizada e IA fuera de los casos de uso del MVP. |
| Architecture | Define IA como capacidad futura que no sustituye criterio institucional. |
| Database | Excluye IA, embeddings, vectores, pgvector y chatbot del MVP. |
| API | Mantiene IA, embeddings, pgvector, chatbot y búsqueda semántica fuera de la API MVP. |
| Frontend | No introduce experiencia pública basada en IA dentro del MVP. |
| Backend | Mantiene backend MVP sin módulos productivos de IA. |

Este documento no reinterpreta la baseline. La protege.

---

## 4. Decisión Principal de Phase 08

### AI-DEC-001 — AI como documento estratégico antes que técnico

Phase 08 inicia con un documento estratégico de límites, riesgos, gobernanza y evolución futura de IA.

No se aprueba todavía un documento técnico de arquitectura IA con componentes, RAG, embeddings, pgvector, proveedores o diseño de prompts productivos.

**Justificación**

El producto todavía se encuentra en fase documental. El MVP debe concentrarse en publicar información confiable mediante contenido institucional validado, trazable y administrable. Introducir una arquitectura IA completa antes de operar una base confiable de conocimiento aumentaría riesgo, alcance y complejidad sin aportar valor indispensable a la primera entrega.

**Consecuencia**

Cualquier diseño técnico IA futuro deberá esperar una autorización explícita posterior del Lead Developer.

---

## 5. Postura Arquitectónica sobre IA

La IA se considera una **capacidad futura de asistencia**, no un núcleo del MVP.

Su función potencial será apoyar a la población y a operadores institucionales mediante mecanismos como:

- recuperación asistida de publicaciones;
- orientación hacia contenido oficial existente;
- apoyo a navegación pública;
- apoyo interno para localizar conocimiento institucional;
- apoyo editorial preliminar no publicable;
- síntesis interna sujeta a revisión humana;
- detección de contenido relacionado;
- sugerencias de clasificación sujetas a validación.

La IA no deberá decidir qué es verdadero, vigente, publicable, clínicamente adecuado o institucionalmente autorizado.

La autoridad institucional permanece en:

```text
Jurisdicción Sanitaria
↓
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
Trazabilidad
```

La IA solo podrá operar sobre ese ciclo cuando el conocimiento ya esté suficientemente gobernado.

---

## 6. Principios de IA

### AI-PRIN-001. IA subordinada al Conocimiento Institucional

La IA deberá operar sobre Conocimiento Institucional, Información Oficial, Content y Publicaciones existentes. No deberá crear verdad institucional propia.

### AI-PRIN-002. IA no sustituye Validación

Ningún modelo de IA podrá reemplazar la Validación institucional. La Validación sigue siendo una confirmación institucional, no una predicción algorítmica.

### AI-PRIN-003. IA no sustituye Redacción institucional

La IA podrá sugerir borradores internos en fases futuras, pero la Redacción institucional final deberá permanecer bajo responsabilidad humana autorizada.

### AI-PRIN-004. IA no publica automáticamente

La IA no podrá crear, aprobar ni publicar contenido sin intervención institucional explícita.

### AI-PRIN-005. IA no atiende casos clínicos individuales

La IA no deberá diagnosticar, prescribir, recomendar tratamientos personalizados, interpretar síntomas individuales ni sustituir consulta médica.

### AI-PRIN-006. IA debe reconocer límites de conocimiento

Cuando no exista información institucional suficiente, la IA futura deberá dirigir al usuario hacia consulta de contenido oficial disponible o indicar que no cuenta con respaldo institucional suficiente. No deberá inventar información.

### AI-PRIN-007. IA debe ser trazable

Las respuestas asistidas futuras deberán poder relacionarse con contenido, publicaciones, fuentes o fragmentos institucionales recuperados. Una respuesta sin respaldo trazable no deberá considerarse aceptable.

### AI-PRIN-008. IA debe ser reversible

La incorporación de IA no deberá obligar a rediseñar el dominio, la base de datos, la API pública ni el flujo editorial. El producto debe seguir funcionando sin IA.

### AI-PRIN-009. IA debe ser progresiva

La IA deberá introducirse por etapas, iniciando con capacidades de bajo riesgo antes de cualquier interacción pública sensible.

### AI-PRIN-010. IA debe proteger la confianza institucional

Cuando exista conflicto entre automatización y confiabilidad institucional, deberá prevalecer la confiabilidad.

---

## 7. Límites No Negociables

La IA no deberá utilizarse para:

- sustituir la responsabilidad institucional de la Jurisdicción Sanitaria;
- convertir respuestas generadas en fuente oficial;
- validar información sin revisión institucional;
- publicar contenido automáticamente;
- generar recomendaciones clínicas individuales;
- diagnosticar enfermedades;
- indicar tratamientos personalizados;
- manejar expedientes clínicos;
- recolectar datos clínicos personales;
- decidir vigencia de publicaciones sin criterio institucional;
- ocultar que una respuesta proviene de asistencia automatizada;
- operar sobre contenido no validado como si fuera conocimiento confiable;
- introducir embeddings, vectores o pgvector dentro del MVP;
- modificar `schema.prisma` por necesidades de IA en v1.0;
- convertir el producto en chatbot primero y plataforma institucional después.

---

## 8. Usos Futuros Permitidos

Los siguientes usos podrán evaluarse en fases posteriores, siempre que cumplan las condiciones de activación de este documento.

### 8.1 Búsqueda asistida sobre publicaciones oficiales

La IA podría ayudar a formular mejores consultas y recuperar publicaciones existentes.

Debe limitarse a orientar hacia contenido oficial disponible.

### 8.2 Asistente público de orientación institucional

Un asistente futuro podría responder preguntas generales usando únicamente publicaciones, fuentes y contenido institucional validado.

Debe citar o enlazar el contenido oficial usado como respaldo.

### 8.3 Asistente interno para operadores

Un asistente administrativo podría ayudar a localizar contenidos, fuentes, validaciones o publicaciones relacionadas.

No debe publicar ni validar automáticamente.

### 8.4 Sugerencias de clasificación

La IA podría sugerir categorías, etiquetas, campañas o enfermedades relacionadas.

La decisión final debe permanecer en el operador institucional autorizado.

### 8.5 Apoyo editorial preliminar

La IA podría sugerir versiones preliminares de lenguaje claro, resúmenes o preguntas frecuentes.

Toda salida deberá pasar por revisión institucional antes de convertirse en Content o Publicación.

### 8.6 Detección de contenido relacionado

La IA podría identificar publicaciones relacionadas, duplicidades conceptuales o materiales complementarios.

Debe operar como apoyo a organización editorial, no como autoridad de dominio.

### 8.7 Resúmenes internos

La IA podría generar resúmenes internos de contenido publicado o fuentes documentales.

No deben publicarse sin validación y redacción institucional.

### 8.8 Asistencia para accesibilidad

La IA podría apoyar generación preliminar de textos alternativos, simplificación de lenguaje o adaptación de lectura fácil.

Debe conservar precisión institucional y revisión humana.

---

## 9. Usos Prohibidos

Los siguientes usos quedan prohibidos para el producto, salvo decisión institucional y arquitectónica futura que modifique formalmente la frontera del dominio:

### 9.1 Diagnóstico o atención clínica individual

El producto no debe recibir síntomas individuales para emitir diagnóstico, tratamiento, urgencia, pronóstico o recomendación clínica personalizada.

### 9.2 Publicación automática

La IA no debe publicar contenido en el portal público ni en canales externos sin acción humana autorizada.

### 9.3 Validación automática

La IA no debe determinar por sí misma si una fuente es válida, si una recomendación es vigente o si un contenido puede publicarse.

### 9.4 Respuestas sin respaldo institucional

La IA no debe responder usando conocimiento general del modelo cuando no exista respaldo en contenido institucional gobernado.

### 9.5 Generación autónoma de campañas

La IA no debe crear campañas institucionales como si fueran decisiones oficiales.

### 9.6 Sustitución de fuentes

La IA no debe actuar como Fuente. Una respuesta del modelo no es fuente oficial, documental ni institucional.

### 9.7 Sustitución de trazabilidad

La IA no debe reemplazar registros de trazabilidad ni justificar acciones institucionales sin evidencia documental.

### 9.8 Personalización clínica

La IA no debe adaptar recomendaciones de salud a condiciones individuales, edad, síntomas, antecedentes o datos personales de salud.

### 9.9 Automatización de vigencia

La IA no debe retirar, archivar, restaurar o marcar publicaciones como vigentes sin validación institucional.

### 9.10 Entrenamiento no gobernado con datos institucionales

No se deberá entrenar o ajustar modelos con información institucional sin política explícita de datos, privacidad, autorización y seguridad.

---

## 10. Relación con el Knowledge Lifecycle

La IA futura deberá ubicarse alrededor del Knowledge Lifecycle sin alterar sus etapas.

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

### 10.1 Fuente

La IA no es Fuente. Puede ayudar a localizar fuentes registradas o contenido respaldado, pero no reemplaza el origen institucional, documental u organizacional del conocimiento.

### 10.2 Validación

La IA no valida. Puede señalar posibles inconsistencias, ausencia de fuente o necesidad de revisión, pero la confirmación institucional permanece fuera del modelo.

### 10.3 Redacción

La IA puede sugerir redacción preliminar futura. No puede producir redacción final publicable sin revisión institucional.

### 10.4 Content

La IA puede ayudar a organizar o relacionar Content futuro. No debe crear Content publicable automáticamente.

### 10.5 Publicación

La IA no publica. La Publicación sigue siendo un hecho institucional de exposición pública bajo responsabilidad de la Jurisdicción Sanitaria.

### 10.6 Distribución

La IA puede sugerir adaptaciones de mensaje por canal en fases futuras. La distribución debe seguir partiendo de una Publicación existente.

### 10.7 Consulta Pública

La IA puede ayudar a orientar la consulta pública futura, pero debe mantenerse dentro de comunicación y educación en salud pública. No debe transformarse en consulta médica.

### 10.8 Actualización

La IA puede sugerir contenido potencialmente desactualizado. No puede actualizar ni retirar publicaciones sin revisión institucional.

### 10.9 Archivado

La IA puede ayudar a localizar contenido histórico o sugerir contexto, pero no decide archivado.

### 10.10 Memoria Institucional

La IA puede facilitar recuperación de memoria institucional, siempre que preserve contexto, fuente, vigencia y trazabilidad.

---

## 11. Relación con Conceptos del Dominio

| Concepto | Relación permitida con IA | Restricción |
|----------|----------------------------|-------------|
| Conocimiento Institucional | Base gobernada sobre la que podría operar IA futura. | IA no lo reemplaza ni lo inventa. |
| Información Oficial | Puede ser recuperada o resumida. | No puede generarse sin respaldo. |
| Content | Puede ser recomendado, relacionado o resumido. | No puede publicarse automáticamente. |
| Publicación | Puede ser citada o enlazada en respuestas futuras. | No puede reducirse a salida generada por IA. |
| Fuente | Puede ser referenciada como respaldo. | IA no es Fuente. |
| Validación | Puede recibir alertas o sugerencias de revisión. | IA no valida. |
| Redacción | Puede recibir apoyo preliminar. | IA no produce versión final sin revisión. |
| Campaña | Puede agrupar contenido relacionado. | IA no decide campañas oficiales. |
| Enfermedad | Puede orientar hacia contenido temático. | IA no diagnostica. |
| Canal de Comunicación | Puede sugerir adaptación futura. | IA no convierte canales en fuente de verdad. |
| Trazabilidad | Puede registrar respaldo de respuesta futura. | IA no sustituye trazabilidad institucional. |
| Consulta Pública | Puede orientar al usuario hacia contenido oficial. | No equivale a consulta médica. |

---

## 12. Condiciones Mínimas de Activación

Antes de diseñar o implementar cualquier capacidad IA pública, deberán cumplirse como mínimo las siguientes condiciones.

### 12.1 Base suficiente de contenido publicado

Debe existir volumen suficiente de Publicaciones oficiales, vigentes o históricamente contextualizadas.

### 12.2 Fuentes y validaciones mínimas operativas

El sistema debe contar con soporte real para Fuente, Validación y Trazabilidad mínima.

### 12.3 Clasificación editorial consistente

Las publicaciones deben estar organizadas mediante tipos, categorías, etiquetas, campañas, enfermedades o relaciones relevantes.

### 12.4 Criterios de vigencia aplicados

Debe distinguirse entre información vigente, retirada, archivada o históricamente contextualizada.

### 12.5 Política de respuestas públicas

Debe existir una política explícita sobre qué puede responder el asistente, qué debe rechazar y cuándo debe remitir a contenido oficial.

### 12.6 Política de no atención clínica

Debe existir una política clara para impedir diagnóstico, tratamiento, recomendación personalizada o manejo de datos clínicos personales.

### 12.7 Evaluación institucional

Debe existir validación institucional de comportamiento antes de exponer IA a la población.

### 12.8 Observabilidad y revisión

Debe existir capacidad de revisar interacciones, detectar fallas, retirar respuestas problemáticas y ajustar comportamiento.

### 12.9 Seguridad y privacidad

Debe existir política de manejo de datos, retención, privacidad, proveedores y protección de información institucional.

### 12.10 Plan de reversibilidad

La plataforma debe poder desactivar IA sin afectar el portal público, el CMS, publicaciones, búsqueda básica o administración.

---

## 13. Riesgos Principales

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| IA como fuente de verdad | Pérdida de responsabilidad institucional. | Restringir respuestas a contenido oficial trazable. |
| Automatización editorial prematura | Publicaciones incorrectas o no validadas. | Prohibir publicación automática y requerir revisión humana. |
| Respuestas clínicas | Riesgo social, legal e institucional. | Mantener frontera no clínica y rechazos explícitos. |
| Alucinaciones | Desinformación pública. | Usar recuperación sobre contenido validado y respuesta con respaldo. |
| Confusión entre búsqueda y validación | El usuario podría asumir que un resultado es recomendación oficial personalizada. | Separar orientación pública de atención individual. |
| Embeddings no gobernados | Exposición de contenido no validado o desactualizado. | No indexar contenido sin reglas de vigencia, fuente y publicación. |
| Dependencia de proveedor | Riesgo operativo, económico y de continuidad. | Mantener arquitectura futura desacoplada de proveedor. |
| Scope creep | Retraso del MVP. | Mantener IA fuera de v1.0. |
| Falta de trazabilidad | Imposibilidad de auditar respuestas. | Registrar fuentes recuperadas y publicaciones utilizadas en fases futuras. |
| Pérdida de claridad pública | Respuestas extensas, ambiguas o técnicas. | Exigir lenguaje claro y enlaces a contenido oficial. |

---

## 14. Estrategia de Evolución por Etapas

La evolución IA deberá ser incremental.

### Etapa 0 — MVP sin IA

Estado aprobado para v1.0.

Incluye:

- publicación confiable;
- portal público;
- búsqueda básica;
- contenido institucional;
- fuentes;
- validaciones;
- trazabilidad mínima;
- campañas;
- enfermedades;
- línea del tiempo;
- canales asistidos.

No incluye IA.

### Etapa 1 — Preparación documental y gobernanza

Incluye:

- políticas de IA;
- criterios de respuesta;
- criterios de rechazo;
- matriz de riesgos;
- evaluación de datos disponibles;
- definición de contenido elegible para asistencia.

No incluye implementación productiva.

### Etapa 2 — Asistencia interna de bajo riesgo

Podrá incluir:

- búsqueda asistida interna;
- sugerencias de clasificación;
- detección de contenidos relacionados;
- borradores internos no publicables.

Requiere supervisión del operador.

### Etapa 3 — Asistente público restringido

Podrá incluir:

- respuestas generales basadas en Publicaciones oficiales;
- enlaces a contenido fuente;
- rechazo de preguntas clínicas individuales;
- mensajes de alcance institucional.

Requiere evaluación institucional previa.

### Etapa 4 — Búsqueda semántica gobernada

Podrá incluir:

- recuperación semántica sobre contenido publicado;
- control por vigencia;
- exclusión de contenido archivado no apto para respuesta pública;
- trazabilidad de fragmentos recuperados.

No se define tecnología en este documento.

### Etapa 5 — Automatización editorial asistida

Podrá incluir:

- sugerencias de resumen;
- adaptación por canal;
- versiones de lenguaje claro;
- generación preliminar de FAQ.

Nunca deberá publicar sin validación humana.

---

## 15. Criterios para una Futura Arquitectura IA Técnica

Un documento técnico posterior de IA solo deberá elaborarse cuando el Lead Developer lo autorice explícitamente.

Ese documento futuro podrá abordar:

- arquitectura RAG;
- estrategia de recuperación;
- estrategia de chunking;
- control de vigencia;
- trazabilidad de fuentes recuperadas;
- evaluación de respuestas;
- seguridad de prompts;
- selección de proveedores;
- costos;
- observabilidad;
- privacidad;
- fallback sin IA;
- criterios de desactivación.

Ese documento futuro no deberá modificar las decisiones de dominio.

---

## 16. Antiobjetivos

La estrategia IA no busca:

- convertir el producto en chatbot como funcionalidad principal;
- reemplazar el CMS institucional;
- acelerar publicación a costa de validación;
- generar contenido público autónomo;
- resolver atención clínica individual;
- crear expediente clínico;
- crear sistema hospitalario;
- entrenar modelos propios en el MVP;
- introducir pgvector como dependencia temprana;
- rediseñar la base de datos alrededor de embeddings;
- obligar a usar un proveedor específico;
- hacer que IA sea requisito para que el portal funcione.

---

## 17. Decisiones Arquitectónicas de IA

### AI-DEC-001 — IA como capacidad futura

La IA queda documentada como capacidad futura, no como parte del MVP.

### AI-DEC-002 — Sin IA en v1.0

La versión 1.0 no incluirá chatbot, embeddings, pgvector, búsqueda semántica, generación automática de respuestas públicas ni automatización editorial productiva.

### AI-DEC-003 — IA no es fuente oficial

Ninguna salida generada por IA deberá considerarse Fuente, Información Oficial, Validación o Publicación.

### AI-DEC-004 — IA no sustituye Validación

La Validación seguirá siendo responsabilidad institucional. La IA podrá sugerir revisión, pero no aprobar información.

### AI-DEC-005 — IA no sustituye Redacción

La IA podrá apoyar redacción preliminar futura, pero no generar versión final publicable sin revisión humana.

### AI-DEC-006 — IA no publica

Ningún flujo IA deberá publicar en portal público o canales externos sin operación humana autorizada.

### AI-DEC-007 — IA debe responder con respaldo trazable

Una futura respuesta pública asistida deberá derivarse de contenido institucional recuperable, verificable y enlazable.

### AI-DEC-008 — IA debe respetar frontera no clínica

Cualquier capacidad IA deberá rechazar diagnóstico, tratamiento, interpretación de síntomas o recomendaciones personalizadas.

### AI-DEC-009 — IA no modifica `schema.prisma` en MVP

No se agregarán modelos, extensiones ni campos de IA, embeddings, vectores o pgvector al MVP.

### AI-DEC-010 — IA debe ser desacoplable

La plataforma deberá seguir funcionando si la capacidad IA se desactiva, falla, cambia de proveedor o se pospone indefinidamente.

---

## 18. Checklist de Validación del Documento

Antes de aprobar esta fase, validar:

- [ ] El documento no introduce IA en el MVP.
- [ ] El documento no introduce embeddings ni pgvector.
- [ ] El documento no modifica `schema.prisma`.
- [ ] El documento no define proveedor obligatorio.
- [ ] El documento no diseña prompts productivos definitivos.
- [ ] El documento no define endpoints.
- [ ] El documento no genera implementación.
- [ ] El documento preserva la separación Fuente / Validación / Redacción / Content / Publicación.
- [ ] El documento prohíbe respuestas clínicas individuales.
- [ ] El documento prohíbe publicación automática.
- [ ] El documento mantiene IA como asistencia futura.
- [ ] El documento exige respaldo institucional y trazabilidad para respuestas futuras.
- [ ] El documento protege la capacidad central: publicar información confiable.

---

## 19. Conclusión

La Inteligencia Artificial puede aportar valor futuro al producto si se incorpora de forma gobernada, progresiva y subordinada al Conocimiento Institucional.

Sin embargo, su incorporación prematura pondría en riesgo el MVP, la responsabilidad institucional, la claridad pública y la confiabilidad de la información.

Por tanto, Phase 08 establece una posición arquitectónica conservadora:

```text
Primero conocimiento institucional validado.
Después publicación confiable.
Después consulta pública clara.
Después IA asistida, gobernada y trazable.
```

La IA deberá fortalecer el producto, no redefinirlo.

