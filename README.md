# Sistema de Gestión de Contenido (CMS) - Jurisdicción Sanitaria de Huejutla de Reyes

Bienvenido al repositorio del Sistema de Gestión de Contenido para la Jurisdicción Sanitaria de Huejutla de Reyes, Hidalgo. Esta aplicación web moderna funciona como un CMS especializado para el Sector Salud, permitiendo administrar información institucional, enfermedades, noticias, campañas, infografías, documentos y mucho más.

## 🚀 Características Principales

*   **Administración de Contenido (CMS):** Gestión de noticias, enfermedades, campañas, programas, eventos, avisos e información institucional.
*   **Módulo Multimedia:** Administración centralizada de imágenes, videos, PDFs y audios, evitando la duplicación de archivos.
*   **Línea del Tiempo Histórica:** Gestión de eventos históricos administrables con fechas, descripciones y multimedia.
*   **Asistente Inteligente (Chatbot):** Basado en IA y RAG (Retrieval Augmented Generation), el chatbot responde preguntas obteniendo la información directamente de la base de datos del CMS.
*   **Publicación en Redes Sociales:** Integración mediante adaptadores para publicar en plataformas como Facebook, Instagram, X, TikTok y YouTube.
*   **Seguridad y Autenticación:** Sistema robusto con JWT, Refresh Tokens, Cookies HttpOnly y encriptación con Argon2.

## 🛠️ Stack Tecnológico

El proyecto está diseñado pensando en la escalabilidad, mantenibilidad y facilidad de extensión, siguiendo una arquitectura *Modular Monolith*.

### Frontend
*   **Framework:** React con TypeScript
*   **Build Tool:** Vite
*   **UI/Estilos:** Material UI
*   **Enrutamiento:** React Router
*   **Gestión de Estado/Datos:** TanStack Query
*   **Formularios:** React Hook Form + Zod
*   **Peticiones:** Axios
*   **Editor de Texto:** Tiptap Editor

### Backend
*   **Framework:** NestJS con TypeScript (Node.js)
*   **ORM:** Prisma

### Base de Datos & Almacenamiento
*   **Base de Datos:** PostgreSQL
*   **Búsqueda Vectorial:** Extensión `pgvector` (Para el chatbot IA)
*   **Almacenamiento:** Sistema de archivos local (Arquitectura preparada para Amazon S3, Azure Blob Storage o Google Cloud Storage).

## 🏗️ Arquitectura y Principios de Desarrollo

Todo el desarrollo sigue los siguientes principios de ingeniería de software:
*   **Clean Architecture**
*   **SOLID**
*   **DRY** (Don't Repeat Yourself)
*   **KISS** (Keep It Simple, Stupid)
*   **Separation of Concerns**
*   **Domain Driven Design (DDD Lite)**

La prioridad en el código es la legibilidad sobre la complejidad, y la calidad del código sigue el siguiente orden de importancia:
1. Seguridad
2. Correctitud
3. Mantenibilidad
4. Escalabilidad
5. Rendimiento
6. Facilidad de desarrollo

## 📦 Estructura de Módulos

El sistema está dividido en módulos independientes y autocontenidos, minimizando las dependencias cruzadas:
*   **Autenticación:** Login, logout, perfiles, etc.
*   **Administración:** Configuración, menús, banners, auditoría.
*   **CMS:** Core de la aplicación para gestionar todo tipo de publicaciones.
*   **Multimedia:** Gestión de archivos.
*   **Línea del Tiempo:** Eventos históricos.
*   **Redes Sociales:** Adaptadores de publicación.
*   **Chatbot:** Integración RAG con pgvector y LLM.

## 🤝 Convenciones de Desarrollo

*   **TypeScript:** `strict=true`. Uso restringido de `any`.
*   **Nomenclatura:**
    *   Archivos: `kebab-case`
    *   Componentes: `PascalCase`
    *   Variables: `camelCase`
    *   Constantes: `UPPER_SNAKE_CASE`
*   **Git:** Uso de *Conventional Commits* (`feat:`, `fix:`, `refactor:`, etc.).
*   **Testing:** Unitarios y de Integración con Vitest o Jest.
*   **API:** RESTFUL, documentado con Swagger.

---
*Este proyecto busca ser una plataforma tecnológica duradera y fácilmente ampliable para el Sector Salud de Hidalgo.*
