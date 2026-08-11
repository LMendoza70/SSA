# ADR-011: Storage Provider Pattern

**Estado:** Aceptada.

## Contexto

El sistema debe almacenar archivos multimedia (imágenes, PDF, video, audio) asociados
a contenidos. Inicialmente se utilizará el sistema de archivos local, pero la
arquitectura debe permitir migrar a almacenamiento cloud (Amazon S3, Azure Blob
Storage, Google Cloud Storage) sin cambiar el código de los módulos de negocio.

## Decisión

Implementar una abstracción **StorageProvider** mediante:
- Una **interfaz** `StorageProvider` que define operaciones: `upload(file, path)`,
  `delete(path)`, `getUrl(path)`.
- Una **implementación concreta** `LocalStorageProvider` que opera sobre el sistema
  de archivos local.
- Los módulos de negocio (Media, Content, etc.) **nunca acceden directamente** al
  sistema de archivos; siempre inyectan `StorageProvider`.

El provider se inyecta mediante el sistema de DI de NestJS, permitiendo intercambiar
la implementación desde la configuración del módulo sin modificar los consumidores.

## Justificación

- Desacopla el almacenamiento físico de la lógica de negocio.
- Permite cambiar de proveedor cloud sin modificar servicios, controladores ni DTOs.
- Facilita las pruebas: se puede inyectar un `MockStorageProvider` en tests unitarios.
- Cumple con el principio de Infrastructure depende de contratos, no al revés.
- Preparación cloud-ready sin depender de un proveedor específico.

## Consecuencias

- `LocalStorageProvider` requiere configurar `app.useStaticAssets` para servir archivos.
- Los archivos se almacenan en `uploads/` con estructura por tipo y fecha.
- Las URLs generadas son relativas al servidor (`/uploads/...`).
- Para migrar a S3, solo se necesita crear `S3StorageProvider` que implemente la misma
  interfaz y cambiar el provider en el módulo.

## Riesgos

- El almacenamiento local no escala horizontalmente sin almacenamiento compartido (NFS,
  EFS, etc.).
- Las URLs locales pueden cambiar si se modifica la estructura de carpetas.

## Mitigación

- El primer riesgo se mitiga migrando a cloud storage cuando sea necesario.
- Las URLs almacenadas en BD deben ser relativas o generarse dinámicamente desde el
  provider, no almacenarse como absolutas.

## Alternativas descartadas

- Acceso directo al filesystem desde servicios: acopla lógica de negocio a infraestructura.
- Solo cloud storage desde el inicio: dependencia temprana de un proveedor y complejidad
  operativa innecesaria para el MVP.
- Base de datos como almacenamiento binario (base64 en columnas): rendimiento pésimo,
  backups enormes.
