# Principios del Producto

| Campo | Valor |
|--------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Principios del Producto |
| Código | DOC-004 |
| Versión | 1.0.0 |
| Estado | Baseline |
| Autor | Equipo del Proyecto |
| Rol arquitectónico | Software Architect, Product Architect & Solution Architect |
| Fecha | 2026-07-02 |

---

# 1. Propósito del Documento

Este documento establece el marco oficial de principios del producto para la **Plataforma de Gestión, Comunicación y Educación para la Salud** de la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su propósito es consolidar los principios ya definidos en la documentación oficial del proyecto y convertirlos en reglas de gobernanza aplicables a la evolución del producto.

Este documento deberá utilizarse para aceptar, rechazar, priorizar o posponer funcionalidades, decisiones editoriales, decisiones operativas y decisiones de evolución del producto.

No redefine la visión del producto. No redefine el alcance. No introduce reglas de dominio, entidades, base de datos, API, arquitectura técnica, frontend o backend. Es un documento de gobierno del producto.

La capacidad central que gobierna este documento es:

> **Publicar información confiable.**

---

# 2. Relación con Documentos Oficiales

Los principios aquí definidos derivan de los documentos oficiales del proyecto.

## 2.1 Relación con `PROJECT_TRANSFER_PACKAGE.md`

`PROJECT_TRANSFER_PACKAGE.md` establece el contexto original del proyecto, el objetivo principal, la misión, visión descubierta, principios iniciales, stack acordado y decisiones arquitectónicas base.

Este documento toma de ahí los principios iniciales: información confiable, lenguaje claro, contenido comprensible, recursos visuales, adaptabilidad, tecnología como medio, prevención y accesibilidad del conocimiento.

## 2.2 Relación con `CONTEXT_TRANSFER_PACKAGE.md`

`CONTEXT_TRANSFER_PACKAGE.md` establece el estado vigente del proyecto y confirma que la documentación sustituye al historial del chat como fuente principal de contexto.

Este documento toma de ahí el orden oficial del proyecto, la obligación de evitar código prematuro, la documentación como fuente de verdad, la evolución a largo plazo, bajo acoplamiento y alta mantenibilidad.

## 2.3 Relación con `project-charter.md`

`project-charter.md` establece el marco institucional del proyecto, los beneficios esperados, los stakeholders, los riesgos iniciales, las métricas de éxito y los principios de gobernanza.

Este documento toma de ahí la responsabilidad institucional, la necesidad de preservar conocimiento, la supervisión institucional, la reducción de dispersión y la exclusión de capacidades clínicas.

## 2.4 Relación con `architecture-guide.md`

`architecture-guide.md` establece las reglas de trabajo, criterios de arquitectura, orden documental, reglas para decisiones, antipatrones y principios técnicos fundacionales.

Este documento toma de ahí la obligación de evitar decisiones prematuras, separar conocimiento, contenido y canales, evitar acoplamiento a redes sociales, documentar decisiones relevantes y proteger la mantenibilidad.

## 2.5 Relación con `vision.md`

`vision.md` define la visión oficial del producto, su misión, propósito central, valores permanentes, principios rectores, diferenciadores, fronteras y antiobjetivos.

Este documento toma de ahí la identidad del producto: transformar conocimiento institucional en conocimiento accesible, claro, confiable y útil para la población.

## 2.6 Relación con `scope.md`

`scope.md` delimita la versión 1.0, separa lo incluido, parcialmente incluido y excluido, y define criterios de aceptación del MVP.

Este documento no amplía el alcance 1.0. Sus principios deberán ayudar a proteger el MVP y a posponer funcionalidades que no correspondan a la primera entrega.

---

# 3. Qué son los Product Principles

Los Product Principles son reglas normativas que gobiernan cómo deberá evolucionar el producto.

No son deseos generales ni buenas prácticas genéricas. Son criterios derivados del contexto institucional de la Jurisdicción Sanitaria y del propósito de la plataforma.

Cada principio deberá orientar decisiones concretas sobre:

- qué funcionalidades aceptar;
- qué funcionalidades posponer;
- qué funcionalidades rechazar;
- cómo priorizar mejoras;
- cómo preservar coherencia con la visión;
- cómo proteger la confiabilidad institucional;
- cómo evitar desviaciones del propósito del producto.

Un principio del producto deberá ser accionable, verificable y trazable a la documentación oficial.

---

# 4. Papel de los Product Principles dentro del Proyecto

Los Product Principles deberán funcionar como un marco de gobernanza permanente.

Durante el proyecto, deberán usarse para:

- evaluar cambios de alcance;
- revisar nuevas funcionalidades;
- orientar diseño funcional;
- revisar documentación posterior;
- proteger el MVP;
- evitar decisiones impulsadas únicamente por tecnología;
- mantener coherencia entre producto, dominio y arquitectura;
- facilitar continuidad para desarrolladores y agentes de IA.

Estos principios deberán consultarse antes de avanzar hacia `personas.md`, `ubiquitous-language.md`, `domain.md`, `business-rules.md`, `architecture.md` y documentos posteriores.

---

# 5. Cómo Utilizar este Documento para Tomar Decisiones

Toda propuesta de cambio o nueva funcionalidad deberá evaluarse con las siguientes preguntas:

- ¿Fortalece la capacidad central de publicar información confiable?
- ¿Mejora el acceso de la población al conocimiento institucional?
- ¿Preserva claridad, confiabilidad y responsabilidad institucional?
- ¿Reduce dispersión de información o ayuda a reutilizar conocimiento?
- ¿Respeta el alcance vigente?
- ¿Evita convertir el producto en una plataforma clínica, hospitalaria o administrativa?
- ¿Mantiene separación entre conocimiento, contenido y canales?
- ¿Puede posponerse sin afectar el valor central del MVP?
- ¿Está alineada con la evolución a largo plazo del producto?

Si una propuesta no puede responder afirmativamente a estas preguntas, deberá rechazarse, reformularse o posponerse.

---

# 6. Marco de Decisión del Producto

El marco de decisión del producto deberá seguir esta prioridad:

1. Seguridad institucional y confiabilidad de la información.
2. Correctitud del contenido y responsabilidad institucional.
3. Claridad y comprensión para la población.
4. Preservación y reutilización del conocimiento institucional.
5. Coherencia con visión y alcance.
6. Mantenibilidad y evolución futura.
7. Rendimiento y eficiencia operativa.
8. Facilidad de implementación.

Cuando exista conflicto entre dos decisiones, deberá elegirse la que mejor proteja la confianza institucional y la capacidad de publicar información confiable.

La facilidad de implementación no deberá superar la confiabilidad, claridad, mantenibilidad o coherencia del producto.

---

# 7. Clasificación de Principios

Los principios se clasifican en tres niveles.

## 7.1 Core Principles

Son principios que definen la identidad del producto. No deberán modificarse sin una decisión arquitectónica formal.

## 7.2 Strategic Principles

Son principios que guían la evolución del producto y la incorporación de nuevas capacidades.

## 7.3 Operational Principles

Son principios que orientan decisiones funcionales, editoriales y operativas del producto.

---

# 8. Core Principles

## CP-01. Información Confiable como Capacidad Central

**Declaración normativa**

El producto deberá existir para publicar información oficial, confiable, clara y comprensible sobre salud pública. Toda funcionalidad deberá contribuir directa o indirectamente a esa capacidad central.

**Justificación**

La documentación oficial establece que todo el sistema gira alrededor de publicar información confiable. El CMS, portal público, buscador, línea del tiempo, canales de comunicación y futuras capacidades de IA existen para apoyar ese objetivo, no para reemplazarlo.

**Implicaciones**

- La confiabilidad deberá tener prioridad sobre velocidad de publicación.
- La información pública deberá tener fuente o responsabilidad institucional.
- Las funcionalidades que no fortalezcan la publicación confiable deberán justificarse o posponerse.

**Decisiones que habilita**

- Priorizar gestión central de contenido institucional.
- Requerir trazabilidad básica de fuente, autoría o responsabilidad.
- Posponer automatizaciones que comprometan supervisión institucional.

**Decisiones que restringe**

- Publicación anónima.
- Generación automática de información pública sin validación.
- Funcionalidades llamativas que no aporten a la confiabilidad.

**Referencias**

- `PROJECT_TRANSFER_PACKAGE.md`: Objetivo principal.
- `CONTEXT_TRANSFER_PACKAGE.md`: Objetivo del producto.
- `project-charter.md`: Objetivo estratégico.
- `vision.md`: Capacidad principal del sistema.
- `scope.md`: Criterios de aceptación del MVP.

---

## CP-02. Conocimiento Institucional como Activo Principal

**Declaración normativa**

El producto deberá tratar el conocimiento institucional como su activo principal. La plataforma deberá preservar, organizar, publicar, distribuir y reutilizar ese conocimiento para hacerlo accesible a la población.

**Justificación**

La documentación establece que el sistema no es únicamente un portal ni una colección de publicaciones. Su valor está en transformar conocimiento institucional en conocimiento accesible, claro, confiable y útil.

**Implicaciones**

- El contenido deberá entenderse como expresión publicable del conocimiento institucional.
- Las fuentes, contexto, experiencia institucional y memoria histórica deberán considerarse parte del valor del producto.
- La reutilización del conocimiento deberá orientar la evolución funcional.

**Decisiones que habilita**

- Diseñar capacidades de clasificación, búsqueda y reutilización.
- Preservar línea del tiempo y contenido histórico.
- Preparar futuras capacidades de chatbot y búsqueda semántica.

**Decisiones que restringe**

- Tratar publicaciones como piezas aisladas sin contexto institucional.
- Duplicar contenido sin necesidad.
- Diseñar funcionalidades que no preserven o aprovechen conocimiento institucional.

**Referencias**

- `CONTEXT_TRANSFER_PACKAGE.md`: Información institucional como activo principal.
- `project-charter.md`: Justificación del proyecto.
- `vision.md`: Filosofía del producto y propuesta de valor.
- `scope.md`: Mapa conceptual y dependencias funcionales.

---

## CP-03. Claridad y Comprensión para la Población

**Declaración normativa**

El contenido publicado deberá utilizar lenguaje claro y presentarse de forma comprensible para la población general. La claridad deberá tener prioridad sobre complejidad técnica, formalidad excesiva o acumulación de publicaciones.

**Justificación**

El público principal es la población en general. La plataforma existe para facilitar acceso a información oficial y útil, no solo para almacenar contenido institucional.

**Implicaciones**

- Las decisiones de producto deberán favorecer navegación clara, búsqueda básica y contenido comprensible.
- Los recursos visuales deberán apoyar comprensión.
- El contenido deberá ser útil para prevención, orientación y consulta pública.

**Decisiones que habilita**

- Priorizar portal público simple y responsive.
- Incluir infografías y recursos visuales.
- Organizar contenido por tipos, categorías y etiquetas.

**Decisiones que restringe**

- Interfaces o flujos innecesariamente complejos.
- Contenido publicado sin adaptación para comprensión ciudadana.
- Priorizar estructuras internas sobre facilidad de consulta pública.

**Referencias**

- `PROJECT_TRANSFER_PACKAGE.md`: Principios del producto.
- `vision.md`: Principios rectores e impacto esperado en la población.
- `scope.md`: Portal público y alcance no funcional.
- `architecture-guide.md`: Principios permanentes del producto.

---

## CP-04. Prevención y Educación en Salud como Prioridad

**Declaración normativa**

El producto deberá priorizar la prevención y la educación en salud pública sobre capacidades reactivas, clínicas o administrativas.

**Justificación**

La misión del producto está orientada a comunicación y educación para la salud. La prevención se define como eje principal y valor permanente.

**Implicaciones**

- Las campañas preventivas, enfermedades, avisos, infografías y materiales educativos deberán tener prioridad de producto.
- El producto deberá ayudar a la población a comprender cómo prevenir enfermedades y reconocer campañas vigentes.
- Las capacidades clínicas quedan fuera del propósito.

**Decisiones que habilita**

- Priorizar campañas, infografías, avisos y enfermedades como tipos de contenido.
- Fortalecer contenido destacado para campañas vigentes.
- Mantener línea del tiempo como memoria institucional preventiva.

**Decisiones que restringe**

- Diagnóstico.
- Consulta médica.
- Expediente clínico.
- Sistemas hospitalarios, citas o inventarios.

**Referencias**

- `PROJECT_TRANSFER_PACKAGE.md`: Principios e impacto esperado.
- `project-charter.md`: Justificación y exclusiones.
- `vision.md`: Prevención, educación y antiobjetivos.
- `scope.md`: Funcionalidades fuera del alcance.

---

## CP-05. Frontera Institucional no Clínica

**Declaración normativa**

El producto no deberá convertirse en expediente clínico, sistema hospitalario, sistema de citas, plataforma de diagnóstico ni sustituto del personal de salud.

**Justificación**

La documentación establece explícitamente que la plataforma es de comunicación y educación en salud pública. Su función es publicar información confiable, no atender casos clínicos individuales.

**Implicaciones**

- No deberán procesarse datos clínicos personales.
- No deberán emitirse diagnósticos.
- No deberá reemplazarse la consulta médica.
- Las funcionalidades deberán mantenerse dentro de comunicación, educación, publicación y preservación de conocimiento.

**Decisiones que habilita**

- Rechazar solicitudes de funcionalidades clínicas.
- Mantener mensajes de orientación general.
- Priorizar contenido institucional validado.

**Decisiones que restringe**

- Formularios de consulta médica individual.
- Gestión de expedientes.
- Recomendaciones diagnósticas automatizadas.
- Procesos hospitalarios o administrativos ajenos a comunicación pública.

**Referencias**

- `project-charter.md`: Exclusiones de alto nivel.
- `vision.md`: Fronteras y antiobjetivos.
- `scope.md`: Funcionalidades fuera del alcance.
- `architecture-guide.md`: Reglas de seguridad y confianza.

---

# 9. Strategic Principles

## SP-01. Contenido Institucional Unificado

**Declaración normativa**

El producto deberá tratar noticias, campañas, enfermedades, programas, eventos, documentos, infografías, comunicados, avisos y preguntas frecuentes como variantes de contenido institucional, no como sistemas aislados.

**Justificación**

La documentación define `Content` como abstracción central y establece que los tipos de contenido comparten naturaleza editorial, de publicación, preservación y distribución.

**Implicaciones**

- La evolución funcional deberá evitar duplicidad entre tipos de contenido.
- Las nuevas variantes deberán evaluarse como extensiones del contenido institucional.
- El dominio deberá preservar una visión unificada del conocimiento.

**Decisiones que habilita**

- Crear capacidades comunes de clasificación, publicación y archivo.
- Incorporar nuevos tipos de contenido sin fragmentar el producto.
- Reutilizar recursos, fuentes y metadatos.

**Decisiones que restringe**

- Crear sistemas separados por cada tipo de contenido sin análisis.
- Duplicar reglas editoriales.
- Diseñar modelos aislados que impidan reutilización.

**Referencias**

- `PROJECT_TRANSFER_PACKAGE.md`: Modelo del dominio.
- `CONTEXT_TRANSFER_PACKAGE.md`: Decisiones arquitectónicas aprobadas.
- `vision.md`: Decisiones estratégicas iniciales.
- `scope.md`: Gestión central de contenido institucional.
- `architecture-guide.md`: Reglas para el dominio.

---

## SP-02. Separación entre Conocimiento, Contenido y Canales

**Declaración normativa**

El producto deberá distinguir conocimiento institucional, contenido publicable y canales de comunicación. Los canales deberán distribuir contenido, pero no deberán ser la fuente de verdad.

**Justificación**

La plataforma busca centralizar conocimiento institucional y distribuirlo por canales relevantes. La dependencia exclusiva de redes sociales es parte del problema actual.

**Implicaciones**

- El contenido deberá existir independientemente de redes sociales.
- Los canales deberán ser reemplazables.
- La fuente institucional deberá mantenerse en la plataforma.

**Decisiones que habilita**

- Preparar publicación manual asistida a canales.
- Incorporar nuevos canales futuros.
- Mantener portal público como fuente institucional.

**Decisiones que restringe**

- Acoplar el producto a Facebook, Instagram, X, TikTok, YouTube, WhatsApp u otra plataforma específica.
- Usar redes sociales como repositorio principal.
- Diseñar contenido exclusivamente para un canal.

**Referencias**

- `PROJECT_TRANSFER_PACKAGE.md`: Problema actual y propósito.
- `project-charter.md`: Beneficios y riesgos.
- `vision.md`: Canales desacoplados.
- `scope.md`: Canales de publicación/comunicación.
- `architecture-guide.md`: Reglas para canales.

---

## SP-03. Evolución Sostenible a Largo Plazo

**Declaración normativa**

El producto deberá diseñarse y evolucionar considerando una vida útil superior a diez años. Las decisiones deberán favorecer mantenibilidad, bajo acoplamiento y evolución progresiva.

**Justificación**

La documentación establece que el proyecto debe pensarse a largo plazo, con documentación profesional y arquitectura preparada para crecer sin rehacer el producto.

**Implicaciones**

- Las decisiones deberán evitar atajos que comprometan mantenibilidad.
- Las capacidades futuras deberán integrarse sin contradecir el núcleo.
- La documentación deberá mantenerse sincronizada.

**Decisiones que habilita**

- Posponer funcionalidades que comprometan el MVP.
- Mantener monolito modular como punto de partida.
- Registrar decisiones importantes.

**Decisiones que restringe**

- Microservicios prematuros.
- Soluciones rápidas sin documentación.
- Dependencias rígidas de canales, proveedores o decisiones tácticas.

**Referencias**

- `CONTEXT_TRANSFER_PACKAGE.md`: Principios permanentes.
- `project-charter.md`: Horizonte del proyecto.
- `vision.md`: Alcance temporal.
- `scope.md`: Escalabilidad evolutiva.
- `architecture-guide.md`: Principios de arquitectura.

---

## SP-04. Automatización Responsable y Secundaria

**Declaración normativa**

La automatización y la inteligencia artificial deberán incorporarse solo cuando preserven confiabilidad, trazabilidad y supervisión institucional. No deberán sustituir la responsabilidad institucional.

**Justificación**

El chatbot RAG y otras automatizaciones están previstas como evolución, pero el MVP debe construir primero una base confiable de conocimiento institucional.

**Implicaciones**

- La IA no deberá generar información pública sin supervisión institucional.
- El chatbot futuro deberá usar conocimiento institucional validado.
- La automatización no deberá comprometer la capacidad central.

**Decisiones que habilita**

- Posponer chatbot RAG hasta contar con contenido validado.
- Preparar trazabilidad de fuentes.
- Incorporar automatización por etapas.

**Decisiones que restringe**

- Publicación automática sin validación.
- Respuestas generadas sin base institucional.
- IA como objetivo principal del producto.

**Referencias**

- `vision.md`: IA con información oficial y antiobjetivos.
- `scope.md`: IA fuera del MVP funcional completo.
- `project-charter.md`: Riesgo de automatización prematura.
- `architecture-guide.md`: Reglas para IA y automatización.

---

## SP-05. MVP Protegido y Orientado a Valor Temprano

**Declaración normativa**

La versión 1.0 deberá mantenerse como un MVP institucional realista. Nuevas funcionalidades deberán posponerse cuando comprometan tiempo, claridad, confiabilidad o coherencia del alcance.

**Justificación**

`scope.md` establece que la versión 1.0 debe entregarse en aproximadamente un mes y proteger el valor temprano del producto.

**Implicaciones**

- Las capacidades Must Have deberán tener prioridad.
- Las funcionalidades Won't Have en v1.0 no deberán reintroducirse sin decisión formal.
- El MVP deberá validar publicación centralizada, portal público, línea del tiempo, multimedia básica y canales asistidos.

**Decisiones que habilita**

- Posponer roles avanzados, analítica avanzada, publicación programada y búsqueda semántica.
- Rechazar scope creep.
- Priorizar contenido institucional y portal público.

**Decisiones que restringe**

- Añadir IA completa al MVP.
- Ampliar multimedia hasta DAM avanzado.
- Crear flujos editoriales complejos antes del flujo básico.

**Referencias**

- `scope.md`: Matriz MoSCoW, exclusiones y riesgos.
- `project-charter.md`: Restricciones iniciales.
- `architecture-guide.md`: Reglas para cambios de alcance.

---

# 10. Operational Principles

## OP-01. Responsabilidad Institucional de Publicación

**Declaración normativa**

Toda publicación deberá estar vinculada a responsabilidad institucional. El sistema no deberá permitir publicación pública sin fuente, autoría o responsable identificable según aplique.

**Justificación**

La confianza pública depende de que la información publicada provenga de fuentes oficiales, institucionales o verificables.

**Implicaciones**

- El responsable institucional deberá poder administrar contenido.
- La trazabilidad básica deberá formar parte del MVP.
- La supervisión institucional deberá preservarse.

**Decisiones que habilita**

- Registro de autoría o responsabilidad.
- Identificación de fuente de información.
- Protección del panel administrativo.

**Decisiones que restringe**

- Publicación anónima.
- Contenido sin fuente institucional.
- Automatización editorial sin supervisión.

**Referencias**

- `project-charter.md`: Principios de gobernanza.
- `vision.md`: Confiabilidad y fuentes del conocimiento.
- `scope.md`: Trazabilidad básica.
- `architecture-guide.md`: Reglas de seguridad y confianza.

---

## OP-02. Actualización y Vigencia del Contenido

**Declaración normativa**

El producto deberá favorecer que la información publicada se mantenga actualizada, vigente y claramente administrable.

**Justificación**

La documentación establece que la población debe acceder a información oficial y vigente, y que la plataforma debe generar confianza y motivos para regresar.

**Implicaciones**

- El contenido deberá poder pasar por estados básicos de publicación.
- El contenido desactualizado deberá poder archivarse.
- La institución deberá asumir mantenimiento editorial.

**Decisiones que habilita**

- Estados como borrador, publicado y archivado.
- Contenido destacado para campañas vigentes.
- Línea del tiempo para preservar memoria sin confundirla con actualidad.

**Decisiones que restringe**

- Acumular contenido sin mantenimiento.
- Mantener información obsoleta como si fuera vigente.
- Publicar sin capacidad operativa de actualización.

**Referencias**

- `PROJECT_TRANSFER_PACKAGE.md`: Diferenciador del producto.
- `project-charter.md`: Factores críticos de éxito.
- `scope.md`: Estados básicos de publicación.
- `vision.md`: Criterios de éxito.

---

## OP-03. Organización Editorial Comprensible

**Declaración normativa**

El contenido deberá organizarse mediante criterios editoriales comprensibles para la población, como tipo, categoría, etiquetas, contenido destacado y búsqueda básica.

**Justificación**

La plataforma debe facilitar que la población encuentre información oficial rápidamente y reduzca la dispersión actual.

**Implicaciones**

- La clasificación deberá apoyar navegación y búsqueda.
- La organización deberá beneficiar consulta pública, no solo administración interna.
- El contenido destacado deberá responder a relevancia institucional.

**Decisiones que habilita**

- Navegación por tipos y categorías.
- Búsqueda básica.
- Contenido destacado o banners básicos.

**Decisiones que restringe**

- Estructuras opacas para la población.
- Taxonomías creadas solo por conveniencia técnica.
- Publicaciones sin clasificación mínima.

**Referencias**

- `vision.md`: Impacto esperado en la población.
- `scope.md`: Portal público, búsqueda y clasificación.
- `project-charter.md`: Beneficios para la población.

---

## OP-04. Uso de Recursos Visuales para Comprensión

**Declaración normativa**

El producto deberá favorecer el uso de recursos visuales cuando ayuden a comprender información de salud pública.

**Justificación**

Los documentos oficiales identifican el uso intensivo de recursos visuales e infografías como un diferenciador para facilitar aprendizaje.

**Implicaciones**

- Las infografías, imágenes, documentos y videos asociados deberán apoyar comprensión.
- La gestión multimedia básica deberá orientarse a reutilización.
- Los recursos visuales no deberán ser decorativos si no aportan claridad.

**Decisiones que habilita**

- Gestión multimedia básica.
- Asociación de recursos a contenido.
- Infografías como contenido institucional.

**Decisiones que restringe**

- Duplicación innecesaria de archivos.
- Uso de recursos visuales sin valor comunicativo.
- Convertir multimedia en DAM avanzado en el MVP.

**Referencias**

- `PROJECT_TRANSFER_PACKAGE.md`: Principios y diferenciador.
- `vision.md`: Recursos visuales.
- `scope.md`: Gestión multimedia básica.

---

## OP-05. Documentación como Fuente de Verdad Operativa

**Declaración normativa**

La documentación deberá ser la fuente de verdad del proyecto. Las decisiones importantes deberán documentarse y no deberán depender del historial del chat.

**Justificación**

`CONTEXT_TRANSFER_PACKAGE.md` establece que la documentación sustituye al historial de conversaciones como fuente principal de contexto.

**Implicaciones**

- Cada documento deberá mantenerse consistente con los anteriores.
- Las contradicciones deberán reportarse antes de proponer cambios.
- Los agentes de IA deberán trabajar desde documentación vigente.

**Decisiones que habilita**

- Crear documentos fundacionales antes de implementación.
- Registrar decisiones relevantes en ADRs.
- Revisar coherencia documental antes de avanzar.

**Decisiones que restringe**

- Usar el chat como fuente de verdad.
- Modificar alcance o visión sin documentación.
- Resolver contradicciones silenciosamente.

**Referencias**

- `CONTEXT_TRANSFER_PACKAGE.md`: Propósito y convenciones.
- `architecture-guide.md`: Documentación como parte del producto.
- `project-charter.md`: Principios de gobernanza.

---

## OP-06. Accesibilidad Básica del Conocimiento

**Declaración normativa**

El producto deberá facilitar que la población acceda al conocimiento institucional desde distintos dispositivos y mediante experiencias claras, responsivas y comprensibles.

**Justificación**

La accesibilidad del conocimiento es un principio permanente. La población general es el público principal y debe poder consultar información sin conocimientos técnicos.

**Implicaciones**

- El portal público deberá ser responsive.
- La navegación deberá ser clara.
- La información deberá estar disponible mediante canales relevantes.

**Decisiones que habilita**

- Diseño responsive.
- Búsqueda básica.
- Compartir contenido mediante enlaces.
- Preparación para canales de comunicación.

**Decisiones que restringe**

- Experiencias que funcionen solo para administración interna.
- Dependencia de un único canal.
- Presentación compleja que dificulte comprensión.

**Referencias**

- `PROJECT_TRANSFER_PACKAGE.md`: Público objetivo y principios.
- `vision.md`: Accesibilidad e impacto esperado.
- `scope.md`: Alcance no funcional.

---

# 11. Uso de los Principios para Aceptar, Rechazar, Priorizar o Posponer

Una funcionalidad deberá aceptarse si:

- fortalece CP-01, CP-02 o CP-03;
- respeta las fronteras de CP-05;
- no contradice `vision.md`;
- se encuentra dentro del alcance vigente o cuenta con justificación formal;
- mejora acceso, preservación, publicación, consulta o distribución del conocimiento institucional.

Una funcionalidad deberá rechazarse si:

- convierte el producto en una plataforma clínica, hospitalaria o de diagnóstico;
- compromete confiabilidad o responsabilidad institucional;
- depende de una red social como fuente principal;
- requiere generar información pública sin supervisión;
- contradice documentos oficiales.

Una funcionalidad deberá posponerse si:

- es valiosa pero no pertenece al MVP;
- requiere una base de conocimiento más madura;
- depende de integraciones externas no controladas;
- incrementa complejidad sin fortalecer valor temprano;
- corresponde a roadmap posterior.

---

# 12. Matriz de Trazabilidad de Principios

| Principio | PROJECT | CONTEXT | Charter | Architecture Guide | Vision | Scope |
|-----------|---------|---------|---------|--------------------|--------|-------|
| CP-01 Información confiable | Sí | Sí | Sí | Sí | Sí | Sí |
| CP-02 Conocimiento institucional | Sí | Sí | Sí | Sí | Sí | Sí |
| CP-03 Claridad y comprensión | Sí | Sí | Sí | Sí | Sí | Sí |
| CP-04 Prevención y educación | Sí | Sí | Sí | Sí | Sí | Sí |
| CP-05 Frontera no clínica | Sí | Sí | Sí | Sí | Sí | Sí |
| SP-01 Contenido institucional unificado | Sí | Sí | Sí | Sí | Sí | Sí |
| SP-02 Separación conocimiento-contenido-canales | Sí | Sí | Sí | Sí | Sí | Sí |
| SP-03 Evolución sostenible | Sí | Sí | Sí | Sí | Sí | Sí |
| SP-04 Automatización responsable | Sí | Sí | Sí | Sí | Sí | Sí |
| SP-05 MVP protegido | No | Sí | Sí | Sí | Sí | Sí |
| OP-01 Responsabilidad institucional | Sí | Sí | Sí | Sí | Sí | Sí |
| OP-02 Actualización y vigencia | Sí | No | Sí | No | Sí | Sí |
| OP-03 Organización editorial | Sí | No | Sí | No | Sí | Sí |
| OP-04 Recursos visuales | Sí | Sí | Sí | No | Sí | Sí |
| OP-05 Documentación como fuente de verdad | No | Sí | Sí | Sí | Sí | Sí |
| OP-06 Accesibilidad básica | Sí | Sí | Sí | Sí | Sí | Sí |

La marca "No" indica que el principio no aparece de forma explícita en ese documento, pero sí deriva de otros documentos oficiales y no contradice la fuente.

---

# 13. Restricciones de este Documento

Este documento no deberá utilizarse para definir:

- dominio detallado;
- entidades;
- reglas de negocio;
- arquitectura técnica;
- base de datos;
- API;
- frontend;
- backend;
- implementación.

Esas decisiones pertenecen a documentos posteriores.

---

# 14. Verificación de Coherencia

Antes de considerar este documento listo para revisión, se verificó que:

- los principios derivan de la documentación oficial;
- no se introducen principios ajenos al contexto institucional;
- no se contradice `vision.md`;
- no se redefine `scope.md`;
- el documento puede utilizarse como marco de decisión del producto;
- los principios son accionables y verificables;
- cada principio mantiene trazabilidad con documentos anteriores;
- no se definen entidades, reglas de negocio, base de datos, API ni arquitectura técnica.

---

# 15. Estado del Documento

**Estado:** Baseline

Este documento representa la primera versión del marco oficial de principios del producto.

Deberá revisarse y validarse antes de considerarse línea base.

Cualquier modificación futura deberá preservar la trazabilidad con documentos oficiales y evaluarse por su impacto sobre la capacidad central de publicar información confiable.
