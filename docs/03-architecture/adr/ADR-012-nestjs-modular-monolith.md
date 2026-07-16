# ADR-012: NestJS Modular Monolith Structure

**Estado:** Aceptada.

## Contexto

La arquitectura conceptual (ADR-002, ADR-003) define un monolito modular con Clean
Architecture. Se necesita una estructura concreta para organizar el código en NestJS
que respete los límites entre módulos, evite dependencias cruzadas y sea fácil de
navegar y mantener.

## Decisión

Organizar el backend NestJS con la siguiente estructura por módulo:

```
src/
  <module>/
    <module>.module.ts       — @Module con imports, controllers, providers, exports
    <module>.controller.ts   — solo rutas, delegación a service
    <module>.service.ts      — lógica de negocio
    <module>.repository.ts   — acceso a datos (Prisma)
    dto/
      create-<entity>.dto.ts
      update-<entity>.dto.ts
      <entity>-response.dto.ts
    entities/
      <entity>.entity.ts     — interfaz/tipo de dominio
    validators/               — validaciones específicas (si aplica)
    <module>.spec.ts          — tests unitarios
```

Reglas:
- Los módulos **no se importan entre sí directamente**. La comunicación entre módulos
  se realiza mediante:
  - Servicios públicos exportados desde el módulo.
  - Interfaces/contratos definidos en el módulo exportador.
- El módulo `PrismaModule` es global y accesible desde todos los módulos.
- Los **controllers** no contienen lógica de negocio (solo delegan a services).
- Los **repositories** encapsulan consultas Prisma y filtros comunes (soft delete,
  paginación).
- Los **services** orquestan lógica de negocio y llaman a repositories.

## Justificación

- Consistente con la estructura oficial de NestJS, facilitando onboarding.
- La separación controller/service/repository aplica Separation of Concerns.
- Los módulos autocontenidos permiten evolucionar a microservicios extrayendo módulos
  completos.
- Las dependencias explícitas en `@Module({ imports: [...] })` hacen visible el
  grafo de dependencias.
- Los tests unitarios pueden mockear repositories sin instanciar Prisma.

## Consecuencias

- Cada módulo tiene 4+ archivos, lo que puede parecer verboso para funcionalidades
  simples.
- Se requiere disciplina para no importar servicios de otros módulos directamente
  sin pasar por la declaración de exports del módulo.
- Los DTOs compartidos entre módulos deben vivir en el módulo que los define y
  exportarse explícitamente.

## Riesgos

- Dependencias circulares entre módulos si no se respetan los límites.
- Proliferación de módulos pequeños sin agrupación lógica.

## Mitigación

- El equipo debe revisar el grafo de dependencias periódicamente.
- Módulos muy pequeños pueden agruparse (ej. Classification agrupa Category, Tag,
  ContentType).
- Las dependencias circulares se detectan en tiempo de compilación (NestJS las
  reporta como error).

## Alternativas descartadas

- Estructura plana (todos los controllers en un directorio, todos los services en otro):
  pierde modularidad y no escala.
- Microservicios desde el inicio: complejidad operativa prematura.
- Módulos por capa (controllers/, services/, repositories/ en lugar de por feature):
  dificulta encontrar código relacionado y viola encapsulamiento.
