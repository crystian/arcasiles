# Prototype: encuestas-amigos

> Fecha: 2026-04-23 | Idea: `.claude/idea/encuestas-amigos.md`

## Pantallas generadas

- **home**: landing con hero + lista local de "Mis encuestas" creadas desde este navegador. CTA principal: "Crear encuesta". (NUEVA, ruta `/`)
- **create-poll**: formulario con titulo + 3 preguntas fijas, cada una con 2-5 opciones (add/remove). Validacion antes de submit. (NUEVA, ruta `/new`)
- **share**: confirmacion post-creacion. Muestra el link generico, boton copiar al clipboard, accesos rapidos a votar/resultados/home. (NUEVA, ruta `/s/:id/share`)
- **vote**: muestra las 3 preguntas con opciones tipo radio. Un submit al final con CTA sticky. Si el navegador ya voto, redirige a resultados. (NUEVA, ruta `/s/:id`)
- **results**: por cada pregunta, barras horizontales con % y cantidad. Destaca la opcion lider en verde. Total de votos en el header. (NUEVA, ruta `/s/:id/results`)

## Archivos creados

- `app/src/app/proto/poll.service.ts` — mock store con localStorage, seed, creator-key unlock
- `app/src/app/proto/home-page/home-page.{ts,html,scss}`
- `app/src/app/proto/create-poll-page/create-poll-page.{ts,html,scss}`
- `app/src/app/proto/share-page/share-page.{ts,html,scss}`
- `app/src/app/proto/vote-page/vote-page.{ts,html,scss}`
- `app/src/app/proto/results-page/results-page.{ts,html,scss}`

## Archivos existentes modificados

- `app/src/styles.scss` — paleta y utilidades globales (boilerplate tenia solo el comentario default). Buscar `//TODO PROTO:encuestas-amigos`.
- `app/src/app/app.html` — shell con header + router-outlet + footer (reemplaza el placeholder Angular).
- `app/src/app/app.scss` — estilos del shell.
- `app/src/app/app.ts` — agrega `ngOnInit()` que llama `polls.ensureSeed()` e importa `RouterLink`.
- `app/src/app/app.routes.ts` — define las 5 rutas + `creatorKeyGuard` sobre `/new`.

## Tareas de implementacion

Checklist derivado de los markers `//TODO PROTO:encuestas-amigos`. Cada item mapea a un cambio real que tiene que ocurrir al implementar en produccion.

- [ ] `app/src/styles.scss:1` — revisar paleta / variables CSS, portarlas al sistema de tokens real o mantenerlas segun decision de design system.
- [ ] `app/src/app/app.html:2` — reemplazar shell del prototipo por el shell real (layout definitivo, nav completa, i18n, a11y).
- [ ] `app/src/app/app.scss:1` — idem estilos del shell.
- [ ] `app/src/app/app.ts:1` y `app/src/app/app.ts:13` — remover bootstrap del seed mock.
- [ ] `app/src/app/app.routes.ts:1` — mover las rutas al modulo feature real, cambiar loadComponent por carga canonica del feature, reemplazar `creatorKeyGuard` por guard real.
- [ ] `app/src/app/proto/poll.service.ts:1-2` — reemplazar todo el service por el PollService real con HTTP contra el backend.
- [ ] `app/src/app/proto/poll.service.ts:38` — reemplazar `CREATOR_KEY` hardcodeada por gate de auth real (server-side).
- [ ] `app/src/app/proto/poll.service.ts:42` — signal `revision` existe solo para forzar rerender sobre localStorage: no es necesaria con HTTP + cache del cliente real.
- [ ] `app/src/app/proto/poll.service.ts:61` — `tryUnlockCreator()` usa `window.prompt()`. Decidir si la version real mantiene prompt nativo o migra a UI in-app (login/passcode modal) — la idea no lo especifica.
- [ ] `app/src/app/proto/home-page/home-page.ts:1` — migrar componente al feature real, consumir PollService real.
- [ ] `app/src/app/proto/home-page/home-page.ts:22` — ajustar el gating de "Crear encuesta" al mecanismo de auth real.
- [ ] `app/src/app/proto/home-page/home-page.html:1` — idem.
- [ ] `app/src/app/proto/home-page/home-page.scss:1` — portar estilos (o dejarlos, segun design system).
- [ ] `app/src/app/proto/create-poll-page/create-poll-page.{ts,html,scss}:1` — migrar al feature real.
- [ ] `app/src/app/proto/share-page/share-page.{ts,html,scss}:1` — idem.
- [ ] `app/src/app/proto/vote-page/vote-page.{ts,html,scss}:1` — idem. El anti-doble-voto pasa a depender de cookie/server (hoy `proto_voted_<id>` en localStorage).
- [ ] `app/src/app/proto/results-page/results-page.{ts,html,scss}:1` — idem. Resultados reales vienen agregados del backend.

## Codigo de referencia

### app.html (shell)
```html
<div class="shell">
  <header class="shell-header">
    <a routerLink="/" class="brand">
      <span class="brand-mark">~</span>
      <span class="brand-text">amigoll</span>
    </a>
    <nav class="shell-nav">
      <a routerLink="/" class="nav-link">Mis encuestas</a>
    </nav>
  </header>
  <main class="shell-main"><router-outlet /></main>
  <footer class="shell-footer"><span class="faint">...</span></footer>
</div>
```

### home-page.html
```html
<section class="home stack">
  <div class="hero">
    <h1>Decidir con amigos, sin drama.</h1>
    <p>...</p>
    <button class="btn btn-primary btn-lg" (click)="goCreate()">+ Crear encuesta</button>
  </div>

  <div class="mine">
    <div class="row">
      <h2>Mis encuestas</h2>
      <span class="spacer"></span>
      <span class="faint">{{ mine().length }} en este navegador</span>
    </div>

    @if (mine().length === 0) {
      <div class="card empty">...empty state + boton crear...</div>
    } @else {
      @for (p of mine(); track p.id) {
        <article class="card poll-card">
          <div class="poll-card-head"><h3>{{ p.title }}</h3><span>{{ formatDate }}</span></div>
          <div class="poll-card-meta"><pill votos /><mono>{{ shareUrl }}</mono></div>
          <div class="poll-card-actions">
            <a routerLink=".../results">Ver resultados</a>
            <a routerLink=".../share">Compartir</a>
          </div>
        </article>
      }
    }
  </div>
</section>
```

### create-poll-page.html
```html
<section class="create stack">
  <header><a class="back">&larr; volver</a><h1>Nueva encuesta</h1><p>...</p></header>

  <div class="card">
    <label>Titulo</label>
    <input [ngModel]="title()" (ngModelChange)="setTitle($event)" />
  </div>

  @for (q of questions(); track trackByIdx($index); let qIdx = $index) {
    <div class="card question">
      <div class="q-head"><span class="q-badge">{{ qIdx+1 }}</span><input placeholder="Pregunta N" /></div>
      <div class="options">
        @for (opt of q.options; track ...) {
          <div class="option-row">
            <span class="bullet"></span>
            <input placeholder="Opcion N" />
            <button class="btn-danger-ghost remove">×</button>  <!-- solo si options.length > MIN -->
          </div>
        }
      </div>
      <div class="q-foot">
        <button class="btn btn-ghost btn-sm">+ Agregar opcion</button>  <!-- solo si options.length < MAX -->
      </div>
    </div>
  }

  <div class="actions">
    <button class="btn btn-primary btn-lg" [disabled]="!isValid()">Crear y compartir</button>
  </div>
</section>
```

### share-page.html
```html
<section class="share stack">
  <div class="success-head">
    <div class="check">✓</div>
    <h1>Encuesta lista</h1><p>...</p>
  </div>

  <div class="card">
    <span class="label">Tu encuesta</span>
    <h2>{{ p.title }}</h2>
    <span class="faint">{{ p.questions.length }} preguntas · sin expiracion</span>
  </div>

  <div class="card link-card">
    <span class="label">Link para compartir</span>
    <div class="link-row">
      <code class="link">{{ url() }}</code>
      <button class="btn btn-primary">{{ copied() ? 'Copiado!' : 'Copiar' }}</button>
    </div>
    <span class="faint">Pegalo en WhatsApp, Telegram, Discord o donde sea.</span>
  </div>

  <div class="actions">
    <a routerLink=".../vote">Probar el link (votar)</a>
    <a routerLink=".../results">Ver resultados</a>
    <a routerLink="/">Ir a mis encuestas</a>
  </div>
</section>
```

### vote-page.html
```html
<section class="vote stack">
  <header>
    <span class="label">Encuesta</span>
    <h1>{{ p.title }}</h1>
    <p>Elegi una opcion por pregunta...</p>
    <div class="progress"><div class="progress-bar" [width]="answered/total %"></div></div>
    <span class="faint">{{ answered }} de {{ total }} respondidas</span>
  </header>

  @for (q of p.questions; track q.id) {
    <div class="card question">
      <div class="q-head"><span class="q-badge">N</span><h2>{{ q.text }}</h2></div>
      <div class="options">
        @for (opt of q.options; track opt.id) {
          <button class="option" [class.picked]="isPicked(q.id, opt.id)" (click)="pick(q.id, opt.id)">
            <span class="radio" [class.on]="isPicked"></span>
            <span class="opt-text">{{ opt.text }}</span>
          </button>
        }
      </div>
    </div>
  }

  <div class="sticky-cta">
    <button class="btn btn-primary btn-lg" [disabled]="!canSubmit()">
      {{ canSubmit() ? 'Enviar mi voto' : 'Responde las N preguntas' }}
    </button>
  </div>
</section>
```

### results-page.html
```html
<section class="results stack">
  <header>
    <span class="label">Resultados</span>
    <h1>{{ p.title }}</h1>
    <div class="meta">
      <span class="pill"><strong>{{ totalVoters }}</strong> votos</span>
      @if (hasVoted) { <span class="faint">Ya votaste desde este navegador</span> }
    </div>
  </header>

  @if (totalVoters === 0) {
    <div class="card empty">...empty state + boton compartir...</div>
  } @else {
    @for (r of results(); track r.id; let qIdx = $index) {
      <div class="card question">
        <div class="q-head">
          <span class="q-badge">{{ qIdx+1 }}</span>
          <h2>{{ r.text }}</h2>
          <span class="spacer"></span>
          <span class="faint">{{ r.total }} votos</span>
        </div>
        <ul class="bars">
          @for (b of r.bars; track b.optionId) {
            <li class="bar-row" [class.leader]="b.isLeader">
              <div class="bar-label">
                <span>{{ b.text }}</span>
                <span><strong>{{ b.percent }}%</strong> · {{ b.count }}</span>
              </div>
              <div class="bar-track"><div class="bar-fill" [width]="b.percent %"></div></div>
            </li>
          }
        </ul>
      </div>
    }
  }

  <div class="actions">
    <a routerLink=".../share">Compartir el link</a>
    <a routerLink="/">Inicio</a>
  </div>
</section>
```

## Especificaciones para implementar

### Navegacion
- App SPA de 1 sola seccion (no hay multi-modulo). Header con marca + link a "Mis encuestas".
- Rutas definitivas prototipadas:
  - `/` — Home / Mis encuestas
  - `/new` — Crear (gate: clave de creador)
  - `/s/:id/share` — Confirmacion / Compartir
  - `/s/:id` — Votar (si ya voto, redirige a `/s/:id/results`)
  - `/s/:id/results` — Resultados
- Link generico para compartir: `<origin>/s/:id` (va derecho al votante).

### Pantallas y layout

**Home**
- Hero card con gradient soft (accent violeta → transparent) arriba, con titulo + descripcion + CTA primario "+ Crear encuesta".
- Debajo: titulo "Mis encuestas" + contador a la derecha.
- Lista de `poll-card`: titulo + fecha formateada, pill con votos, mono con la URL, acciones "Ver resultados" y "Compartir".
- Empty state cuando no hay encuestas locales: card centrada con texto + CTA ghost "Crear la primera".

**Create poll**
- Link "← volver" + `h1` "Nueva encuesta" + descripcion breve.
- Card para titulo (input grande).
- 3 cards numeradas (badge 1,2,3) — una por pregunta. Cada una: input de pregunta (transparent, se vuelve elevated al focus) + lista de opciones (radio bullet + input + boton × si `> MIN`) + boton "+ Agregar opcion" (hasta `MAX`).
- Al final: boton primario grande "Crear y compartir" + mensaje de error inline si `submitAttempted && !isValid`.
- Validaciones: titulo >= 3 chars, cada pregunta >= 2 chars, cada una con al menos 2 opciones no vacias y sin duplicados case-insensitive.

**Share (confirmacion)**
- Hero centrado: check verde (círculo con ✓), `h1` "Encuesta lista", descripcion.
- Card 1: resumen ("Tu encuesta", titulo, "3 preguntas · sin expiracion").
- Card 2 destacada (gradient sutil): "Link para compartir" + `<code>` con la URL + boton "Copiar" (cambia a "Copiado!" 1.6s). Fallback: `window.prompt` con la URL si `clipboard.writeText` falla.
- Acciones ghost: "Probar el link (votar)", "Ver resultados", "Ir a mis encuestas".

**Vote**
- Header: "Encuesta" label + titulo + descripcion + barra de progreso (respondidas / total) + label `N de N respondidas`.
- 3 cards (una por pregunta, numeradas). Cada una: head con badge + texto, y lista de opciones tipo boton nativo con radio pintado + texto (hover = border-strong, picked = accent-soft + border accent).
- CTA `position: sticky; bottom: 1rem`. Disabled hasta que las 3 esten respondidas. Texto cambia ("Responde las 3 preguntas" → "Enviar mi voto").
- Guard onInit: si `hasVoted(pollId)`, redirige a resultados con `replaceUrl`.

**Results**
- Header: "Resultados" label + titulo + pill grande con total de votos + aviso "Ya votaste desde este navegador" si aplica.
- Empty state (0 votos): card centrada + boton "Ver link para compartir".
- 3 cards (una por pregunta): head con badge + texto + total a la derecha. Lista `ul` con barras:
  - label row: texto opcion a la izq, "%, cantidad" a la der.
  - track (12px) + fill con gradient accent. Si es lider y > 0 → gradient verde (`--success`) y `<strong>` en verde.

### Datos y mocks

**Entidades (estructura final esperada)**

```ts
Poll {
  id: string
  title: string
  questions: [
    {
      id: string
      text: string
      options: [ { id: string, text: string } ]   // 2..5
    }
  ]  // exactamente 3
  createdAt: number
  // derivados del backend en la version real:
  tally: Record<questionId, Record<optionId, count>>
  totalVoters: number
}
```

**Keys localStorage (prefijo `proto_`)**
- `proto_seed_version` — controla re-seed si bumpeas `SEED_VERSION`.
- `proto_polls` — map `{ [id]: Poll }`.
- `proto_my_polls` — `string[]` de ids creados en este navegador.
- `proto_voted_<pollId>` — `true` si ya voto.
- `proto_creator_key_ok` — `true` una vez que acepto la clave.

**Seed inicial**
- `demo1` "Sabado a la noche" — fresca (0 votos). Cubre estado "empty results".
- `demo2` "Viaje de findee largo" — 12 votos distribuidos. Cubre estado "resultados con lider claro" en la primera pregunta y mas ajustado en la segunda.

**Lo que viene del backend real**
- Endpoints esperables: `POST /polls`, `GET /polls/:id`, `GET /polls/:id/results`, `POST /polls/:id/vote`.
- Autorizacion para `POST /polls` (lo que hoy es la clave de creador).
- Voto anonimo — el backend decide como blindar el anti-doble-voto (cookie firmada + IP + fingerprint liviano; alcanza para amigos).

### Interacciones

- **Home → Crear**: click "+ Crear encuesta" dispara `polls.tryUnlockCreator()`. Si nunca ingresaron la clave: `window.prompt(...)`. Si acierta, setea `proto_creator_key_ok` y navega. Si no, `window.alert('Clave incorrecta.')` y se queda.
- **Crear → Share**: submit valida, crea el Poll local, navega a `/s/:id/share`.
- **Share**: copia la url al clipboard (con fallback `window.prompt`). Boton muestra "Copiado!" 1.6s.
- **Compartir link → Votar**: cualquiera que abra `/s/:id` (sin haber votado) ve el form de votar. Si ya voto, redirect silencioso a `/s/:id/results`.
- **Votar → Resultados**: al hacer submit, `polls.vote()` incrementa tally, marca `proto_voted_<id>` y navega a `/s/:id/results`.

### Decisiones de UI

- **Tema Matrix** (fondo negro + verde fosforescente `#00ff41`, tipografia monospace con glow sutil) — decision del usuario durante el prototipo. Paleta centralizada en CSS vars de `styles.scss`; textos `h1/h2/h3` uppercase con `text-shadow` verde; labels con prefix `// `; hero con `> ` como prompt; botones primarios en fondo solido verde sobre texto negro. No se usa UI library.
- **Botones nativos estilados** para todo (incluye las opciones de voto). Evita depender de un framework UI en prototipo.
- **Forms con signals + ngModel unidireccional** (`[ngModel]="..."` + `(ngModelChange)="..."`). Evita el bug de `[(ngModel)]` sobre signals.
- **Barras horizontales con gradient**, lider destacado en verde. Percentage rounded a entero (sin decimales).
- **CTA sticky en Vote** para no hacer scroll al final en mobile.
- **Prompt nativo para la clave** — decision explicita: UX mas simple, cero UI que mantener para gate de bajo valor.
- **Shell minimo** (header + main + footer) — no hace falta sidebar en una app de 5 pantallas.

## Cambios sobre la idea

- **Clave de creador (nueva capa)**: la idea original decia "cualquiera crea sin registrarse". El usuario agrego durante el prototipo una clave compartida que habilita la creacion. Razon: evitar que cualquier desconocido que descubra la URL pueda crear encuestas. Implementado como `window.prompt()` + flag persistido en localStorage (no pide la clave de nuevo en el mismo navegador). Clave actual en prototipo: `amigos`.
- **Estilo visual Matrix**: la idea no especificaba tema. El usuario pidio look Matrix (verde fosforescente sobre negro, tipografia monospace). Queda como direccion de diseno a validar con el resto del equipo antes de producto final — si se confirma, portar los tokens a un design system formal.

## Feedback y cambios pedidos

- _(ninguno abierto por ahora — todos los pedidos iniciales del usuario fueron mergeados a las specs de arriba)_
