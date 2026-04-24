# Plantilla del documento de plan

Plantilla markdown completa para el documento de plan (`.claude/plan/<name>.md`).
Idioma: prosa en espanol, ingles para codigo / identificadores / nombres de entities.

```markdown
# Plan: [Nombre del feature]

> Fecha: YYYY-MM-DD | Idea: .claude/idea/<name>.md | Proto: .claude/proto/<name>.md

## Contexto
[Por que existe este feature, que problema resuelve. Tomado de idea/proto.]

## Scope
- **Project**: [api | app | both]

## Design Checklist

| # | Check | Decision |
|---|-------|----------|
| 1 | **Reuse analysis** | [extend X / create new / N/A] |
| 2 | **Duplication risk** | [no risk / risk in X — mitigation] |
| 3 | **Placement** | [new module in X / extend Y] |
| 4 | **Impact on existing code** | [none / modify X — justification] |
| 5 | **Shared types** | [yes: X / no] |
| 6 | **Pattern consistency** | [follows X pattern / deviates — reason] |

## Software Design

### Data model
[Entities con atributos, tipos, relaciones, constraints.
Incluir entities existentes SOLO si necesitan modificaciones.]

- **[Entity]**: [atributos clave con tipos]. Relations: [relaciones].

### Endpoints
[Method, path, guard, DTOs. Solo para scope api.]

- `POST /v1/resource` — Create. Guard: JwtAuthGuard. Body: CreateResourceDto { field: type }. Response: ResourceResponseDto.
- `GET /v1/resource` — List (paginated). Guard: JwtAuthGuard + TenantGuard. Query: PaginationQueryDto + filtros.

### Module placement
[Donde vive cada pieza. Que es nuevo vs modificado.]

- `[path]`: [new | modified] — [que y por que]

### Permissions
[Modelo completo de permisos.]

**Catalogo de permisos:**
- `{ code: 'module.action', module: 'module', description: '...' }`

**Endpoint mapping:**
| Endpoint | Permission |
|----------|-----------|
| `GET /v1/resource` | `resource.view` |

**Frontend gating:**
| Element | Permission | Location |
|---------|-----------|----------|
| Boton create | permission `resource.create` | component.html |

**Route guard:** `canActivate: [permissionGuard], data: { permission: 'resource.view' }`
**Nav item:** `{ ..., permission: 'resource.view' }`

### Events / Audit
[Nombres de eventos, formas de payload, entradas de auditoria. Si no aplica: "No events needed."]

## Decisiones
[Decisiones clave tomadas durante el planning. El implementador DEBE respetarlas.]

- [Decision]: [que se decidio y por que]

## Migration
[Si aplica. Incluir cambios de tablas/columnas. Si no: "No migration needed."]

## Stories

| # | Historia | Scope | Depende de |
|---|----------|-------|------------|
| 1 | [name]   | api   | —          |
| 2 | [name]   | both  | #1         |

### Story 1: [name]

**Scope**: api
**Data model**: [scoped del diseno global]
**Endpoints**: [scoped]
**Permissions**: [scoped]

**Acceptance criteria:**
- [ ] [Condicion concreta y testeable]
- [ ] [Otra condicion]

### Story 2: [name]
[Repetir estructura]

## Estimation

| | Optimista | Probable | Pesimista |
|---|---|---|---|
| Tiempo | Xm | Xm | Xm |
| Tokens | ~Xk | ~Xk | ~Xk |

## Gaps
[Si quedan gaps sin resolver, listarlos aca. Los gaps bloquean la implementacion.]

| # | Gap | Impact | Blocks |
|---|-----|--------|--------|
| 1 | [descripcion] | [que no se puede construir] | [que story] |

**Regla:** Un plan con gaps sin resolver NO DEBE implementarse. Resolver todos los gaps primero.
```
