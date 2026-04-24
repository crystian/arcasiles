# Idea: Encuestas rapidas entre amigos

> Fecha: 2026-04-23

## Idea

Mini-app para crear encuestas rapidas y compartirlas con amigos. El creador arma una encuesta
con 3 preguntas fijas, cada una de opcion unica (elegir una sola entre 2 a 5 alternativas).
Al guardarla obtiene un link generico que puede compartir por donde quiera (WhatsApp,
Telegram, etc).

Los invitados entran al link, votan de forma anonima y, solo despues de votar, ven los
resultados agregados en barras horizontales con porcentaje. La misma persona no deberia
poder votar dos veces desde el mismo navegador.

El tono es casual — pensado para decisiones entre amigos tipo "¿donde vamos el sabado?",
no para encuestas corporativas ni relevamientos serios.

### Problema

Cuando un grupo tiene que decidir algo, los chats se llenan de mensajes, encuestas de
WhatsApp se pierden y no hay una forma limpia de ver el resultado. Hace falta algo rapido,
sin cuentas, sin configuracion.

### Propuesta

- **Crear encuesta**: titulo + 3 preguntas, cada una con 2 a 5 opciones. Sin cuenta, se
  guarda local en el navegador del creador la lista de encuestas que creo.
- **Compartir**: link generico, mismo para todos.
- **Votar**: anonimo, una sola respuesta por pregunta, se envia todo junto.
- **Ver resultados**: solo despues de votar. Se muestran con barras horizontales, porcentaje
  y cantidad por opcion.
- **Anti-doble-voto**: cookie en el navegador. Se acepta que no es blindado — alcanza para
  el caso de uso entre conocidos.

### Reglas de negocio

- Cada encuesta tiene exactamente 3 preguntas.
- Cada pregunta permite elegir una sola opcion, entre 2 y 5 disponibles.
- Las encuestas son inmutables: no se pueden editar ni eliminar una vez creadas.
- Las encuestas quedan abiertas indefinidamente (por ahora).
- El voto es anonimo — no se guarda quien voto que.
- Los resultados no se muestran hasta que el visitante haya votado.

### Pantallas principales

- **Crear encuesta**: formulario con titulo, las 3 preguntas y sus opciones.
- **Confirmacion**: muestra el link generado para compartir.
- **Votar**: las 3 preguntas con sus opciones. Un solo submit al final.
- **Resultados**: barras horizontales por opcion con % y cantidad, por cada pregunta.
- **Mis encuestas** (creador): lista local de las encuestas que ese navegador creo,
  con acceso rapido al link y a los resultados.

## Decisiones

- **Anonimo con anti-doble-voto por cookie**: se prioriza simplicidad sobre robustez.
  No requiere login ni invitaciones personalizadas. Trade-off aceptado: alguien podria
  votar de nuevo cambiando de navegador o limpiando cookies.
- **Link generico, no personalizado**: el mismo link sirve para todos. Mas facil de
  compartir, pero no permite saber a quien se invito.
- **3 preguntas fijas**: no es configurable la cantidad. Mantiene la app minimalista y
  elimina una decision del creador.
- **Opcion unica por pregunta**: no hay multi-respuesta, texto libre ni rating. Solo
  elegir una.
- **2 a 5 opciones por pregunta**: rango acotado que fuerza a ser concretos y evita
  encuestas con 20 alternativas.
- **Sin cierre automatico**: las encuestas quedan abiertas. No hay fecha de vencimiento
  ni cierre manual (por ahora).
- **Resultados visibles al votante solo tras votar**: se evita que el resultado actual
  influya en el voto.
- **Visualizacion con barras horizontales + %**: mas claro que solo numeros, escaneable
  rapido.
- **Sin cuenta para el creador**: cualquiera crea sin registrarse. La lista de encuestas
  creadas se guarda local en su navegador. Trade-off: si cambia de dispositivo o limpia
  datos, pierde la lista (pero los links guardados en otro lado siguen funcionando).
- **Encuestas inmutables**: no se pueden editar ni eliminar. Simplifica todo — no hay que
  decidir que pasa con los votos previos al editar ni manejar estados "borrada". Si te
  equivocaste, creas otra.

## Gaps y pendientes

- [x] Todos los gaps iniciales resueltos.
