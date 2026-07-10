# Checklist del Proyecto

| Campo | Valor |
|---|---|
| Proyecto | Plataforma de Gestion, Comunicacion y Educacion para la Salud |
| Cliente | Jurisdiccion Sanitaria de Huejutla de Reyes, Hidalgo |
| Documento | Checklist del Proyecto |
| Fase actual | Implementation / Phase 10 operativa |
| Estado | Baseline operativa inicial |
| Fecha | 2026-07-10 |

---

## 1. Proposito

Este checklist sirve para ubicar rapidamente en que parte del proyecto se encuentra el desarrollo y que falta para avanzar con control.

Debe actualizarse cada vez que se complete un hito relevante, se autorice una accion tecnica o se cierre un slice de implementacion.

---

## 2. Estado General

| Area | Estado | Checklist |
|---|---|---|
| Foundation | Baseline | [x] |
| Product | Baseline documental | [x] |
| Domain | Baseline documental | [x] |
| Architecture | Baseline documental | [x] |
| Database | Baseline documental | [x] |
| API | Baseline | [x] |
| Frontend | Baseline documental | [x] |
| Backend | Baseline documental | [x] |
| AI | Baseline futura | [x] |
| DevOps | Baseline | [x] |
| Implementation Start | Baseline de arranque | [x] |
| Implementacion real | Pendiente | [ ] |
| MVP funcional | Pendiente | [ ] |

Lectura del estado actual:

```text
El proyecto ya cerro la baseline documental principal.
La etapa activa es Implementation.
Solo esta autorizado Slice 0 - Preparacion controlada.
No existe aun codigo de aplicacion.
```

---

## 3. Checklist de Documentacion

### 3.1 Foundation

- [x] Project Charter documentado.
- [x] Guia de arquitectura documentada.
- [x] Documentacion establecida como fuente de verdad.

### 3.2 Product

- [x] Vision documentada.
- [x] Alcance MVP documentado.
- [x] Principios de producto documentados.
- [x] Personas y actores documentados.
- [ ] Revisar y normalizar estados internos de documentos que aun indiquen `Draft` si se desea cierre formal estricto.

### 3.3 Domain

- [x] Lenguaje ubicuo documentado.
- [x] Dominio documentado.
- [x] Reglas de negocio documentadas.
- [x] Casos de uso documentados.

### 3.4 Architecture

- [x] Arquitectura general documentada.
- [x] Clean Architecture definida.
- [x] Modular Monolith definido.
- [x] DDD Lite definido.
- [x] Antipatrones prohibidos documentados.
- [ ] Evaluar si se requieren ADRs separados para decisiones nuevas durante implementacion.

### 3.5 Database

- [x] Estrategia de base de datos documentada.
- [x] ERD documentado.
- [x] Prisma Schema documentado.
- [x] Archivo `docs/04-database/schema.prisma` disponible como referencia.
- [ ] Crear carpeta `prisma/` en la raiz cuando se autorice la preparacion tecnica.
- [ ] Ubicar `schema.prisma` operativo en `prisma/schema.prisma`.
- [ ] Revisar schema de forma estatica antes de cualquier comando Prisma.
- [ ] Ejecutar `prisma validate` solo cuando se autorice.
- [ ] Crear migraciones solo cuando se autorice.

### 3.6 API

- [x] Especificacion API documentada.
- [x] Autenticacion documentada.
- [x] Separacion `/api/v1/public`, `/api/v1/admin` y `/api/v1/auth` definida.
- [x] Endpoints de MVP definidos a nivel arquitectonico.
- [ ] Generar OpenAPI/Swagger cuando exista backend real.

### 3.7 Frontend

- [x] Arquitectura frontend documentada.
- [x] Stack frontend definido.
- [x] Portal publico y panel administrativo definidos conceptualmente.
- [ ] Crear aplicacion React/Vite.
- [ ] Implementar layout publico.
- [ ] Implementar layout administrativo protegido.

### 3.8 Backend

- [x] Arquitectura backend documentada.
- [x] Plan de implementacion backend documentado.
- [x] Incrementos backend definidos.
- [ ] Crear aplicacion NestJS.
- [ ] Configurar TypeScript strict.
- [ ] Implementar health check.
- [ ] Implementar autenticacion administrativa inicial.

### 3.9 AI

- [x] Estrategia AI/RAG documentada como futura.
- [x] Chatbot fuera del MVP funcional.
- [x] Embeddings y pgvector fuera del arranque.
- [ ] Retomar IA solo despues de contar con corpus institucional publicado, validado y clasificado.

### 3.10 DevOps

- [x] Estrategia DevOps MVP documentada.
- [x] Estrategia de despliegue documentada.
- [x] Estrategia de ambientes documentada.
- [x] Kubernetes fuera del MVP.
- [x] Docker recomendado, no obligatorio.
- [ ] Crear `.env.example` sin secretos.
- [ ] Definir estrategia local real de PostgreSQL.
- [ ] Definir proveedor de despliegue cuando corresponda.

---

## 4. Checklist de Implementation

### Slice 0 - Preparacion Controlada

Estado: **En espera de ejecucion tecnica**

- [x] Baseline documental revisada.
- [x] Carpeta `docs/10-implementation/` creada.
- [x] `implementation-start.md` creado.
- [x] Autorizacion limitada a Slice 0 registrada.
- [x] Checklist operativo creado.
- [ ] Confirmar rama de trabajo.
- [ ] Crear `package.json` raiz.
- [ ] Configurar workspace `pnpm`.
- [ ] Crear `apps/web/`.
- [ ] Crear `apps/api/`.
- [ ] Crear `packages/shared/`.
- [ ] Crear `prisma/`.
- [ ] Colocar `schema.prisma` operativo en `prisma/schema.prisma`.
- [ ] Crear `.env.example` sin secretos.
- [ ] Documentar scripts base.
- [ ] Revisar `schema.prisma` de forma estatica.
- [ ] Registrar cualquier contradiccion documental antes de implementar.

Criterio de salida:

```text
Repositorio preparado y documentado, sin migraciones ejecutadas.
```

### Slice 1 - Backend Base y Health Check

Estado: **Pendiente**

- [ ] Crear proyecto NestJS base.
- [ ] Configurar TypeScript strict.
- [ ] Configurar variables de entorno.
- [ ] Configurar validacion global.
- [ ] Configurar manejo basico de errores.
- [ ] Implementar health check sin datos sensibles.
- [ ] Verificar arranque local del backend.

Criterio de salida:

```text
Backend arranca localmente y expone health check tecnico basico.
```

### Slice 2 - Prisma Local Controlado

Estado: **Pendiente y requiere autorizacion**

- [ ] Autorizar comandos Prisma.
- [ ] Ejecutar `prisma validate`.
- [ ] Ejecutar `prisma format` si se autoriza.
- [ ] Ejecutar `prisma generate` si se autoriza.
- [ ] Crear migracion local si se autoriza.
- [ ] Conectar backend a PostgreSQL local.
- [ ] Probar conectividad minima.

Criterio de salida:

```text
Prisma validado y backend conectado localmente sin afectar produccion.
```

### Slice 3 - Autenticacion Administrativa Inicial

Estado: **Pendiente**

- [ ] Implementar login administrativo.
- [ ] Implementar refresh token en cookie HttpOnly.
- [ ] Implementar logout.
- [ ] Implementar `/auth/me`.
- [ ] Proteger rutas administrativas.
- [ ] Usar Argon2 para hash de contrasena.
- [ ] Definir mecanismo controlado para primer usuario admin.
- [ ] Confirmar que no existe registro publico.

### Slice 4 - Content Base

Estado: **Pendiente**

- [ ] Crear Content.
- [ ] Editar Content.
- [ ] Listar Content administrativo.
- [ ] Consultar Content administrativo.
- [ ] Manejar estados editoriales minimos.
- [ ] Clasificar por `ContentType`.
- [ ] Confirmar que crear Content no publica automaticamente.

### Slice 5 - Publication Base

Estado: **Pendiente**

- [ ] Crear Publication desde Content elegible.
- [ ] Separar Publication de Content.
- [ ] Manejar estado de Publication.
- [ ] Manejar `publicSlug`.
- [ ] Manejar fechas de publicacion, retiro y archivo.
- [ ] Confirmar que Publication no es booleano.

### Slice 6 - Consulta Publica Minima

Estado: **Pendiente**

- [ ] Listar publicaciones publicas.
- [ ] Consultar detalle publico por slug.
- [ ] Implementar busqueda basica.
- [ ] Evitar exposicion de borradores o datos administrativos.
- [ ] Preparar SEO basico.

### Slice 7 - Recursos Multimedia

Estado: **Pendiente**

- [ ] Crear MediaResource.
- [ ] Asociar MediaResource a Content.
- [ ] Asociar MediaResource a TimelineEvent cuando aplique.
- [ ] Implementar `StorageProvider`.
- [ ] Evitar acceso directo al filesystem desde modulos de negocio.

### Slice 8 - Clasificacion Basica

Estado: **Pendiente**

- [ ] Administrar ContentType.
- [ ] Administrar Category.
- [ ] Administrar Tag.
- [ ] Relacionar Content con categorias y etiquetas.
- [ ] Exponer clasificacion publica.

### Slice 9 - Campaign / Disease

Estado: **Pendiente**

- [ ] Administrar Campaign como entidad organizadora.
- [ ] Administrar Disease como entidad tematica.
- [ ] Relacionar Content con Campaign.
- [ ] Relacionar Content con Disease.
- [ ] Confirmar que Campaign y Disease no son Content ni categorias.

### Slice 10 - Timeline

Estado: **Pendiente**

- [ ] Administrar TimelineEvent.
- [ ] Asociar multimedia propia a TimelineEvent.
- [ ] Relacionar TimelineEvent con Content de forma opcional.
- [ ] Exponer linea del tiempo publica.
- [ ] Confirmar que Timeline no es agenda general.

### Slice 11 - Canales Asistidos

Estado: **Pendiente**

- [ ] Administrar CommunicationChannel.
- [ ] Asociar Publication con canales.
- [ ] Preparar texto o estado de distribucion.
- [ ] Registrar distribucion manual/asistida.
- [ ] Confirmar que los canales no son Source.

### Slice 12 - Trazabilidad Minima

Estado: **Pendiente**

- [ ] Registrar eventos relevantes de creacion.
- [ ] Registrar validacion.
- [ ] Registrar preparacion.
- [ ] Registrar publicacion.
- [ ] Registrar retiro y archivo.
- [ ] Permitir consulta administrativa.
- [ ] Evitar CRUD libre de trazabilidad.

### Slice 13 - End-to-End MVP

Estado: **Pendiente**

- [ ] Login administrativo.
- [ ] Crear Content.
- [ ] Asociar fuente, validacion y clasificacion minima.
- [ ] Publicar como Publication.
- [ ] Consultar desde portal publico.
- [ ] Asociar multimedia.
- [ ] Consultar trazabilidad minima.
- [ ] Validar seguridad basica.
- [ ] Sin IA funcional.
- [ ] Sin roles avanzados.
- [ ] Sin workflow multinivel.

---

## 5. Checklist de Seguridad

- [ ] TypeScript strict configurado.
- [ ] DTOs validados desde el inicio.
- [ ] Sanitizacion considerada para contenido enriquecido.
- [ ] Refresh token en cookie HttpOnly.
- [ ] Cookies `Secure` en produccion.
- [ ] Argon2 para contrasenas.
- [ ] Sin registro publico.
- [ ] Sin credenciales por defecto.
- [ ] CORS restringido por ambiente.
- [ ] Secretos fuera de Git.
- [ ] `.env.example` sin valores sensibles.
- [ ] Logs sin tokens, cookies ni contrasenas.

---

## 6. Checklist de Decisiones Pendientes

- [ ] Confirmar si se creara rama especifica para Implementation.
- [ ] Confirmar cuando se autoriza crear estructura tecnica real.
- [ ] Confirmar cuando se autoriza ejecutar Prisma.
- [ ] Confirmar estrategia local de PostgreSQL.
- [ ] Confirmar mecanismo de primer usuario administrador.
- [ ] Confirmar proveedor o estrategia inicial de despliegue.
- [ ] Confirmar almacenamiento multimedia inicial.
- [ ] Confirmar si `START_HERE.md` debe actualizarse o conservarse como historico.
- [ ] Confirmar si documentos con estado `Draft` deben cambiar a `Baseline`.

---

## 7. Acciones Bloqueadas Hasta Autorizacion

- [ ] Ejecutar `prisma validate`.
- [ ] Ejecutar `prisma format`.
- [ ] Ejecutar `prisma generate`.
- [ ] Ejecutar `prisma migrate dev`.
- [ ] Ejecutar `prisma db push`.
- [ ] Crear migraciones.
- [ ] Crear seeds.
- [ ] Crear usuario administrador inicial.
- [ ] Conectar backend a base de datos real.
- [ ] Desplegar staging.
- [ ] Desplegar produccion.
- [ ] Configurar proveedor remoto definitivo.
- [ ] Introducir IA, chatbot, embeddings o pgvector en el MVP funcional.

---

## 8. Ubicacion Actual

```text
Estas aqui:

Baseline documental completa
-> Implementation Start aprobado
-> Slice 0 autorizado
-> Preparacion tecnica del repositorio pendiente
-> Codigo de aplicacion pendiente
```

Siguiente movimiento recomendado:

```text
Ejecutar Slice 0 - Preparacion controlada.
```

Resultado esperado del siguiente movimiento:

```text
Repositorio monorepo preparado con estructura base, .env.example, workspace pnpm y schema Prisma ubicado para revision tecnica, sin migraciones ni conexion real.
```
