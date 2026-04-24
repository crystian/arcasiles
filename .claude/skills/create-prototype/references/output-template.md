# Plantilla de Output

**Idioma**: Espanol. Paths de archivos y nombres de componentes en ingles.

El archivo del prototipo (`.claude/proto/<name>.md`):

```markdown
# Prototype: [Nombre del feature]

> Fecha: YYYY-MM-DD | Idea: .claude/idea/<name>.md (si existe)

## Pantallas generadas

- **[screen-name]**: descripcion de que muestra (NUEVA / MODIFICACION a [existing])

## Archivos creados

- `[path al archivo nuevo]`
- ...

## Archivos existentes modificados

- `[path]`: que se cambio (buscar //TODO PROTO:<name> para revertir)
- ...

## Tareas de implementacion

[Generado a partir de los marcadores //TODO PROTO:<name>. Esto es el checklist para la
fase de implementacion. Cada item mapea a un cambio real que tiene que ocurrir.]

- [ ] `[path:line]`: [que tiene que pasar — del comentario TODO PROTO]
- [ ] `[path:line]`: [que tiene que pasar]
- ...

## Codigo de referencia

[Templates HTML reducidos — estructura, componentes clave, layout y POSICION de los elementos.
No el codigo completo, solo lo necesario para entender y recrear el diseno.]

### [screen-name].html
\`\`\`html
[reducido: estructura, layout, componentes clave, posiciones de los elementos]
\`\`\`

## Especificaciones para implementar

[Esta seccion es el PUENTE a la siguiente fase. La fase de implementacion lee esto para
saber exactamente que construir. Completarla en base a lo prototipado y lo que el usuario valido.]

### Navegacion
- Donde vive en el menu (seccion, posicion, icono)
- Sub-rutas y estructura de navegacion interna

### Pantallas y layout
- Cada pantalla: que muestra, que componentes usa, como esta organizado
- Que es una pagina nueva vs que modifica una existente
- Orden y posicion de los elementos (que va arriba, que en tabs, que en dialogs)

### Datos y mocks
- Que datos se mockearon y que estructura tienen
- Que campos se mostraron en cada tabla/form
- Que datos vendrian del backend (futuras entidades/endpoints)

### Interacciones
- Que hace cada boton/accion
- Flujos de usuario confirmados (happy path probado)
- Comportamiento de formularios, validaciones visibles

### Decisiones de UI
- Decisiones tomadas durante el prototipo que deben respetarse
- Componentes UI elegidos (p-table, p-dialog, etc.)
- Patrones de layout usados

## Cambios sobre la idea

[Cambios que surgieron durante el prototipo y que contradicen o expanden lo definido en
la fase de idea. NO modificar el archivo original — documentar aca lo que cambio
y POR QUE, para que la fase siguiente conozca la verdad actualizada.]

- [Que cambio]: [lo que decia la idea] → [lo que revelo el prototipo] — [por que]

## Feedback y cambios pedidos

[Solo items no resueltos o preguntas abiertas. El feedback resuelto deberia mergearse a
las secciones de specs de arriba durante la consolidacion.]

- [Cambio 1]: que pidio y por que
```
