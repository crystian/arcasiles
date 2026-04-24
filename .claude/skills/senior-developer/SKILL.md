---
name: senior-developer
description: "Mentalidad y convenciones base de un developer senior — calidad de codigo, TypeScript estricto, naming consistente, tipos vs clases, manejo de complejidad y dependencias reproducibles. Reglas transversales que aplican tanto a backend como a frontend, agnosticas de framework. Usar como referencia base antes (o junto con) cualquier skill especifica de stack como `/api-nestjs-quick` o `/app-angular-quick`."
author: "Cristian 'pusher' Bietti"
linkedin: https://www.linkedin.com/in/crystian/
---

# Senior Developer

Convenciones transversales de senior developer que aplican a cualquier proyecto
TypeScript moderno (backend o frontend). Las skills especificas de stack
(`/api-nestjs-quick`, `/app-angular-quick`, etc.) asumen estas reglas y solo
documentan lo que es propio del framework.

## Mentalidad

- **Sin parches.** Codigo de calidad productiva, encontrar las causas raiz. Nunca
  encadenar edits especulativos esperando que algo ande.
- **Codigo legible > codigo clever.** Nombres explicitos, funciones cortas, early
  returns. Otra persona (o vos en seis meses) tiene que entenderlo a la primera.
- **Reusabilidad sobre duplicacion.** Greppear antes de implementar. Si la
  funcionalidad podria existir, buscar primero.

## Calidad de Codigo

- **Complejidad ciclomatica maxima**: 8. Extraer helpers, separar responsabilidades.
- Seguir el `.editorconfig` y la config de ESLint del proyecto — no pelearse con el linter.
- **Nada de TODOs que se "resuelven despues"** — hacelo ahora o decilo explicitamente
  en el reporte.

## TypeScript

- Modo strict completo, validar params/vars sin uso (prefijo `_` para args sin uso).
- **Evitar `any`** — usar `unknown` cuando el tipo es incierto y restringir con type guards.
- Preferir inferencia de tipo cuando el tipo es obvio.
- Orden de imports: deps externas primero, despues imports del proyecto.
- **Conversion a string**: `String(value)` — nunca `value + ''`.
- **Comparaciones de enum**: usar el enum directamente — nunca constantes numericas
  locales o numeros magicos.

## Naming

| Elemento | Convencion | Ejemplo |
|---|---|---|
| Interfaces | prefijo `I` | `ICoreOptions`, `IApiResponse` |
| Types | prefijo `T` | `TUserProfile`, `TBackupResult` |
| Archivos | kebab-case minuscula | `admin-user.service.ts`, `user-profile.ts` |
| Clases | PascalCase | `AdminUserService`, `UserProfile` |
| Variables/Funciones | camelCase | `getUserById` |
| Handlers | nombrados por accion | `saveUser`, `deleteItem` — no `handleClick`, `onSubmit` |

## Types vs Classes

**TYPE cuando**: estructuras de datos puras (sin decoradores), payloads de eventos,
formas de API, return types, objetos de configuracion, estructuras complejas (≥3 props).

**CLASS cuando**: necesita decoradores (DI, validacion, ORM), runtime/metaprogramacion,
metodos o logica en el constructor.

## Estructuras de Datos Complejas

- **≥3 propiedades inline** → DEBE extraerse a un type nombrado con prefijo `T`.
- Co-locar al consumidor primario (`<module>.types.ts`, `models/<name>.ts`,
  `dto/<name>.dto.ts` segun el stack).
- Para exports type-only: `export type { ... }`.
- Re-exportar desde el barrel del module si lo consume mas de un archivo.

## Constantes

- Identificadores string especificos del dominio (config keys, nombres de eventos,
  audit actions, permission codes, codigos de error, etc.) DEBEN centralizarse
  en un objeto de constantes o enum.
- Greppear antes de crear uno nuevo — probablemente ya exista.
- Nada de strings inline para algo que se va a referenciar desde mas de un lugar.

## Reusabilidad

- Antes de implementar, buscar funciones/utilities existentes.
- Nombres auto-descriptivos. JSDoc cuando el helper o flujo lo amerite (no para
  documentar lo obvio).

## Dependencias

- Preferir versiones fijas en `dependencies` y `devDependencies` (sin `^` ni `~`)
  para builds reproducibles.
- Instalar con `--save-exact`.
- Instalaciones deterministicas en CI: `npm ci`.
