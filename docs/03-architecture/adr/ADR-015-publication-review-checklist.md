# ADR-015: Revisión editorial mediante checklist antes de publicar

**Estado:** Aceptada.

## Contexto

El flujo inicial utilizaba registros de `Validation` asociados a fuentes como requisito para crear una `Publication`. Esto mezclaba dos responsabilidades distintas: el respaldo documental de una afirmación y la autorización editorial de una publicación institucional.

La operación diaria requiere que una persona responsable confirme que el contenido está listo para el portal público o para su distribución asistida, sin crear previamente un catálogo de validaciones por fuente.

## Decisión

La autorización de publicación se representa mediante una única `PublicationReview` vigente por `Content`.

- La revisión registra al usuario revisor, fecha, decisión y observaciones.
- Para aprobar, deben confirmarse: exactitud, vigencia, calidad editorial, autorización de multimedia y responsabilidad institucional.
- Una aprobación cambia el contenido a `READY_FOR_PUBLICATION`.
- Una solicitud de cambios cambia el contenido a `NEEDS_REVIEW` y exige observación.
- Cambiar el contenido después de una aprobación invalida la revisión y requiere una nueva.
- `Publication` solo se crea cuando existe una revisión vigente con decisión `APPROVED`.
- Las fuentes son opcionales y se conservan exclusivamente como respaldo documental; no condicionan por sí mismas la publicación.
- La trazabilidad conserva cada aprobación, solicitud de cambios e invalidación de aprobación.

## Consecuencias

- Se elimina la pantalla administrativa y la asociación de validaciones del flujo editorial cotidiano.
- Los datos y las APIs de validación existentes no se eliminan mediante esta migración para preservar información histórica, pero dejan de ser un requisito de publicación.
- No se implementan roles avanzados ni un workflow multinivel: cualquier administrador autenticado puede realizar la revisión en el MVP y queda identificado en la trazabilidad.

## Alternativas descartadas

- Mantener una validación de fuente como puerta de publicación: confunde respaldo de conocimiento con aprobación editorial.
- Publicar con un cambio manual de estado: no asegura checklist ni identidad del revisor.
- Implementar workflow editorial de múltiples etapas y roles: excede el alcance del MVP.
