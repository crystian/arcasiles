# Prototipo: book-clubs

> Fecha: 2026-04-23
> Idea base: `.claude/idea/clubes-de-lectura.md`

## Resumen

Prototipo corrible de "Paginas", una app social para hacer amigos en Madrid usando clubes
de lectura como pretexto. Se modifico la app Angular recien generada con `ng new` (ver
`app/`) para incorporar las tres pantallas MVP: **Explorar**, **Detalle de club** y
**Mi perfil**. Shell con topbar minimo, estilos tipo "Bumble BFF literario" (tipografia
serif Fraunces + Inter, paleta terracota/beige/verde salvia).

Todo el estado vive en `localStorage` con prefijo `proto_`, con seed versionado. Al primer
load hay 8 clubes sembrados (mezcla presencial Madrid + online).

## Pantallas prototipadas

1. **Explorar** (`/explore`) — lista de clubes con filtro por modalidad (Todos / Presencial /
   Online) y busqueda libre por nombre/autor/genero. Empty state incluido.
2. **Detalle del club** (`/club/:id`) — header con modalidad y vibe, descripcion, generos,
   libro actual, proxima reunion, conteo de miembros, avatares placeholder, boton
   "Me sumo" / "Dejar club".
3. **Mi perfil** (`/profile`) — nombre, libros favoritos (chips editables con add/remove),
   generos preferidos (multi-select). Persistencia en localStorage + flash de guardado.

## Cambios en la app real

### Archivos creados

- `app/src/app/app.routes.ts` (reemplazo del vacio) — rutas lazy con `loadComponent`.
- `app/src/app/app.config.ts` (modificado) — `withComponentInputBinding()` para inputs de ruta.
- `app/src/app/app.ts`, `app.html`, `app.scss` — shell minimo con topbar + router-outlet.
- `app/src/index.html` — `lang="es"`, titulo, Google Fonts (Fraunces + Inter).
- `app/src/styles.scss` — tokens de diseno globales (colores, radios, sombras, btn, chip, card).
- `app/src/app/shared/topbar/` — componente topbar con brand "Paginas" y tabs.
- `app/src/app/shared/services/book-clubs-store.ts` — store con signals, seed versionado.
- `app/src/app/features/explore/` — pantalla Explore.
- `app/src/app/features/club-detail/` — pantalla detalle.
- `app/src/app/features/profile/` — pantalla perfil.

### Datos mock

- `localStorage.proto_seed_version` — version del seed actual (`v1`).
- `localStorage.proto_book_clubs` — 8 clubes seed.
- `localStorage.proto_profile` — perfil del usuario actual.
- `localStorage.proto_memberships` — ids de clubes donde el usuario se sumo.

Al bumpear `SEED_VERSION` en `book-clubs-store.ts` se resiembra todo.

## Codigo de referencia

### `app.html`
```html
@if (showChrome()) {
  <app-topbar />
}
<main class="app-main">
  <router-outlet />
</main>
```

### `explore.html` (resumido)
```html
<section class="hero">...</section>
<section class="controls">
  <div class="search"><input [ngModel]="query()" (ngModelChange)="query.set($event)" /></div>
  <div class="filters">
    <button [class.is-active]="filter() === 'all'" (click)="setFilter('all')">Todos</button>
    <button [class.is-active]="filter() === 'presencial'" ...>Presencial</button>
    <button [class.is-active]="filter() === 'online'" ...>Online</button>
  </div>
</section>
<ul class="club-list">
  @for (club of clubs(); track club.id) {
    <li class="club-card card" [routerLink]="['/club', club.id]"> ... </li>
  }
</ul>
```

### `club-detail.html` (resumido)
```html
@if (club(); as c) {
  <header class="detail-header card">
    <span class="chip" [class.chip-primary]="c.modality === 'presencial'">...</span>
    <h1>{{ c.name }}</h1>
    <p class="description">{{ c.description }}</p>
    <button class="btn btn-primary" (click)="toggleMembership()">
      {{ isMember() ? 'Dejar club' : 'Me sumo' }}
    </button>
  </header>
  <section class="meta"> <!-- libro actual + proxima reunion --> </section>
  <section class="members card"> <!-- avatares placeholder --> </section>
}
```

### `profile.html` (resumido)
```html
<form class="profile-form card" (submit)="$event.preventDefault(); save()">
  <div class="field"> <input [ngModel]="name()" (ngModelChange)="onNameChange($event)" /> </div>
  <div class="field">
    <div class="book-input">
      <input [ngModel]="newBookDraft()" (keydown.enter)="addBook()" />
      <button (click)="addBook()">Anadir</button>
    </div>
    <ul class="book-chips"> @for (book of favoriteBooks(); ...) { ... } </ul>
  </div>
  <div class="field">
    <div class="genre-grid"> @for (g of availableGenres; ...) { <button [class.is-active]="hasGenre(g)">...</button> } </div>
  </div>
  <button type="submit" class="btn btn-primary">Guardar perfil</button>
</form>
```

## Especificaciones para implementar

### Navegacion
- Topbar sticky con brand + tabs (Explorar, Mi perfil).
- Rutas lazy: `/explore`, `/club/:id`, `/profile`. Default `/explore`, 404 redirect a `/explore`.

### Modelo de datos

**Club**
- id, name, modality ('presencial' | 'online'), city, venue, description, currentBook (title, author),
  nextMeeting (ISO date), memberCount, genres[], vibe.

**Profile**
- name, favoriteBooks[] (strings libres), genres[] (referencia a lista controlada).

**Membership**
- Relacion simple: profileId <-> clubId.

### Interacciones clave
- Explore: filtro client-side por modalidad + busqueda full-text local. La API real deberia
  soportar queryparams equivalentes.
- Club detail: toggle membership es optimistic. Considerar estados de loading/error en real.
- Profile: save es manual (no autosave). Flash de "Guardado ✓" al confirmar.

### Decisiones de UI (iteracion 2 — neo-editorial pop)
- **Tipografia dual**: `Instrument Serif` (italic, display) para titulos gigantes + `Space Grotesk`
  para UI y body + `JetBrains Mono` para eyebrows/indices. Juego de serifa italic contra grotesk.
- **Paleta pop sobre off-white**: bg `#f6f4ef`, tinta `#0b0b0b`, acentos **coral** `#ff3b5c`,
  **lima** `#d7ff3b` y **violeta** `#5b3dff` — aplicados como color blocks, no detalles.
- **Borders fuertes 1.5px + hard shadow** (neo-brutalist soft): cards con borde negro y sombra
  solida desplazada `6px 6px 0 ink`. En hover: translate+rotate sutil.
- **Textura de grano**: overlay `radial-gradient` en body con mix-blend multiply para dar papel.
- **Grid editorial**: 12 columnas en Explore, primera card tamaño doble (is-big). Numeracion
  `01 / 08` en cada card, eyebrow mono en cada seccion.
- **Rotaciones y ribbons**: ribbon "sos miembro" rotado 18° en esquina, tapa del libro en
  detalle rotada -2° con hover a 0°, empty-mark `?` rotado -8°.
- **Chips stickers**: con borde negro y fondo de color sólido segun contexto (coral =
  presencial, violet = online, lime = confirm/add, ink = negativo).
- **Hero con fondo bloque** en Club Detail (coral o violet segun modalidad) + circulo lima
  asomando en esquina inferior derecha como gesto editorial.

### Gaps (de la idea original que siguen abiertos)
- Mecanismos de confianza para bajar miedo a "no me cae nadie" (trial, reviews, chat previo).
  El proto NO implementa ninguno; sumar en iteracion 2.
- Flujo de crear club — fuera de scope MVP.
- Privacidad del perfil — hoy todo es privado (local), hay que decidir que se muestra a otros.
- Moderacion / reportes — no discutido.

## Tareas de implementacion

Marcadores `//TODO PROTO:book-clubs` encontrados en el codigo:

| Archivo | Linea | Que reemplazar |
|---|---|---|
| `app/src/app/app.ts` | 1 | Root shell completo |
| `app/src/app/app.scss` | 1 | Shell layout styles |
| `app/src/app/app.config.ts` | 9 | Revisar `withComponentInputBinding()` |
| `app/src/app/app.routes.ts` | 1 | Rutas (llevar a feature modules reales) |
| `app/src/index.html` | 9 | Imports de Google Fonts |
| `app/src/styles.scss` | 1 | Tokens globales — reemplazar con sistema de design real |
| `app/src/app/shared/topbar/topbar.ts` | 1 | Componente topbar completo |
| `app/src/app/shared/topbar/topbar.html` | 1 | Topbar markup |
| `app/src/app/shared/topbar/topbar.scss` | 1 | Topbar styles |
| `app/src/app/shared/services/book-clubs-store.ts` | 1 | Service completo — reemplazar con HTTP service |
| `app/src/app/shared/services/book-clubs-store.ts` | 174 | Bootstrap con localStorage seed |
| `app/src/app/features/explore/explore.ts` | 1 | Pagina Explore |
| `app/src/app/features/explore/explore.html` | 1 | Markup Explore |
| `app/src/app/features/explore/explore.scss` | 1 | Styles Explore |
| `app/src/app/features/club-detail/club-detail.ts` | 1 | Pagina Club Detail |
| `app/src/app/features/club-detail/club-detail.ts` | 32 | `toggleMembership` -> API call real |
| `app/src/app/features/club-detail/club-detail.html` | 1 | Markup Club Detail |
| `app/src/app/features/club-detail/club-detail.html` | 58 | Lista de miembros placeholder |
| `app/src/app/features/club-detail/club-detail.scss` | 1 | Styles Club Detail |
| `app/src/app/features/profile/profile.ts` | 1 | Pagina Profile |
| `app/src/app/features/profile/profile.ts` | 53 | `save()` -> API call real |
| `app/src/app/features/profile/profile.html` | 1 | Markup Profile |
| `app/src/app/features/profile/profile.scss` | 1 | Styles Profile |

Antes de mergear a prod: `grep -r "TODO PROTO" app/src/` debe volver vacio.

## Feedback y cambios pedidos

### 2026-04-23 — Rediseno "mas moderno, joven, vivo"
- **Pedido**: pasar de terracota/beige tradicional a algo joven y vivo.
- **Direccion aplicada**: neo-editorial pop (ver "Decisiones de UI" actualizadas).
- **Archivos tocados**: `styles.scss`, `index.html`, `app.scss`, `topbar.html/scss`,
  `explore.html/scss`, `club-detail.html/scss`, `profile.html/scss`.
- **Sin cambios en logica**: las pantallas y el store siguen iguales. Solo copy, markup de
  presentacion y estilos. Todos los `//TODO PROTO:book-clubs` se conservaron.
