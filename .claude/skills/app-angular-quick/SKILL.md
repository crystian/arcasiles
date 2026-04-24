---
name: app-angular-quick
description: "Referencia rapida de Angular moderno — convenciones especificas del framework: APIs deprecadas con sus reemplazos, componentes (OnPush, signals, standalone, input/output funciones), templates con control flow nativo, state management con signals, services (providedIn root, inject()), routing lazy, reactive forms y accesibilidad WCAG AA. Usar al escribir o revisar codigo Angular. Para reglas transversales (TypeScript, naming, types vs classes, dependencias) ver `/senior-developer`."
author: "Cristian 'pusher' Bietti"
linkedin: https://www.linkedin.com/in/crystian/
---

# Referencia Rapida Angular

Convenciones especificas de Angular moderno + TypeScript. Las reglas transversales
de senior (calidad de codigo, TypeScript estricto, naming, types vs classes,
complex types, constantes, dependencias) viven en `/senior-developer` — esta
skill solo documenta lo propio del framework.

## TypeScript en Angular — APIs Deprecadas

Estas APIs estan deprecadas o reemplazadas en Angular moderno. Verificar contra
los ultimos docs cuando haya duda.

| Deprecada | Reemplazo |
|---|---|
| `@Input` / `@Output` decoradores | `input()` / `output()` funciones |
| `*ngIf` / `*ngFor` / `*ngSwitch` | `@if` / `@for` / `@switch` |
| `ngClass` / `ngStyle` | bindings `[class.name]` / `[style.prop]` |
| `@HostBinding` / `@HostListener` | objeto `host` en el decorador |
| `EventEmitter` | `output()` |
| `Renderer2` | API DOM directa con sanitizacion |
| `NgModule` | componentes/services standalone |
| `HttpClientModule` | `provideHttpClient()` |
| `RouterModule` | `provideRouter()` |
| `toPromise()` | `firstValueFrom()` |
| `ngOnChanges` / `SimpleChanges` | inputs basados en signals + `effect()` / `computed()` |
| `provideAnimations()` / `provideAnimationsAsync()` | nuevas APIs de animacion segun version |

## Componentes y Estado

### Componentes

- Siempre standalone (default en Angular moderno) — NO setear `standalone: true`
- `changeDetection: ChangeDetectionStrategy.OnPush` siempre
- Funciones `input()` y `output()`, no decoradores — marcar `readonly`
- `protected` para miembros usados solo en el template
- Template inline si <15 lineas y sin archivo CSS; si no, separar `.html` + `.css`
- Usar el objeto `host` en vez de `@HostBinding`/`@HostListener`
- `NgOptimizedImage` para todas las imagenes estaticas (no para base64 inline)
- Importar pipes built-in cuando se usan en el template

### State management

- Signals para estado local del componente
- `computed()` para estado derivado — si lo podes derivar, no lo guardes
- `update()` o `set()` en signals — nunca `mutate()`
- Signals privadas: exponer con `asReadonly()`

### Templates

- Control flow nativo: `@if`, `@for`, `@switch` — no `*ngIf`, `*ngFor`, `*ngSwitch`
- `@for` siempre con `track` por id unico, no por index
- `[ngTemplateOutlet]` no `*ngTemplateOutlet`
- Pipe `async` para observables; preferir signals cuando se pueda
- Sin globales (`new Date()`), sin arrow functions en interpolaciones
- **Sin logica en templates** — manipulacion de strings, ternarios, valores computados → `computed()` en el componente
- **El binding string `[class]` reemplaza todas las clases estaticas** — usar `[class.name]="condition"` en su lugar

## Servicios y HTTP

### Services

- Responsabilidad unica
- `providedIn: 'root'` para singletons
- Funcion `inject()`, no inyeccion por constructor

### Interceptors

- Resolver services lazy con `Injector` para evitar dependencias circulares cuando el constructor del service usa `HttpClient`
- No adjuntar tokens a endpoints de auth (login/refresh)

## Routing

- Lazy loading para todas las rutas de pagina (`loadComponent` / `loadChildren`)
- Ruta wildcard (`**`) como ultima ruta
- Modulos CRUD: shell wrapper con rutas hijas; providers compartidos en el wrapper
- Componente de form unico para create y edit (mode desde el parametro `:id`)

## Forms

- Reactive Forms (`FormGroup` + `FormBuilder`) siempre — no template-driven
- Validators que coincidan con las restricciones del DTO de la API
- Mensajes de error inline debajo de cada campo (mostrar en touched + invalid)
- Area de alert inline para errores de la API
- `markAllAsTouched()` al hacer submit
- Solo enviar campos modificados a la API

## Convenciones de UI

### Accesibilidad

- Pasar los chequeos automatizados (AXE u equivalente)
- Cumplir WCAG AA minimo: foco visible, contrast ratio, ARIA donde el HTML semantico no alcanza
- Navegacion por teclado funcional en flows criticos
- Toda imagen con `alt` significativo o `alt=""` si es decorativa

### i18n

- Cero strings de UI hardcoded — usar la libreria de i18n del proyecto
- Claves planas con namespace (`nav.dashboard`, `users.title`, `common.save`)
- Agregar claves a TODOS los idiomas configurados; si solo agregas en uno, fallaste

### Estilos

- `::ng-deep` siempre scopeado con `:host`
- Colores dinamicos: bindings `[style.*]`
- Para tokens de color/spacing del tema, preferir variables CSS sobre valores hardcoded

## Tests

- Naming: `*.spec.ts`, uno por componente/service
- Cubrir logica de negocio en services (TestBed normal)
- Para componentes: testear logica como helpers puros si el setup del runner no resuelve templates externos
- Services, guards, interceptors, pipes: usar TestBed normalmente
