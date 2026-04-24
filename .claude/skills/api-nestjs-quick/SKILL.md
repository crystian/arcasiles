---
name: api-nestjs-quick
description: "Referencia rapida de NestJS — convenciones especificas del framework: imports ESM con .js, manejo de errores con excepciones built-in, organizacion de modulos (barrels), API/Swagger, TypeORM y eventos. Usar al escribir o revisar codigo NestJS. Para reglas transversales (TypeScript, naming, types vs classes, dependencias) ver `/senior-developer`."
author: "Cristian 'pusher' Bietti"
linkedin: https://www.linkedin.com/in/crystian/
---

# Referencia Rapida NestJS

Convenciones especificas de NestJS + TypeORM. Las reglas transversales de senior
(calidad de codigo, TypeScript estricto, naming, types vs classes, complex types,
constantes, dependencias) viven en `/senior-developer` — esta skill solo
documenta lo propio del framework.

## TypeScript en NestJS

- **Imports ESM (CRITICO)**: los imports relativos DEBEN incluir extension `.js`
  (`./foo.js`, `./bar/index.js`). Los paquetes externos no la necesitan.

## Manejo de Errores

- Usar las excepciones built-in de NestJS (`NotFoundException`, `BadRequestException`,
  `ConflictException`, `ForbiddenException`, `UnauthorizedException`, etc.).
- Los Guards DEBEN tirar excepciones explicitas con mensaje claro — nunca `return false`.
- Los mensajes visibles al cliente vienen de constantes/enums del module, no inline.

## Organizacion de Modulos

- **Barrels (`index.ts`)**: solo cuando hay multiples archivos a exportar.
  Sin barrels de un solo export.
- **NUNCA exportar `.module.ts` o `.controller.ts` desde barrels** — causa
  inicializacion circular.
- Archivos de modulo: `<module-name>.module.ts`, nunca `index.ts`.

## DTOs

- Los DTOs son `class` con decoradores de `class-validator` y `@ApiProperty`/`@ApiPropertyOptional`.
- Definir en `dto/<name>.dto.ts` dentro del module.
- **Validacion**: `@IsOptional()` + `@Length()` → empezar en 0: `@Length(0, 200)`.

## API / Swagger

- En controllers: `@ApiTags`, `@ApiOperation`, `@ApiResponse`, y `@ApiBearerAuth(...)`
  con el nombre del scheme que use el proyecto.
- Swagger se sirve solo fuera de produccion — gatear con la env var de ambiente del proyecto.

## Base de Datos / TypeORM

- **Columnas nullable con union types**: SIEMPRE especificar `type` explicitamente
  (`type: 'int'`, `type: 'varchar'`).
- **Sin `synchronize: true` en produccion** — usar migraciones para todo cambio de schema.
- Entities en una carpeta `entities/` por module.
- Definir explicitamente la naming strategy del proyecto (camelCase nativo o
  `SnakeNamingStrategy`) y respetarla — no mezclar.
