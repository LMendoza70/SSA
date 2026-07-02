# Alcance del Producto

| Campo | Valor |
|--------|-------|
| Proyecto | Plataforma de Gestión, Comunicación y Educación para la Salud |
| Cliente | Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Alcance del Producto |
| Código | DOC-002 |
| Versión | 1.0.0 |
| Estado | Draft |
| Autor | Equipo del Proyecto |
| Rol arquitectónico | Software Architect & Product Architect |
| Fecha | 2026-07-02 |

---

# 1. Propósito del Documento

Este documento define el alcance de la versión 1.0 de la **Plataforma de Gestión, Comunicación y Educación para la Salud** de la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

Su propósito es establecer qué capacidades deberán formar parte de la primera entrega del producto, qué capacidades estarán incluidas de forma parcial y qué funcionalidades quedarán fuera del MVP.

El documento no describe cómo se implementará técnicamente el sistema. No define tecnologías, base de datos, endpoints, arquitectura interna, pantallas detalladas ni código.

El alcance aquí definido busca proteger la visión del producto y permitir una entrega institucional realista en aproximadamente un mes.

---

# 2. Objetivos del Documento de Alcance

Este documento sirve para:

- delimitar el MVP de la versión 1.0;
- proteger el tiempo de entrega;
- reducir riesgos de alcance;
- establecer prioridades funcionales y no funcionales;
- evitar crecimiento descontrolado del producto durante la primera entrega;
- mantener alineación con `vision.md`;
- diferenciar lo incluido, lo parcialmente incluido y lo excluido;
- preparar el camino para documentos posteriores como `product-principles.md`, `personas.md`, `ubiquitous-language.md`, `domain.md`, `business-rules.md` y `architecture.md`.

El alcance deberá funcionar como criterio de decisión durante el diseño y la implementación. Si una nueva necesidad no fortalece la capacidad central de **publicar información confiable**, deberá posponerse o justificarse explícitamente.

---

# 3. Relación con `vision.md`

Este documento toma como base la visión oficial del producto definida en `vision.md`.

La versión 1.0 debe mantener la capacidad central establecida por la visión:

> Publicar información confiable.

También debe contribuir al propósito estratégico de transformar conocimiento institucional en conocimiento accesible, claro, confiable y útil para la población.

Por lo tanto, el alcance de la versión 1.0 se orienta a entregar una primera plataforma funcional capaz de:

- centralizar contenido institucional;
- publicar información oficial;
- facilitar la consulta pública;
- preservar conocimiento relevante;
- preparar contenido para su distribución mediante canales de comunicación;
- establecer una base ordenada para la evolución futura.

Cualquier funcionalidad que no contribuya directamente a estos objetivos deberá quedar fuera del MVP o posponerse para versiones posteriores.

---

# 4. Objetivo del Alcance

El objetivo del alcance de la versión 1.0 es entregar un producto mínimo viable institucional, útil y controlado, que permita a la Jurisdicción Sanitaria iniciar la publicación centralizada de información oficial de salud pública.

La versión 1.0 deberá enfocarse en valor temprano, claridad operativa, reducción de riesgo y preservación del propósito estratégico del producto.

El alcance no busca implementar todas las capacidades previstas en la visión final. Busca entregar el primer núcleo funcional sobre el cual puedan crecer futuras capacidades como chatbot, publicación programada, métricas, búsqueda semántica, flujos editoriales y gestión avanzada de usuarios.

---

# 5. Mapa Conceptual del Producto

El centro del producto es el conocimiento institucional convertido en contenido confiable, organizado y publicable.

```text
                         +----------------------+
                         |   Futuro Chatbot     |
                         |   basado en          |
                         |   conocimiento       |
                         +----------^-----------+
                                    |
+-------------------+     +---------+----------+     +----------------------+
| Portal Público    |<----| Conocimiento /     |---->| Canales de          |
| consulta ciudadana|     | Contenido          |     | Comunicación        |
+-------------------+     | Institucional      |     +----------------------+
                          +---------+----------+
                                    |
              +---------------------+---------------------+
              |                                           |
     +--------v---------+                         +-------v--------+
     | Línea del Tiempo |                         | Buscador       |
     | memoria pública  |                         | acceso rápido  |
     +------------------+                         +----------------+
```

Este mapa no representa una arquitectura técnica. Representa la relación conceptual entre las principales capacidades del producto.

---

# 6. Alcance de la Versión 1.0

La versión 1.0 incluirá una primera plataforma institucional compuesta por:

- gestión central de contenido institucional;
- portal público para consulta de información publicada;
- línea del tiempo pública y administrable;
- preparación o asistencia para compartir contenido en canales de comunicación;
- gestión multimedia básica;
- administración inicial mediante acceso autenticado para un responsable institucional;
- configuración básica del sitio y elementos destacados.

El alcance se considera exitoso si permite que la Jurisdicción publique información confiable, la organice de forma comprensible y la ponga a disposición de la población mediante una experiencia pública clara, responsive y preparada para evolucionar.

---

# 7. Alcance Funcional

El alcance funcional define las capacidades de producto que deberán estar disponibles en la versión 1.0.

## 7.1 Gestión Central de Contenido Institucional

La versión 1.0 incluirá una capacidad central para administrar contenido institucional.

El contenido podrá representar:

- noticias;
- campañas;
- enfermedades;
- programas;
- eventos;
- comunicados;
- avisos;
- documentos;
- infografías;
- preguntas frecuentes;
- información institucional.

Estos tipos no deberán entenderse como sistemas aislados. Deberán considerarse variantes o especializaciones de un mismo modelo conceptual de contenido institucional.

Esta capacidad deberá permitir:

- crear contenido institucional;
- editar contenido institucional;
- publicar contenido institucional;
- administrar estados básicos de publicación;
- clasificar contenido por tipo, categorías y etiquetas;
- gestionar contenido institucional y sus metadatos;
- asociar recursos multimedia;
- registrar datos de publicación;
- identificar fuente y responsabilidad institucional;
- definir información básica para visibilidad pública y SEO.

El objetivo de esta capacidad es permitir que la Jurisdicción convierta conocimiento institucional en contenido publicable, claro, reutilizable y confiable.

## 7.2 Portal Público

La versión 1.0 incluirá una experiencia pública para que la población consulte contenido publicado.

El portal deberá permitir:

- consultar una página de inicio;
- consultar listados de contenido;
- consultar el detalle de cada contenido publicado;
- navegar por tipos de contenido;
- navegar por categorías;
- realizar búsqueda básica;
- consultar contenido destacado;
- compartir contenido mediante enlaces;
- acceder correctamente desde dispositivos móviles y de escritorio.

El portal deberá priorizar claridad, facilidad de consulta y acceso rápido a información oficial.

## 7.3 Línea del Tiempo

La versión 1.0 incluirá una línea del tiempo pública e interactiva.

La línea del tiempo deberá ser administrable y no deberá implementarse como contenido estático.

Su objetivo será mostrar eventos históricos o relevantes de la Jurisdicción, preservando memoria institucional y facilitando la consulta pública de hitos sanitarios, campañas, programas o acontecimientos importantes.

Cada evento de línea del tiempo deberá permitir, como mínimo:

- identificar el evento;
- describir su relevancia;
- indicar fecha o periodo;
- asociar un recurso multimedia cuando aplique;
- relacionarlo con contenido institucional cuando sea pertinente.

## 7.4 Canales de Publicación / Canales de Comunicación

La versión 1.0 incluirá una primera capacidad relacionada con la distribución de contenido hacia canales de comunicación.

Esta capacidad deberá modelarse conceptualmente como **Canales de Publicación** o **Canales de Comunicación**, no como una integración rígida a redes sociales específicas.

Los canales actuales podrán incluir Facebook, Instagram, X, TikTok, YouTube u otros, pero el producto deberá conservar una visión abierta para incorporar nuevos canales en el futuro.

En la versión 1.0, al publicar contenido en el sitio, el responsable institucional deberá contar con una opción para prepararlo o compartirlo en uno o varios canales.

El contenido preparado para canal deberá derivarse del contenido publicado, sus datos de publicación, recursos asociados y enlace público.

Dependiendo de las restricciones reales de los canales externos, esta capacidad podrá entregarse como publicación manual asistida o como flujo preparado para integración posterior.

## 7.5 Gestión Multimedia Básica

La versión 1.0 incluirá gestión básica de recursos multimedia reutilizables.

Deberá permitir administrar:

- imágenes;
- infografías;
- documentos PDF;
- videos mediante enlace externo o recurso asociado.

Los recursos deberán poder asociarse a contenido institucional sin duplicación innecesaria.

La versión 1.0 no incluirá un gestor documental avanzado ni un sistema DAM completo.

## 7.6 Administración Inicial

La versión 1.0 incluirá administración inicial mediante acceso autenticado para un responsable institucional.

Deberá permitir:

- iniciar sesión;
- cerrar sesión;
- proteger el panel administrativo;
- identificar al responsable institucional;
- registrar autoría o responsabilidad de publicación.

Múltiples usuarios, roles, permisos y flujos editoriales avanzados quedan fuera del MVP. Sin embargo, el diseño conceptual de la versión 1.0 no deberá impedir su incorporación futura.

---

# 8. Alcance No Funcional

La versión 1.0 deberá considerar los siguientes atributos no funcionales a nivel conceptual.

## 8.1 Seguridad Básica

El panel administrativo deberá estar protegido mediante acceso autenticado.

El sistema no deberá permitir administración pública anónima ni publicación de contenido sin responsabilidad institucional.

## 8.2 Diseño Responsive

El portal público deberá poder consultarse adecuadamente desde dispositivos móviles y de escritorio.

La experiencia pública deberá favorecer el acceso de la población a información oficial sin depender de un tipo específico de dispositivo.

## 8.3 Claridad de Navegación

La navegación deberá facilitar que la población encuentre contenido publicado por tipo, categoría, búsqueda básica y contenido destacado.

La claridad de acceso tendrá prioridad sobre estructuras complejas.

## 8.4 SEO Básico

El contenido publicado deberá contar con estructura y metadatos básicos para favorecer su visibilidad en buscadores.

El SEO avanzado queda fuera del MVP.

## 8.5 Mantenibilidad

La versión 1.0 deberá evitar decisiones que fragmenten innecesariamente el dominio o dificulten el mantenimiento futuro.

Los tipos de contenido deberán conservar una visión unificada como contenido institucional.

## 8.6 Escalabilidad Evolutiva

El MVP deberá permitir evolución posterior hacia nuevas capacidades sin rehacer el núcleo del producto.

La escalabilidad esperada en esta etapa es evolutiva y arquitectónica, no necesariamente de alto volumen operativo.

## 8.7 Preparación Cloud-Ready

La versión 1.0 deberá mantener una orientación conceptual compatible con despliegues futuros en infraestructura institucional o nube.

Este documento no define estrategia técnica de despliegue.

## 8.8 Accesibilidad Básica

El portal público deberá considerar prácticas básicas de accesibilidad para facilitar el consumo de información por parte de la población.

La accesibilidad avanzada deberá profundizarse en documentos posteriores de experiencia pública.

## 8.9 Trazabilidad Básica

El contenido publicado deberá conservar trazabilidad básica de autoría, fuente, responsabilidad institucional y estado de publicación.

Esta trazabilidad es necesaria para reforzar la confianza en la información publicada.

---

# 9. Matriz de Priorización MoSCoW

| Prioridad | Capacidad | Alcance v1.0 |
|-----------|-----------|--------------|
| Must Have | Gestión central de contenido institucional | Incluida |
| Must Have | Portal público | Incluida |
| Must Have | Búsqueda básica | Incluida |
| Must Have | Línea del tiempo | Incluida |
| Must Have | Gestión multimedia básica | Incluida |
| Must Have | Acceso autenticado al panel administrativo | Incluida |
| Must Have | Estados básicos de publicación | Incluida |
| Must Have | Clasificación por tipo, categoría y etiquetas | Incluida |
| Should Have | Preparación para compartir en canales de comunicación | Incluida de forma inicial |
| Should Have | SEO básico | Incluida |
| Should Have | Configuración básica del sitio | Incluida |
| Should Have | Contenido destacado o banners básicos | Incluida |
| Could Have | Ajustes básicos adicionales de presentación pública | Condicionado a tiempo disponible |
| Could Have | Mejoras menores de reutilización multimedia | Condicionado a tiempo disponible |
| Won't Have en v1.0 | Chatbot RAG | Posterior |
| Won't Have en v1.0 | Publicación programada | Posterior |
| Won't Have en v1.0 | Roles avanzados | Posterior |
| Won't Have en v1.0 | Analítica avanzada | Posterior |
| Won't Have en v1.0 | Búsqueda semántica | Posterior |
| Won't Have en v1.0 | Integración automática completa con APIs de redes sociales | Posterior |

Esta priorización deberá utilizarse para resolver conflictos durante la entrega del MVP.

---

# 10. Capacidades Parcialmente Incluidas

## 10.1 Canales de Comunicación

Los canales de comunicación estarán incluidos de forma parcial.

La versión 1.0 deberá permitir preparar o asistir la publicación de contenido hacia canales externos, pero no deberá considerarse una integración completa ni automática avanzada.

Quedan fuera de esta versión:

- programación de publicaciones;
- republicación avanzada;
- reintentos automáticos;
- historial avanzado de publicaciones;
- métricas de redes sociales;
- administración detallada de credenciales por canal;
- adaptación avanzada de formato por plataforma.

## 10.2 SEO

El SEO estará incluido de forma básica.

La versión 1.0 deberá permitir que el contenido publicado tenga estructura y datos mínimos para mejorar su visibilidad.

Quedan fuera del alcance inicial capacidades avanzadas de auditoría SEO, análisis automatizado de posicionamiento, recomendaciones inteligentes o integraciones especializadas.

## 10.3 Administración de Usuarios

La administración de usuarios estará incluida de forma mínima.

La versión 1.0 contempla administración inicial mediante acceso autenticado para un responsable institucional.

El producto deberá prepararse conceptualmente para múltiples usuarios, roles y permisos, pero dichos flujos no forman parte obligatoria del MVP.

## 10.4 Gestión Multimedia

La gestión multimedia estará incluida de forma básica.

La versión 1.0 deberá permitir subir, asociar y reutilizar recursos comunes, pero no incluirá capacidades avanzadas como flujos de aprobación, edición multimedia, metadatos complejos, transformación automática de formatos o administración documental avanzada.

## 10.5 Inteligencia Artificial

La inteligencia artificial no estará incluida como capacidad funcional completa en la versión 1.0.

El alcance 1.0 deberá preservar el enfoque conceptual necesario para que, en versiones posteriores, el conocimiento institucional pueda alimentar un chatbot basado en recuperación de información oficial.

No se requiere un chatbot funcional para el MVP.

---

# 11. Dependencias Funcionales

Las principales dependencias funcionales de la versión 1.0 son:

- el portal público depende de contenido institucional publicado;
- la búsqueda básica depende de contenido correctamente clasificado y publicado;
- la navegación por tipos y categorías depende de una clasificación editorial mínima;
- la línea del tiempo depende de conocimiento institucional estructurado como eventos o contenido relacionado;
- los canales de comunicación dependen de contenido publicado y de enlaces públicos disponibles;
- la gestión multimedia depende de recursos asociados a contenido institucional;
- la trazabilidad depende de registrar fuente, autoría o responsabilidad institucional;
- el chatbot futuro dependerá de un repositorio confiable de contenido institucional validado;
- la analítica futura dependerá de una experiencia pública y flujos de publicación estables.

Estas dependencias refuerzan la necesidad de priorizar primero la gestión confiable de contenido institucional antes de incorporar automatizaciones avanzadas.

---

# 12. Funcionalidades Fuera del Alcance

Las siguientes funcionalidades quedan fuera del alcance de la versión 1.0.

| Funcionalidad excluida | Justificación |
|------------------------|---------------|
| Chatbot con IA/RAG completamente funcional | Primero debe existir una base confiable, clasificada y publicada de conocimiento institucional. |
| Programación de publicaciones en redes sociales | Requiere validar primero el flujo básico de publicación y distribución asistida. |
| Republicación avanzada | Depende de historial, reglas editoriales y canales estabilizados. |
| Métricas de redes sociales | Dependen de integraciones externas y no son necesarias para validar el MVP institucional. |
| Analítica avanzada | Debe incorporarse después de estabilizar el portal público y los flujos de consulta. |
| Múltiples roles de usuario | Aumenta complejidad operativa; la versión 1.0 requiere administración inicial controlada. |
| Flujos de revisión editorial | Primero debe validarse el flujo básico de creación, publicación y archivo. |
| Expediente clínico | Contradice la frontera del producto, que no es una plataforma clínica. |
| Consulta médica | El producto comunica y educa; no sustituye atención profesional. |
| Diagnóstico | Requiere criterio clínico y queda fuera del propósito institucional del portal. |
| Sistema hospitalario | Pertenece a otra categoría de sistemas y desviaría el alcance. |
| Sistema de citas | No forma parte de la capacidad central de publicar información confiable. |
| Inventario médico | Es una capacidad administrativa ajena a comunicación y educación en salud pública. |
| Aplicación móvil nativa | La versión 1.0 prioriza portal responsive para entregar valor temprano. |
| Integración completa con APIs de redes sociales | Depende de restricciones externas y puede comprometer la entrega del MVP. |
| Motor avanzado de búsqueda semántica | Requiere una base de conocimiento más madura y clasificación consistente. |
| Internacionalización | No es necesaria para validar la primera entrega institucional. |
| Versionado avanzado de contenidos | Aumenta complejidad editorial; podrá evaluarse después de estabilizar la publicación básica. |
| Gestor multimedia avanzado | La versión 1.0 requiere reutilización básica, no un DAM completo. |
| Automatización editorial sin supervisión institucional | Podría comprometer confiabilidad, trazabilidad y responsabilidad institucional. |
| Procesamiento clínico de datos personales | Queda fuera por naturaleza y riesgo del producto. |

Estas exclusiones protegen la entrega del MVP y evitan que la primera versión pierda foco.

---

# 13. Supuestos

El alcance de la versión 1.0 parte de los siguientes supuestos:

- la primera entrega deberá completarse aproximadamente en un mes;
- existirá al menos un responsable institucional con acceso autenticado para operar el panel;
- el contenido inicial será proporcionado o validado por la Jurisdicción;
- la prioridad será publicar información confiable antes que automatizar procesos avanzados;
- las integraciones con canales externos pueden estar limitadas por políticas o restricciones de cada plataforma;
- la línea del tiempo se alimentará con eventos definidos o validados por la institución;
- el portal público deberá funcionar correctamente en dispositivos móviles y de escritorio;
- la versión 1.0 deberá dejar una base ordenada para evolucionar sin rehacer el producto.

---

# 14. Restricciones

La versión 1.0 deberá respetar las siguientes restricciones:

- no deberá contradecir la visión oficial del producto;
- no deberá tratar cada tipo de contenido como un sistema aislado;
- no deberá convertirse en expediente clínico, sistema hospitalario, sistema de citas o herramienta de diagnóstico;
- no deberá depender exclusivamente de una red social;
- no deberá generar contenido público sin supervisión institucional;
- no deberá incorporar automatizaciones avanzadas que comprometan la confiabilidad del contenido;
- no deberá priorizar complejidad tecnológica sobre claridad, confiabilidad y entrega de valor;
- no deberá ampliar el alcance inicial con funcionalidades que pertenezcan claramente a versiones posteriores;
- no deberá cerrar decisiones de arquitectura técnica que correspondan a documentos posteriores.

---

# 15. Entregables de la Versión 1.0

La versión 1.0 deberá entregar:

- acceso autenticado al panel administrativo;
- gestión central de contenido institucional;
- estados básicos de publicación;
- clasificación por tipo, categoría y etiquetas;
- publicación de contenido institucional con metadatos, recursos asociados, datos de publicación, fuente y responsabilidad institucional;
- portal público con inicio, listados, detalle, navegación por tipos y categorías;
- búsqueda básica pública;
- contenido destacado o banners básicos;
- línea del tiempo pública e interactiva;
- administración básica de eventos de línea del tiempo;
- gestión multimedia básica;
- preparación o asistencia para compartir contenido en canales de comunicación;
- configuración básica del sitio;
- trazabilidad básica de autoría o responsabilidad de publicación.

---

# 16. Criterios de Aceptación del MVP

La versión 1.0 será aceptada si cumple los siguientes criterios:

- la Jurisdicción puede acceder a un panel administrativo protegido;
- el responsable institucional puede crear, editar, publicar, archivar y consultar contenido institucional;
- el contenido puede clasificarse por tipo, categoría y etiquetas;
- el contenido publicado puede consultarse desde el portal público;
- la población puede navegar por tipos de contenido y categorías;
- la población puede realizar búsqueda básica de contenido;
- cada contenido puede mostrar los datos mínimos necesarios para su comprensión pública, fuente y responsabilidad institucional;
- el portal público puede mostrar contenido destacado;
- la línea del tiempo es pública, interactiva y administrable;
- los eventos de línea del tiempo pueden identificar el evento, describir su relevancia e indicar fecha o periodo;
- el responsable institucional puede asociar recursos multimedia básicos a contenido;
- el responsable institucional puede preparar o compartir contenido mediante canales de comunicación definidos;
- el sistema conserva la capacidad central de publicar información confiable;
- el producto no incluye funcionalidades clínicas, hospitalarias o de diagnóstico;
- el alcance entregado permite evolucionar hacia futuras capacidades sin contradecir la visión del producto.

---

# 17. Roadmap Posterior

Para la versión 1.1 o siguientes se consideran las siguientes capacidades.

## 17.1 Inteligencia Artificial y Conocimiento

- chatbot RAG basado en conocimiento institucional;
- búsqueda semántica;
- mejoras en recuperación de conocimiento;
- capacidades avanzadas de reutilización de conocimiento institucional.

## 17.2 Publicación y Canales

- publicación programada;
- republicación;
- historial avanzado de publicaciones;
- integración más profunda con canales externos;
- adaptación avanzada por canal.

## 17.3 Gestión Editorial

- múltiples usuarios y roles;
- flujos de revisión editorial;
- versionado avanzado de contenidos;
- reglas editoriales más completas.

## 17.4 Analítica y Métricas

- métricas de canales de comunicación;
- analítica de uso del portal;
- medición de interacción con contenidos;
- reportes institucionales.

## 17.5 Seguridad y Usuarios

- permisos por rol;
- auditoría más detallada;
- administración avanzada de sesiones;
- políticas operativas de acceso.

## 17.6 Experiencia Pública

- mejoras de SEO;
- mejoras de accesibilidad;
- mejoras de navegación y descubrimiento;
- personalización editorial;
- mejoras del gestor multimedia.

El roadmap posterior deberá priorizarse con base en el uso real de la versión 1.0, el valor institucional y el impacto en la población.

---

# 18. Riesgos de Alcance

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Intentar implementar IA en el MVP | Puede retrasar la entrega y producir respuestas sin una base confiable de conocimiento institucional. | Posponer chatbot y búsqueda semántica hasta contar con contenido publicado, clasificado y validado. |
| Convertir cada tipo de contenido en un sistema separado | Aumenta complejidad, duplica lógica y debilita la visión de contenido institucional unificado. | Mantener un modelo conceptual central de contenido institucional con variantes por tipo. |
| Agregar roles y permisos complejos | Incrementa esfuerzo de diseño, pruebas y operación antes de validar el flujo básico. | Limitar v1.0 a acceso autenticado para un responsable institucional y preparar evolución futura. |
| Depender demasiado de APIs externas | Puede bloquear el MVP por restricciones, permisos o cambios de plataformas externas. | Entregar publicación manual asistida o flujo preparado para integración posterior. |
| Ampliar multimedia hasta un DAM avanzado | Desvía el esfuerzo hacia gestión documental compleja y reduce foco en publicación confiable. | Limitar v1.0 a recursos básicos reutilizables asociados a contenido. |
| Confundir el sistema con una plataforma clínica | Introduce riesgos funcionales, legales y operativos ajenos al propósito del producto. | Mantener fronteras explícitas: comunicación y educación en salud pública, no atención clínica. |
| Priorizar tecnología sobre claridad comunicativa | Puede producir un sistema complejo que no ayude a la población a comprender información oficial. | Evaluar cada capacidad contra claridad, confiabilidad, acceso y valor para la población. |
| Incorporar flujos editoriales avanzados antes del flujo básico | Puede retrasar el MVP y dificultar operación inicial. | Validar primero creación, publicación, archivo y consulta pública de contenido. |

Para controlar estos riesgos, cualquier ampliación del alcance deberá evaluarse contra la visión del producto, el tiempo disponible, la capacidad central de publicar información confiable y el valor directo para la población.

---

# 19. Estado del Documento

**Estado:** Draft

Este documento representa la definición inicial del alcance de la versión 1.0.

Deberá ser revisado y validado antes de iniciar el diseño detallado de dominio, arquitectura, base de datos, API o implementación.

Cualquier cambio relevante en el alcance deberá documentarse y evaluarse por su impacto en tiempo, calidad, mantenibilidad y coherencia con la visión del producto.
