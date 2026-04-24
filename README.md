# Arcasiles — Claude Code Showcase

Repo de acompañamiento de la charla **[Arcasiles](https://luma.com/arcasilesgroup)**. Es una muestra funcional de como
organizar agents, skills, hooks y workflows de Claude Code alrededor de un proyecto
real (un monorepo con API en NestJS + app en Angular sobre un dominio de clubes de
lectura, usado como ejemplo).

## Por que existe

Para que, despues de la charla, cualquiera pueda leer el codigo, copiar los patrones
y armar su propio setup. No es el toolkit privado completo — es un subset curado que
mantiene las ideas y deja la logica especifica afuera.

## Donde esta la magia

Todo lo interesante de Claude Code vive dentro de **`.claude/`**:

- `.claude/agents/` — definiciones de subagentes especializados (api/app, arquitectos).
- `.claude/skills/` — skills invocables (`/create-idea`, `/create-plan`, `/create-prototype`,
  guias rapidas de stack, etc.).
- `.claude/idea/`, `.claude/plan/`, `.claude/proto/` — artefactos producidos por los skills
  en ejemplos reales.
- `.claude/settings.local.json` — permisos y config local.

El `CLAUDE.md` en la raiz define las preferencias globales del proyecto.

## Como probarlo

Abri una instancia del agente de Claude Code dentro de esta carpeta y listo — el
harness carga automaticamente los agents, skills y preferencias de `.claude/` y
`CLAUDE.md`.

## Como levantar la app

El repo tiene un monorepo con dos proyectos: `api/` (NestJS) y `app/` (Angular). Se
corren en dos terminales distintas.

**Requisitos:** Node 20+ y npm.

> **⚠️ IMPORTANTE:** la API todavia **no esta empezada**. Lo que hay en `api/` es el
> scaffold inicial de NestJS sin endpoints de negocio implementados. Levantarla hoy
> solo sirve para validar que el stack corre — no hay dominio de clubes de lectura
> todavia. Esta ahi como punto de partida para los ejemplos de agents y skills.

### API (NestJS)

```bash
cd api
npm install
npm run start:dev   # http://localhost:3000, con watch mode
```

Otros scripts utiles: `npm run build`, `npm test`, `npm run lint`.

### App (Angular)

```bash
cd app
npm install
npm start           # http://localhost:4200
```

Otros scripts utiles: `npm run build`, `npm test`.

## Como adaptarlo

1. Copia la estructura de `.claude/` a tu propio repo.
2. Ajusta `CLAUDE.md` con las preferencias, convenciones y reglas de tu proyecto.
3. Quedate con los skills/agents que te sirvan, eliminado o reescribiendo el resto.
4. Los artefactos en `.claude/idea/`, `.claude/plan/`, `.claude/proto/` son demo — borralos
   y generas los tuyos con los skills correspondientes.
