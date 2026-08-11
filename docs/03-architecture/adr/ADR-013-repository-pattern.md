# ADR-013: Repository Pattern for Persistence Access

**Estado:** Aceptada.

## Contexto

El código backend actual usa `PrismaService` directamente en los servicios de negocio (SourceService, ValidationService, ContentService, PublicationService, MediaService, etc.). Esto genera tres problemas:

1. **Acoplamiento a Prisma**: los servicios conocen detalles del ORM (filtros `where`, cláusulas `include`, operadores `contains`, `mode: 'insensitive'`, etc.), lo que dificulta cambiar de ORM o añadir una cache intermedia.
2. **Filtros de soft delete repetidos**: cada servicio debe recordar añadir `deletedAt: null` en cada consulta, lo que duplica lógica y puede olvidarse.
3. **`any` generalizado**: para sortear los tipos complejos de Prisma se usan `where: any`, `data: any` y `toResponse(x: any)` en todos los servicios, perdiendo seguridad de tipos.

El módulo `Users` ya implementa un patrón repositorio (interfaz `IUserRepository` + `PrismaUserRepository`) que resuelve estos problemas.

## Decisión

Todo módulo de backend que requiera persistencia **debe** definir:

1. Una **interfaz de repositorio** (puerto de aplicación) que declare las operaciones de persistencia necesarias para el módulo, usando tipos de dominio o tipos generados por Prisma, pero sin exponer `any` en su API pública.
2. Una **implementación concreta** (adaptador de infraestructura) que implemente esa interfaz usando `PrismaService`.

### Reglas

- Los servicios de negocio **inyectan la interfaz del repositorio**, no `PrismaService`.
- Los repositorios **encapsulan**:
  - Filtros de soft delete automáticos (`deletedAt: null`).
  - Construcción de consultas paginadas.
  - Mapeo entre modelo Prisma y tipos de dominio cuando sea necesario.
- Las interfaces se registran con un token string (ej. `'ISourceRepository'`) en el sistema de DI de NestJS.
- Los métodos del repositorio devuelven tipos explícitos de Prisma o tipos de dominio mapeados, nunca `any`.
- Los repositorios **no contienen reglas de negocio** — solo acceso a datos.

### Estructura por módulo

```
<module>/
  <module>.repository.interface.ts   — Puerto (interfaz)
  <module>.repository.ts             — Adaptador (implementación Prisma)
  <module>.service.ts                — Lógica de negocio (inyecta interfaz)
  <module>.module.ts                 — Registra repositorio y servicio
```

### Ejemplo

```typescript
// source.repository.interface.ts
export interface ISourceRepository {
  create(data: Prisma.SourceCreateInput): Promise<Source>;
  findMany(params: SourceFindManyParams): Promise<{ items: Source[]; total: number }>;
  findUnique(where: { id: string }): Promise<Source | null>;
  update(id: string, data: Prisma.SourceUpdateInput): Promise<Source>;
  softDelete(id: string): Promise<void>;
}
```

```typescript
// source.repository.ts
@Injectable()
export class PrismaSourceRepository implements ISourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: SourceFindManyParams) {
    const where = { deletedAt: null, ...params.where };
    const [items, total] = await Promise.all([
      this.prisma.source.findMany({ where, skip: params.skip, take: params.take, orderBy: params.orderBy }),
      this.prisma.source.count({ where }),
    ]);
    return { items, total };
  }
  // ...
}
```

## Justificación

- **Separation of Concerns**: los servicios se centran en lógica de negocio; los repositorios en acceso a datos.
- **Testabilidad**: los tests unitarios pueden mockear la interfaz sin instanciar Prisma.
- **Seguridad de tipos**: las interfaces eliminan `any` del perímetro entre servicio y persistencia.
- **Coherencia**: extiende el patrón ya probado en `UsersModule` al resto del backend.
- **Evolución**: si se necesita añadir cache, cambiar ORM o dividir en microservicios, solo cambia la implementación del repositorio.

## Consecuencias

- Cada módulo de persistencia añade 2 archivos (interfaz + implementación).
- Los tests unitarios existentes que mockean `PrismaService` directamente deben migrarse a mockear la interfaz del repositorio.
- Los tests de integración no se ven afectados porque `PrismaService` sigue siendo la implementación subyacente.

## Riesgos

- **Sobre-abstracción**: para módulos muy simples (ej. Taxonomy), un repositorio puede parecer excesivo.

### Mitigación

- Se permite acceso directo a `PrismaService` en módulos de solo lectura pública (PublicQuery) o utilidades sin lógica de negocio, siempre que esté justificado en un comentario o ADR.
- En caso de duda, aplicar el patrón repositorio.

## Alternativas descartadas

- Mantener `PrismaService` directo en todos los servicios: acopla negocio a ORM, fuerza uso de `any` y no escala.
- Usar Prisma Client generado directamente desde el servicio (sin repositorio): mismo problema.
- Patrón CQRS con separación lectura/escritura: complejidad prematura para el MVP.
- Unit of Work genérico: sobreingeniería para el alcance actual.

## Referencias

- ADR-008: Soft Delete Pattern — los repositorios son el lugar natural para centralizar el filtro `deletedAt: null`.
- ADR-012: NestJS Modular Monolith Structure — la estructura módulo+repositorio es coherente con el diseño modular.
- `apps/api/src/users/interfaces/user-repository.interface.ts` — ejemplo de implementación existente.
