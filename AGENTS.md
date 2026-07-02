# AGENTS.md

## Proyecto

**Nombre:** Sistema de Gestión de Contenido para la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo.

## Propósito

Desarrollar una aplicación web moderna que funcione como un CMS especializado para el Sector Salud.

El sistema permitirá administrar información institucional, enfermedades, noticias, campañas, infografías, documentos, línea del tiempo histórica, publicación automática en redes sociales y un asistente inteligente basado en IA.

La aplicación debe diseñarse pensando en la escalabilidad, mantenibilidad y facilidad de extensión.

---

# Objetivos de Arquitectura

Todo el desarrollo debe seguir los siguientes principios:

* Clean Architecture
* SOLID
* DRY
* KISS
* Separation of Concerns
* Modular Monolith (preparado para evolucionar a microservicios si fuese necesario)
* Domain Driven Design (DDD Lite)

El código deberá priorizar legibilidad sobre complejidad.

No implementar soluciones "ingeniosas" cuando exista una solución estándar ampliamente aceptada.

---

# Stack Tecnológico

## Frontend

* React
* TypeScript
* Vite
* Material UI
* React Router
* TanStack Query
* React Hook Form
* Zod
* Axios
* Tiptap Editor

---

## Backend

* Node.js
* NestJS
* TypeScript
* Prisma ORM

---

## Base de Datos

PostgreSQL

Extensiones previstas:

* pgvector

---

## Autenticación

* JWT
* Refresh Tokens
* Cookies HttpOnly
* Argon2

---

## Almacenamiento

Inicialmente:

* Sistema de archivos local

Arquitectura preparada para:

* Amazon S3
* Azure Blob Storage
* Google Cloud Storage

Nunca acceder directamente al sistema de archivos desde los módulos.

Todo acceso deberá realizarse mediante un StorageProvider.

---

# Arquitectura del Proyecto

El sistema estará dividido en módulos independientes.

Cada módulo será autocontenido.

Cada módulo tendrá:

* Controller
* Service
* Repository
* DTOs
* Entities
* Validators
* Tests

Evitar dependencias cruzadas entre módulos.

Toda comunicación deberá realizarse mediante servicios públicos o interfaces.

---

# Módulos del Sistema

## Autenticación

Responsable de:

* Login
* Logout
* Refresh Token
* Cambio de contraseña
* Perfil

---

## Administración

Gestiona:

* Configuración general
* Parámetros
* Menús
* Banners
* Auditoría

---

## CMS

Debe permitir administrar:

* Noticias
* Enfermedades
* Campañas
* Programas
* Eventos
* Comunicados
* Avisos
* Infografías
* Documentos
* Preguntas frecuentes
* Información institucional

Todos los contenidos compartirán una estructura base reutilizable.

---

## Multimedia

Administración de:

* Imágenes
* Videos
* PDF
* Audio

Los archivos deberán poder reutilizarse en múltiples publicaciones.

Nunca duplicar archivos.

---

## Línea del Tiempo

Cada evento será una entidad administrable.

Debe soportar:

* fecha
* periodo
* descripción
* multimedia
* categorías
* relaciones

No implementar la línea del tiempo como contenido estático.

---

## Redes Sociales

Implementar mediante adaptadores.

Ejemplo:

SocialPublisher

* FacebookAdapter
* InstagramAdapter
* XAdapter
* TikTokAdapter
* YouTubeAdapter

Cada plataforma debe ser independiente.

---

## Chatbot

Arquitectura:

RAG (Retrieval Augmented Generation)

Flujo:

Usuario

↓

Búsqueda semántica

↓

Base de datos

↓

pgvector

↓

LLM

↓

Respuesta

Nunca entrenar un modelo propio.

Toda la información debe obtenerse del CMS.

---

# Convenciones

## TypeScript

Siempre usar:

strict=true

No utilizar "any" excepto cuando sea estrictamente necesario.

Preferir interfaces antes que clases cuando aplique.

---

## NestJS

Seguir la estructura oficial.

No colocar lógica de negocio en Controllers.

Toda lógica debe vivir en Services.

---

## React

Utilizar:

Componentes funcionales.

Hooks.

Custom Hooks.

No utilizar componentes de clase.

---

## Nombres

Archivos:

kebab-case

Componentes:

PascalCase

Variables:

camelCase

Constantes:

UPPER_SNAKE_CASE

Interfaces:

Prefijo I únicamente cuando exista conflicto de nombres.

---

# Base de Datos

Usar Prisma.

Todas las tablas deberán incluir:

* id
* createdAt
* updatedAt
* deletedAt
* createdBy
* updatedBy

Preferir Soft Delete.

---

# Seguridad

Todo endpoint debe validar:

* autenticación
* autorización
* validación de DTO
* sanitización

Nunca confiar en información enviada por el cliente.

---

# API

Convenciones REST.

Ejemplo:

GET /news

GET /news/:id

POST /news

PATCH /news/:id

DELETE /news/:id

No utilizar verbos en las rutas.

---

# Documentación

Toda API deberá documentarse mediante Swagger.

Toda funcionalidad importante deberá incluir comentarios únicamente cuando agreguen valor.

Evitar comentarios redundantes.

---

# Git

Commits siguiendo Conventional Commits.

Ejemplos:

feat:

fix:

refactor:

docs:

test:

perf:

chore:

---

# Testing

Prioridad:

* Unit Tests
* Integration Tests

Framework:

Vitest o Jest.

---

# Rendimiento

Optimizar:

* consultas SQL
* carga de imágenes
* caché
* paginación

Nunca devolver listas completas cuando puedan paginarse.

---

# Accesibilidad

Toda interfaz debe cumplir buenas prácticas WCAG.

Utilizar correctamente:

* aria-label
* contraste
* navegación mediante teclado

---

# Diseño

El diseño debe ser:

* limpio
* institucional
* moderno
* responsive

Evitar interfaces sobrecargadas.

---

# Restricciones

No agregar dependencias innecesarias.

No introducir nuevas librerías sin justificar su necesidad.

No duplicar lógica.

No escribir código muerto.

No generar archivos que no sean utilizados.

---

# Filosofía de Desarrollo

Antes de implementar una funcionalidad:

1. Comprender el dominio.
2. Diseñar la solución.
3. Definir interfaces.
4. Implementar.
5. Probar.
6. Documentar.

---

# Prioridad de Calidad

En caso de conflicto, seguir este orden:

1. Seguridad
2. Correctitud
3. Mantenibilidad
4. Escalabilidad
5. Rendimiento
6. Facilidad de desarrollo

---

# Objetivo Final

Construir un CMS especializado para el Sector Salud que pueda mantenerse durante muchos años, sea fácilmente ampliable y sirva como plataforma tecnológica para la Jurisdicción Sanitaria de Huejutla de Reyes.
