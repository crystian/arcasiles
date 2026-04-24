# Plan: encuestas-amigos

> Fecha: 2026-04-23
> Idea: `.claude/idea/encuestas-amigos.md`
> Prototipo: `.claude/proto/encuestas-amigos.md`

## Contexto

Mini-app de encuestas anonimas para decisiones entre amigos. Creador arma una encuesta con titulo + exactamente 3 preguntas (opcion unica, 2 a 5 alternativas cada una) y obtiene un link generico para compartir. Los invitados votan una vez desde el mismo navegador y solo despues ven los resultados agregados (barras horizontales + %).

Este plan parte de una idea validada y un prototipo funcional en Angular (con mocks en `localStorage`). Ahora hay que sustituir toda la persistencia por una API NestJS real y refactorizar el codigo del prototipo (rudimentario) a una arquitectura de produccion.

## Scope

**API + App (full)**

- **API**: NestJS + TypeORM + PostgreSQL. No existe `api/` todavia — este plan disena el scaffold inicial y el primer feature completo.
- **App**: Angular 21 standalone. La app actual es un boilerplate + la carpeta `app/src/app/proto/` que se elimina por completo. Se respeta la arquitectura de rutas, flujos y decisiones de UX establecidas en el proto.

## Design Checklist

| # | Check | Decision |
|---|-------|----------|
| 1 | **Reuse analysis** | API: primer feature — no hay nada que extender. App: `LoadingCard`/`ErrorCard`/`EmptyState` se disenan genericos para reutilizarse entre pages. `FingerprintService` en `core/` del api, reusable para futuros features (rate limit, reportes). |
| 2 | **Duplication risk** | API: `VoteTally` duplica info reconstruible desde `Vote.answers`. Justificado por performance del hot path `GET /results` (denormalizacion intencional). App: patron "load → loading/error/not-found/ok" unificado via `Resource<T>` en `PollStore`, evita 4 implementaciones distintas. |
| 3 | **Placement** | API: `src/modules/polls/` (feature) + `src/core/` (database, config, crypto/fingerprint). App: `app/src/app/features/polls/` auto-contenido + `app/src/app/core/http/` para infra transversal. |
| 4 | **Impact on existing code** | API: cero (proyecto nuevo). App: `app/src/app/proto/` se elimina entero; `app.ts`, `app.routes.ts`, `app.config.ts`, `styles.scss` se modifican. Sin impacto fuera del feature y el shell. |
| 5 | **Shared types** | DTOs de contrato entre api y app se duplican en `poll.model.ts` del front. NO se introduce paquete `@arcasiles/contracts` en este plan (repo showcase — costo no justificado). Follow-up: si el proyecto crece, generar types desde OpenAPI. |
| 6 | **Pattern consistency** | API: patron NestJS canonico (controller fino, services con SRP, entities TypeORM, DTOs class-validator, `ValidationPipe` global). App: signals + `inject()` + standalone + OnPush, Reactive Forms para Create, `HttpErrorInterceptor` centralizado, sin `.subscribe()` manual en componentes. |

## Software Design

### Data model (API)

**`Poll`**
- `id` `varchar(8)` PK — shortid base36 (6 chars default, extiende a 7/8 si colisiona 5+ veces). Generado en service, no autoincrement, no uuid.
- `title` `varchar(200) NOT NULL`
- `createdAt` `timestamptz NOT NULL DEFAULT now()`
- Relacion `questions: Question[]` (one-to-many, cascade insert, eager false)
- Indices: PK sobre `id`; `INDEX idx_poll_created_at (createdAt DESC)` para futuros listados.

**`Question`**
- `id` `uuid` PK
- `pollId` `varchar(8) NOT NULL REFERENCES poll(id) ON DELETE CASCADE`
- `position` `smallint NOT NULL CHECK (position BETWEEN 0 AND 2)`
- `text` `varchar(500) NOT NULL`
- `UNIQUE (pollId, position)` + `INDEX idx_question_poll (pollId)`
- Relacion `options: Option[]` (one-to-many, cascade insert)

**`Option`**
- `id` `uuid` PK
- `questionId` `uuid NOT NULL REFERENCES question(id) ON DELETE CASCADE`
- `position` `smallint NOT NULL CHECK (position BETWEEN 0 AND 4)`
- `text` `varchar(200) NOT NULL`
- `UNIQUE (questionId, position)` + `INDEX idx_option_question (questionId)`

**`Vote`**
- `id` `uuid` PK
- `pollId` `varchar(8) NOT NULL REFERENCES poll(id) ON DELETE CASCADE`
- `fingerprint` `varchar(64) NOT NULL` — `sha256(ip + '|' + ua + '|' + pollId + '|' + SALT)` hex
- `answers` `jsonb NOT NULL` — `[{ questionId, optionId }, ...]` (exactamente 3)
- `createdAt` `timestamptz NOT NULL DEFAULT now()`
- `UNIQUE (pollId, fingerprint)` — bloqueo anti-doble-voto a nivel DB

**`VoteTally`**
- `optionId` `uuid` PK `REFERENCES option(id) ON DELETE CASCADE`
- `pollId` `varchar(8) NOT NULL REFERENCES poll(id) ON DELETE CASCADE`
- `questionId` `uuid NOT NULL REFERENCES question(id) ON DELETE CASCADE`
- `count` `integer NOT NULL DEFAULT 0 CHECK (count >= 0)`
- Filas creadas al crear el poll (una por `Option` con `count=0`). Incrementadas en la misma transaccion que cada `Vote`.
- Indices: `INDEX idx_tally_poll (pollId)`, `INDEX idx_tally_question (questionId)`

### Endpoints

Todos publicos (sin auth, sin guards). Base path `/polls`.

| Metodo | Path | Input | Output | Status codes |
|--------|------|-------|--------|--------------|
| POST | `/polls` | `CreatePollDto` | `PollCreatedDto` | 201, 400, 500 |
| GET  | `/polls/:id` | — | `PollViewDto` (sin tallies) | 200, 404 |
| POST | `/polls/:id/vote` | `SubmitVoteDto` | `VoteAcceptedDto` | 201, 400, 404, 409 (duplicado), 422 |
| GET  | `/polls/:id/results` | — | `PollResultsDto` | 200, 404 |

**`CreatePollDto`**
```ts
{
  title: string                          // @IsString @Length(3, 200) @Trim
  questions: [                            // @ArrayMinSize(3) @ArrayMaxSize(3)
    {
      text: string                        // @IsString @Length(2, 500)
      options: string[]                   // @ArrayMinSize(2) @ArrayMaxSize(5), each @Length(1, 200)
    }
  ]
}
```
Validator custom `@NoDuplicateOptions` por pregunta (case-insensitive + trim).

**`PollCreatedDto` / `PollViewDto`**
```ts
{
  id: string
  title: string
  createdAt: string              // ISO
  questions: [{
    id: string, position: number, text: string,
    options: [{ id: string, position: number, text: string }]
  }]
}
```

**`SubmitVoteDto`**
```ts
{
  answers: [                             // @ArrayMinSize(3) @ArrayMaxSize(3)
    { questionId: string, optionId: string }   // @IsUUID
  ]
}
```

**`VoteAcceptedDto`**
```ts
{ accepted: true, votedAt: string }
```

**`PollResultsDto`**
```ts
{
  id: string, title: string,
  totalVoters: number,
  questions: [{
    id: string, position: number, text: string, totalVotes: number,
    options: [{ id: string, position: number, text: string, count: number }]
  }]
}
```

### Module placement

**API (`api/`, nuevo)**

```
api/
├── src/
│   ├── main.ts                                    bootstrap, ValidationPipe global, trust proxy (req.ip)
│   ├── app.module.ts                              root module
│   ├── core/
│   │   ├── database/database.module.ts            TypeOrmModule.forRootAsync con ConfigService
│   │   ├── config/config.module.ts                @nestjs/config global
│   │   └── crypto/fingerprint.service.ts          sha256(ip + ua + pollId + salt); inyectable
│   └── modules/polls/
│       ├── polls.module.ts
│       ├── polls.controller.ts                    todos los endpoints
│       ├── polls.service.ts                       create (retry shortid) + getById
│       ├── votes.service.ts                       vote (transaccion + increment tally)
│       ├── results.service.ts                     query agregado
│       ├── entities/{poll,question,option,vote,vote-tally}.entity.ts
│       ├── dto/{create-poll,submit-vote,poll-view,poll-created,poll-results,vote-accepted}.dto.ts
│       ├── utils/shortid.ts                       generador base36
│       └── validators/no-duplicate-options.validator.ts
├── test/polls.e2e-spec.ts
├── package.json, tsconfig.json, nest-cli.json
└── .env.example                                    DATABASE_URL, VOTE_FINGERPRINT_SALT
```

Tres services separados (`polls`/`votes`/`results`) para respetar SRP — cada uno tiene distinto perfil transaccional y dominio de validacion.

**App (`app/`, modificada)**

```
app/src/app/
├── core/http/
│   ├── api-base.token.ts                          [NEW] InjectionToken<string> API_BASE_URL
│   └── http-error.interceptor.ts                  [NEW] mapea 404/409/422 → excepciones tipadas
├── features/polls/                                [NEW]
│   ├── polls.routes.ts                            sub-routes del feature
│   ├── data/
│   │   ├── poll.model.ts                          Poll, Question, Option, PollResults, CreatePollInput, VoteSelections, VoteResult
│   │   ├── poll-api.service.ts                    HttpClient thin wrapper
│   │   ├── poll-store.ts                          signal store: Resource<T> por id + my-polls ids
│   │   └── local-flags.service.ts                 wrapper localStorage (polls_mine, polls_voted_<id>, polls_creator_unlocked)
│   ├── guards/
│   │   ├── creator-key.guard.ts                   window.prompt + flag local
│   │   └── already-voted.guard.ts                 redirect a /results si hasVoted(id)
│   ├── pages/
│   │   ├── home-page/                             lista "mis encuestas"
│   │   ├── create-poll-page/                      form Reactive
│   │   ├── share-page/                            confirmacion + copy link
│   │   ├── vote-page/                             votar
│   │   └── results-page/                          barras horizontales
│   ├── components/
│   │   ├── poll-card/, question-editor/, option-button/, result-bars/
│   │   ├── copy-link-button/, progress-bar/
│   │   └── empty-state/, loading-card/, error-card/
│   └── utils/poll-validators.ts                   Reactive form validators (min/max, unique CI)
├── app.ts                                          [MODIFIED] quitar seed bootstrap
├── app.html                                        [MODIFIED] mantener shell (sin cambios logicos)
├── app.scss                                        [MODIFIED] sin cambios
├── app.routes.ts                                   [MODIFIED] delega al feature via loadChildren
├── app.config.ts                                   [MODIFIED] provideHttpClient(withInterceptors([...]))
└── proto/                                          [REMOVED] carpeta completa
app/src/styles/
├── _tokens.scss                                    [NEW] :root { --bg, --accent, --text, ... }
├── _base.scss                                      [NEW] reset + tipografia global
└── _utilities.scss                                 [NEW] .btn, .card, .label, .stack, .row
app/src/styles.scss                                 [MODIFIED] @use los 3 parciales
```

### Permissions

N/A — **todos los endpoints son publicos**. No hay guards, roles ni auth. La proteccion "clave para crear" vive solo en el frontend (`window.prompt` + `polls_creator_unlocked` en localStorage), replicando el comportamiento del proto.

| Endpoint | Acceso |
|---|---|
| `POST /polls` | Publico |
| `GET /polls/:id` | Publico |
| `POST /polls/:id/vote` | Publico |
| `GET /polls/:id/results` | Publico |

### Events / Audit

**Sin event bus.** La tabla `Vote` funciona como audit log natural (timestamp + fingerprint + payload completo). Se agrega logging estructurado con nivel `info` en:

- `poll.created` — `{ pollId, questionsCount, optionsTotal }`
- `vote.submitted` — `{ pollId, hashPrefix: fingerprint.slice(0,8) }` (solo prefix para debugging, nunca el full)

## Decisions

Decisiones clave que deben respetarse durante la implementacion. Las que vinieron de la fase de idea/proto no se repiten aqui.

1. **Sin auth server-side para crear encuestas.** La clave de creador (`amigos` en el proto) vive solo en el frontend. `POST /polls` es publico. Trade-off aceptado: cualquiera con acceso a la API puede crear. Mitigar en el futuro con rate-limit global si es necesario.
2. **Anti-doble-voto por fingerprint IP+UA con pepper server-side.** Hash `sha256(ip + ua + pollId + SALT)`, `SALT` desde env var. `UNIQUE (pollId, fingerprint)` enforced a nivel DB. Contradice la decision inicial de la idea ("cookie"), pero mejora robustez manteniendo anonimato.
3. **Shortid legible 6-8 chars base36.** Generado en service, retry en insert ante colision (5 intentos antes de extender a 7 chars). Link compartible corto (`/s/a3f9k2`) es prioritario sobre formalidad UUID.
4. **Resultados accesibles sin haber votado** (decision server). El gating "solo ver despues de votar" queda del lado de la UI. El backend no filtra por fingerprint en `GET /results`. Razon: simplifica caching, testing y futuros consumidores (ej. admin dashboard).
5. **`GET /polls/:id` NUNCA devuelve tallies.** Endpoint idempotente y cacheable para la vista de votar. Los resultados van en `/results` separado.
6. **No `GET /vote-status` endpoint.** El cliente usa `polls_voted_<id>` en localStorage + fallback 409 del server si se intenta votar de nuevo. Evita endpoint extra.
7. **409 duplicado → redirect a `/s/:id/results`.** El app-layer intercepta el 409, setea `polls_voted_<id>` y navega con `replaceUrl: true` (sin modal explicativo).
8. **Denormalizacion `VoteTally` intencional.** Se acepta el costo de mantenerla consistente (update en la misma transaccion que `Vote`) a cambio de `GET /results` O(1).
9. **Reactive Forms con `FormArray` anidado para Create.** Cambio sobre el proto (signals + ngModel). Razon: estructura dinamica (3 × N opciones) + validaciones cruzadas (no duplicados CI).
10. **CSS vars como design tokens, sin generacion tipada.** Paleta Matrix en `_tokens.scss`. Promover a tokens tipados solo si aparece multi-tema.
11. **`proto/` se elimina entero.** No se rescata codigo del prototipo — solo sirvio para validar UX/layout. El codigo nuevo vive en `features/polls/`.
12. **Encuestas inmutables a nivel codigo.** No se implementan `PATCH` ni `DELETE`. `ON DELETE CASCADE` queda definido en schema por si se agrega admin delete en el futuro.

## Migration

**No hay archivos de migracion en este plan.**

El schema se crea en el primer bootstrap del api (TypeORM sync en dev / migracion auto-generada antes del primer deploy de staging). Los cambios posteriores al primer release si generaran migrations explicitas, pero este feature es el ground zero del proyecto y no tiene delta respecto a un schema previo.

## Stories

### 1. `api-foundation` (api)

**Depende de**: nada.

**Scope**: bootstrap del proyecto NestJS y la infra compartida. Al terminar la story, el api arranca, conecta a Postgres y responde 404 a `GET /polls/:id` (porque todavia no hay entities ni tabla, pero el endpoint esta declarado).

**Archivos nuevos**: `api/` completo (ver module placement), salvo entities, DTOs y logica de endpoints (eso va en stories 2 y 3).

**Contenido**:
- `package.json` con NestJS 11, TypeORM 0.3+, `pg`, `class-validator`, `class-transformer`, `@nestjs/config`, `pino` (logger), `@nestjs/throttler` (scaffolding, uso real follow-up).
- `main.ts`: `NestFactory.create()`, `app.enableCors()`, `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))`, `app.set('trust proxy', 1)` para `req.ip` correcto detras de proxy.
- `core/config/config.module.ts`: `@Global()`, `ConfigModule.forRoot({ validate })` con validacion de `DATABASE_URL` y `VOTE_FINGERPRINT_SALT`.
- `core/database/database.module.ts`: `TypeOrmModule.forRootAsync`, `autoLoadEntities: true`, `synchronize: false` en prod.
- `core/crypto/fingerprint.service.ts`: clase stub que toma `ip`, `ua`, `pollId` y retorna hash. Placeholder para story 3.
- `modules/polls/polls.module.ts`, `polls.controller.ts` (controller vacio con `@Controller('polls')` y los 4 paths declarando los metodos devolviendo 501 por ahora), `polls.service.ts` stub.
- `.env.example` documentando las vars.
- `test/polls.e2e-spec.ts` minimo: chequea que el api arranca.

**Criterios de aceptacion**:
- `pnpm --filter api start:dev` levanta sin errores.
- El api responde `GET /polls/abc123` con 404 (o 501 segun la implementacion stub) sin crashear.
- El endpoint invalido responde con shape estandar de ValidationPipe.
- Tests e2e: `GET /polls/non-existent` responde 404.
- Logs en formato JSON via pino.

### 2. `api-polls-create-and-get` (api)

**Depende de**: #1.

**Scope**: entities `Poll`, `Question`, `Option` + DTOs + endpoints `POST /polls` y `GET /polls/:id`.

**Archivos nuevos**:
- `modules/polls/entities/poll.entity.ts`, `question.entity.ts`, `option.entity.ts`
- `modules/polls/dto/create-poll.dto.ts`, `poll-created.dto.ts`, `poll-view.dto.ts`
- `modules/polls/utils/shortid.ts` (base36, 6 chars default, accept length param)
- `modules/polls/validators/no-duplicate-options.validator.ts`
- Implementacion en `polls.service.ts` de `create(input)` con retry de shortid y `getById(id)` (devuelve Poll con relaciones, lanza `NotFoundException` si no existe).

**Archivos modificados**:
- `polls.controller.ts`: implementa `@Post()` y `@Get(':id')` delegando al service; 501 stubs se reemplazan.

**Criterios de aceptacion**:
- `POST /polls` con body valido → 201, devuelve poll con ids generados, header `Location: /polls/:id`.
- `POST /polls` con menos de 3 preguntas, mas de 3 preguntas, pregunta con menos de 2 / mas de 5 opciones, u opciones duplicadas CI → 400 con mensaje descriptivo.
- `GET /polls/:id` con id valido → 200 con `PollViewDto` (sin tallies).
- `GET /polls/:id` con id inexistente → 404.
- Tests e2e: crear → leer → verificar shape completo.
- El shortid generado tiene 6 chars base36; colisiones forzadas en test verifican retry.

### 3. `api-votes-and-results` (api)

**Depende de**: #2.

**Scope**: entities `Vote`, `VoteTally` + `FingerprintService` (real) + endpoints `POST /polls/:id/vote` y `GET /polls/:id/results`.

**Archivos nuevos**:
- `modules/polls/entities/vote.entity.ts`, `vote-tally.entity.ts`
- `modules/polls/dto/submit-vote.dto.ts`, `vote-accepted.dto.ts`, `poll-results.dto.ts`
- `modules/polls/votes.service.ts` — vote logic con transaccion (`DataSource.transaction`): insert `Vote` + `UPDATE vote_tally SET count = count + 1 WHERE option_id IN (...)`.
- `modules/polls/results.service.ts` — query con join a `VoteTally` + count de `Vote` por `pollId`.

**Archivos modificados**:
- `polls.service.ts`: en `create()` agrega creacion de `VoteTally` rows (una por `Option`, count=0) en la misma transaccion.
- `polls.controller.ts`: implementa `@Post(':id/vote')` y `@Get(':id/results')`.
- `core/crypto/fingerprint.service.ts`: implementacion real del hash.

**Criterios de aceptacion**:
- `POST /polls/:id/vote` con body valido (3 answers, questionIds del poll, optionIds de cada question) → 201, devuelve `{ accepted: true, votedAt }`.
- Segundo `POST /polls/:id/vote` desde misma IP+UA → 409 con mensaje `Vote already submitted`.
- `POST /polls/:id/vote` con menos/mas de 3 answers, questionId ajeno al poll, optionId ajeno a la question → 422 con detalle.
- `GET /polls/:id/results` sin votos → devuelve estructura con todos los counts en 0 y `totalVoters: 0`.
- `GET /polls/:id/results` con votos → counts reflejan fielmente los submits (verificado via test e2e que vota con 10 IPs diferentes).
- Tests e2e: flow completo create → vote (multiple) → results → vote duplicado.
- Fingerprint nunca se expone por API (ningun DTO lo incluye).

### 4. `app-foundation` (app)

**Depende de**: #2 (API `POST /polls` + `GET /polls/:id` funcionando).

**Scope**: preparar el terreno. Eliminar el prototipo, refactorizar styles, armar el shell de produccion, data layer, guards y core HTTP.

**Archivos nuevos**:
- `app/src/app/core/http/api-base.token.ts`, `http-error.interceptor.ts`
- `app/src/app/features/polls/polls.routes.ts`
- `app/src/app/features/polls/data/poll.model.ts`, `poll-api.service.ts`, `poll-store.ts`, `local-flags.service.ts`
- `app/src/app/features/polls/guards/creator-key.guard.ts`, `already-voted.guard.ts`
- `app/src/app/features/polls/utils/poll-validators.ts` (stub — se completa en #5)
- `app/src/styles/_tokens.scss`, `_base.scss`, `_utilities.scss`

**Archivos modificados**:
- `app/src/app/app.ts` — quitar `OnInit`, `inject(PollService)` y el `ngOnInit` del seed.
- `app/src/app/app.routes.ts` — delega al feature: `loadChildren: () => import('./features/polls/polls.routes').then(m => m.POLLS_ROUTES)`.
- `app/src/app/app.config.ts` — agrega `provideHttpClient(withInterceptors([httpErrorInterceptor]))` + `provide: API_BASE_URL, useValue: environment.apiBase`.
- `app/src/styles.scss` — queda de 3 lineas (`@use 'styles/tokens'`, `@use 'styles/base'`, `@use 'styles/utilities'`).

**Archivos eliminados**:
- `app/src/app/proto/` completo.

**Criterios de aceptacion**:
- `cd app && npm run start` compila sin errores.
- El app arranca en `http://localhost:4200/` y muestra el shell. Cualquier ruta `/s/:id` muestra por ahora un error o loading (las pages se implementan en #5).
- Ningun import del viejo `proto/*` existe en el codebase (verificado con `grep -r 'proto/' app/src`).
- El `HttpErrorInterceptor` mapea respuestas 404/409/422 a excepciones tipadas (`PollNotFoundError`, `AlreadyVotedError`, `ValidationError`).
- `creatorKeyGuard` dispara `window.prompt` (equivalente al proto) y persiste el flag en localStorage.
- La paleta Matrix se preserva byte a byte respecto del proto (usar los mismos valores en `_tokens.scss`).

### 5. `app-pages-and-components` (app)

**Depende de**: #4.

**Scope**: implementar las 5 smart pages y los 9 dumb components, incluyendo Reactive Forms del Create, clipboard, y todos los estados (loading/error/not-found/empty).

**Archivos nuevos**:
- `features/polls/pages/home-page/` `(ts, html, scss)`
- `features/polls/pages/create-poll-page/` `(ts, html, scss)`
- `features/polls/pages/share-page/` `(ts, html, scss)`
- `features/polls/pages/vote-page/` `(ts, html, scss)`
- `features/polls/pages/results-page/` `(ts, html, scss)`
- `features/polls/components/poll-card/`, `question-editor/`, `option-button/`, `result-bars/`, `copy-link-button/`, `progress-bar/`, `empty-state/`, `loading-card/`, `error-card/`
- Validators completos en `features/polls/utils/poll-validators.ts`: `minLengthArray(n)`, `maxLengthArray(n)`, `uniqueOptionsCI()`.

**Archivos modificados**:
- `polls.routes.ts`: completa los `loadComponent` de cada page.

**Criterios de aceptacion**:
- **Home**: lista "mis encuestas" leyendo `polls_mine` de localStorage, hidrata con `poll-store`. Empty state si no hay. CTA `+ Crear encuesta` dispara el guard.
- **Create**: form reactivo con 3 preguntas fijas, 2-5 opciones dinamicas por pregunta, boton `+ Agregar opcion` oculto en el maximo, `x` remover oculto en el minimo. Validaciones visibles inline al `submitAttempted`. Al submit valido → `POST /polls` → `router.navigate(['/s', id, 'share'])`.
- **Share**: fetch del poll, muestra titulo + link + boton copiar (cambio a "Copiado!" 1.6s). Fallback `window.prompt` si clipboard falla.
- **Vote**: fetch del poll. Si `localFlags.hasVoted(id)` → `alreadyVotedGuard` ya redirigio. CTA sticky deshabilitado hasta responder las 3. Al submit → `POST /vote` → navega a results. Si vuelve 409 → setea voted flag + redirect a results con `replaceUrl`.
- **Results**: fetch de `/results`. Empty state (0 votos) con CTA a share. Barras horizontales con `%` redondeado entero + cantidad. Opcion lider destacada (gradient/glow segun theme Matrix).
- **Accesibilidad**: focus-visible con outline verde, radios de voto con `role="radiogroup"` + `aria-checked`, inputs con `<label for>`.
- **Errores**: 404 poll inexistente → `ErrorCard` con link al home. Network failure → `ErrorCard` con "Reintentar".
- Ningun `.subscribe()` manual en componentes (todo via store + `firstValueFrom` adentro).
- Todos los components en `OnPush`.
- Flujo end-to-end verificado manualmente con el api corriendo: crear → compartir → votar en incognito → ver resultados con el voto reflejado.

## Estimation

| | Optimista | Probable | Pesimista |
|---|---|---|---|
| **Tiempo total** | ~3h | ~6h | ~12h |
| **Tokens totales** | ~235k | ~470k | ~870k |

Desglose por story:

| Story | Optimista | Probable | Pesimista | Tokens (prob.) |
|---|---|---|---|---|
| 1. `api-foundation` | 20m | 40m | 80m | ~50k |
| 2. `api-polls-create-and-get` | 30m | 60m | 120m | ~80k |
| 3. `api-votes-and-results` | 40m | 75m | 150m | ~100k |
| 4. `app-foundation` | 30m | 60m | 120m | ~80k |
| 5. `app-pages-and-components` | 60m | 120m | 240m | ~160k |

## Gaps

_(sin gaps bloqueantes — todos los puntos criticos fueron resueltos con decisiones del usuario o del architect)_

**Follow-ups no-bloqueantes** (pueden tratarse despues del primer release):

- **Rate limiting** (`@nestjs/throttler`) sobre `POST /polls` y `POST /polls/:id/vote` para mitigar abuso.
- **Shared contracts package** (ej. `libs/contracts` o paquete `@arcasiles/contracts`) si el repo crece y aparece divergencia de tipos api/app.
- **Generacion de clientes desde OpenAPI** una vez que la API este estable.
- **Replace IP+UA fingerprint por cookie firmada (HMAC)** si el producto escala y aparece review de privacidad — elimina dependencia de IP.
