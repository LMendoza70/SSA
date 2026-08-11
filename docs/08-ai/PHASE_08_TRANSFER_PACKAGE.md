# PHASE 08 TRANSFER PACKAGE — AI

## 1. Estado de cierre

**Proyecto:** Plataforma de Gestión, Comunicación y Educación para la Salud  
**Cliente:** Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo  
**Fase cerrada:** Phase 08 — AI  
**Estado recomendado:** Baseline completa  
**Fecha de cierre:** 2026-07-08  
**Siguiente fase documental:** Phase 09 — DevOps  
**Rol de continuidad:** Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect, AI Architect & DevOps Architect

Este paquete de transferencia conserva el estado arquitectónico alcanzado al cerrar **Phase 08 — AI**. Debe utilizarse para iniciar la siguiente fase sin reabrir decisiones aprobadas ni introducir implementación prematura.

---

## 2. Estado general del proyecto al cierre de Phase 08

```text
Foundation      ✅ Baseline
Product         ✅ Baseline
Domain          ✅ Baseline
Architecture    ✅ Baseline
Database        ✅ Baseline
API             ✅ Baseline
Frontend        ✅ Baseline
Backend         ✅ Baseline
AI              ✅ Baseline
DevOps          ⏳ Pendiente de documentación
Implementation  ⏳ Pendiente / posterior a documentación técnica restante
```

El proyecto continúa en fase documental. Todavía no se debe considerar iniciada la implementación productiva del backend, frontend, base de datos, DevOps o capacidades de IA hasta autorización explícita del Lead Developer.

---

## 3. Documento aprobado durante Phase 08 — AI

```text
docs/08-ai/ai.md   ✅ Baseline
```

Documento generado con enfoque estratégico, no técnico ni de implementación.

Estructura documental recomendada para Phase 08:

```text
docs/08-ai/
├── ai.md                  ✅ Baseline
└── transfer-package.md    ✅ Cierre de fase
```

---

## 4. Decisión principal de Phase 08

### AI-DEC-001 — AI como documento estratégico antes que técnico

Phase 08 se cerró como una fase de **estrategia, gobernanza, límites, riesgos y evolución futura de IA**.

No se aprobó un documento técnico de arquitectura IA con componentes, RAG, embeddings, pgvector, proveedores, prompts productivos o diseño operativo de chatbot.

La IA queda documentada como:

```text
Capacidad futura
No dependencia del MVP
No fuente oficial
No sustituto de validación institucional
No automatización editorial productiva
No mecanismo clínico
```

---

## 5. Alcance aprobado para IA

La IA podrá evaluarse en fases posteriores únicamente como capacidad asistida para:

- recuperación asistida de publicaciones oficiales;
- orientación hacia contenido institucional existente;
- apoyo a navegación pública;
- apoyo interno para localizar conocimiento institucional;
- apoyo editorial preliminar no publicable;
- síntesis interna sujeta a revisión humana;
- detección de contenido relacionado;
- sugerencias de clasificación sujetas a validación;
- asistencia futura para accesibilidad y lenguaje claro.

Toda capacidad IA futura deberá operar sobre conocimiento institucional validado, publicado, trazable y gobernado.

---

## 6. Decisiones consolidadas de IA

### 6.1 IA fuera del MVP

La versión 1.0 no incluirá:

```text
IA
chatbot
embeddings
pgvector
búsqueda semántica
respuestas generadas al público
automatización editorial productiva
RAG operativo
modelos de IA productivos
```

### 6.2 IA no es fuente oficial

Ninguna salida generada por IA deberá considerarse:

```text
Fuente
Información Oficial
Validación
Redacción final
Content aprobado
Publicación
Trazabilidad institucional
```

### 6.3 IA no sustituye Validación

La Validación institucional permanece como responsabilidad humana e institucional.

La IA podrá, en el futuro, sugerir revisión o detectar inconsistencias, pero no aprobar información.

### 6.4 IA no sustituye Redacción institucional

La IA podrá sugerir borradores internos en fases futuras.

Toda redacción final publicable deberá permanecer bajo revisión institucional autorizada.

### 6.5 IA no publica automáticamente

Ningún flujo IA deberá publicar en:

```text
Portal Público
Canales de Comunicación
Redes sociales
Materiales institucionales oficiales
```

sin intervención humana autorizada.

### 6.6 IA debe responder con respaldo trazable

Una futura respuesta pública asistida deberá derivarse de contenido institucional recuperable, verificable y enlazable.

Una respuesta sin respaldo trazable no deberá considerarse aceptable.

### 6.7 IA debe respetar la frontera no clínica

La IA no deberá:

- diagnosticar;
- prescribir;
- recomendar tratamientos personalizados;
- interpretar síntomas individuales;
- realizar triaje;
- sustituir consulta médica;
- recolectar datos clínicos personales;
- manejar expedientes clínicos.

### 6.8 IA no modifica `schema.prisma` en MVP

No se agregarán modelos, extensiones ni campos relacionados con IA, embeddings, vectores o pgvector al MVP.

### 6.9 IA debe ser desacoplable

La plataforma deberá seguir funcionando si la capacidad IA se desactiva, falla, cambia de proveedor o se pospone indefinidamente.

---

## 7. Límites no negociables preservados

Phase 08 protege explícitamente al producto contra:

- automatización editorial prematura;
- respuestas generadas sin respaldo institucional;
- embeddings o pgvector no gobernados;
- confusión entre asistente inteligente y fuente oficial;
- generación automática de contenido publicado;
- sustitución de Validación institucional por modelos de IA;
- respuestas clínicas, diagnóstico o atención individual;
- dependencia temprana de proveedores IA;
- incremento de alcance del MVP;
- rediseño de base de datos por capacidades futuras.

---

## 8. Relación con el Knowledge Lifecycle

La IA futura deberá ubicarse alrededor del ciclo aprobado sin alterar sus etapas:

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

Interpretación aprobada:

- IA no es Fuente.
- IA no valida.
- IA no redacta versión final publicable.
- IA no crea Content aprobado automáticamente.
- IA no convierte contenido en Publicación.
- IA no distribuye sin operación humana autorizada.
- IA no sustituye Consulta Pública por atención clínica.
- IA no decide actualización, retiro o archivado.
- IA puede apoyar recuperación futura de Memoria Institucional si existe trazabilidad.

---

## 9. Condiciones mínimas antes de una futura IA productiva

Antes de diseñar o implementar cualquier capacidad IA pública, deberán existir al menos:

1. Base suficiente de publicaciones oficiales.
2. Fuentes y validaciones operativas.
3. Trazabilidad mínima establecida.
4. Clasificación editorial consistente.
5. Criterios de vigencia aplicados.
6. Política de respuestas públicas.
7. Política explícita de no atención clínica.
8. Evaluación institucional previa.
9. Observabilidad y revisión de interacciones.
10. Política de seguridad, privacidad y retención de datos.
11. Plan de reversibilidad.
12. Autorización explícita del Lead Developer.

---

## 10. Documentos que NO deben generarse todavía

Queda recomendado no generar en esta etapa:

```text
rag-architecture.md
ai-prompts.md
embedding-strategy.md
vector-search.md
chatbot.md
ai-provider-selection.md
ai-evaluation.md
ai-security.md
ai-implementation-plan.md
```

Estos documentos podrían ser útiles en una fase futura, pero serían prematuros antes de operar el MVP y contar con conocimiento institucional suficiente.

---

## 11. Implicaciones para Phase 09 — DevOps

La siguiente fase es:

```text
Phase 09 — DevOps
```

DevOps deberá documentarse sin asumir IA como dependencia operativa.

Por tanto, Phase 09 no deberá incluir como requisitos MVP:

- infraestructura para LLM;
- servicios de embeddings;
- pgvector;
- workers de indexación semántica;
- pipelines RAG;
- secretos de proveedores IA;
- monitoreo específico de modelos IA;
- costos de inferencia IA;
- despliegue de chatbot.

DevOps deberá concentrarse en la operación inicial del producto institucional:

- despliegue del frontend;
- despliegue del backend;
- PostgreSQL;
- variables de entorno;
- almacenamiento de archivos;
- seguridad básica;
- backups;
- logs;
- monitoreo mínimo;
- estrategia de ambientes;
- CI/CD básico;
- operación mantenible del MVP.

La arquitectura DevOps podrá dejar preparada evolución futura, pero no deberá sobredimensionar la infraestructura para IA.

---

## 12. Estado de artefactos técnicos

Durante Phase 08 no se generaron ni modificaron artefactos técnicos.

No se modificó:

```text
schema.prisma
backend
frontend
API
base de datos
infraestructura
migraciones
endpoints
servicios
repositorios
prompts productivos
```

---

## 13. Checklist de cierre de Phase 08

- [x] IA documentada como capacidad futura.
- [x] IA excluida del MVP.
- [x] Sin embeddings.
- [x] Sin pgvector.
- [x] Sin chatbot operativo.
- [x] Sin RAG técnico.
- [x] Sin proveedor obligatorio.
- [x] Sin prompts productivos definitivos.
- [x] Sin cambios a `schema.prisma`.
- [x] Sin implementación.
- [x] Sin endpoints.
- [x] Sin automatización editorial.
- [x] Sin respuestas clínicas individuales.
- [x] Sin sustitución de Fuente, Validación, Redacción, Content, Publicación o Trazabilidad.
- [x] Siguiente fase identificada: Phase 09 — DevOps.

---

## 14. Recomendación de cierre

Se recomienda cerrar Phase 08 con el siguiente estado:

```text
Phase 08 — AI ✅ Baseline
```

Y continuar con:

```text
Phase 09 — DevOps
Documento recomendado: docs/09-devops/devops.md
```

---

## 15. Prompt recomendado para iniciar Phase 09 — DevOps

```text
# CONTEXT TRANSFER PROMPT — Inicio de nuevo chat para Phase 09 — DevOps

Actúa como Chief Software Architect, Lead Software Architect, Solution Architect, Domain Architect y DevOps Architect del proyecto SSA.

Estamos continuando desde el cierre de Phase 08 — AI.

Debes continuar el proyecto sin reabrir decisiones aprobadas.

Proyecto:
Plataforma de Gestión, Comunicación y Educación para la Salud
Cliente: Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo

Capacidad central:
Publicar información confiable.

Activo principal:
Conocimiento Institucional.

Fases cerradas:
Foundation      ✅ Baseline
Product         ✅ Baseline
Domain          ✅ Baseline
Architecture    ✅ Baseline
Database        ✅ Baseline
API             ✅ Baseline
Frontend        ✅ Baseline
Backend         ✅ Baseline
AI              ✅ Baseline

Fases pendientes:
DevOps          ⏳ Pendiente
Implementation  ⏳ Pendiente

Decisiones críticas que no debes reabrir:
- Content y Publication separados.
- Publication no es booleano.
- contents es base editorial común.
- Campaign y Disease son entidades propias.
- Source y Validation son entidades separadas.
- TraceabilityRecord preserva trazabilidad institucional mínima.
- TimelineEvent tiene multimedia propia.
- Backend inicia como Modular Monolith.
- Prisma es infraestructura, no dominio.
- IA queda fuera del MVP.
- No embeddings, no pgvector, no chatbot, no búsqueda semántica en MVP.

Fase actual:
Phase 09 — DevOps

Documento recomendado:
docs/09-devops/devops.md

Objetivo de Phase 09:
Definir la estrategia DevOps del MVP sin sobredimensionar infraestructura, sin introducir IA como dependencia, sin generar implementación y sin ejecutar despliegues.

La documentación DevOps debe cubrir, como mínimo:
- ambientes;
- configuración;
- variables de entorno;
- estrategia de despliegue;
- PostgreSQL;
- almacenamiento de archivos;
- seguridad operativa básica;
- backups;
- logs;
- monitoreo mínimo;
- CI/CD básico;
- estrategia de rollback;
- criterios de operación del MVP.

No generar código.
No generar pipelines reales.
No crear archivos de infraestructura.
No ejecutar comandos.
No seleccionar proveedor obligatorio salvo autorización expresa.
No introducir infraestructura IA.
```

---

## 16. Conclusión

Phase 08 cerró la postura estratégica de IA del proyecto.

La decisión central queda establecida:

```text
Primero conocimiento institucional validado.
Después publicación confiable.
Después consulta pública clara.
Después IA asistida, gobernada y trazable.
```

La IA deberá fortalecer el producto en el futuro, no redefinirlo ni condicionar el MVP.
