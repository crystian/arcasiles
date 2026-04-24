## Idea: Clubes de Lectura

> Fecha: 2026-04-23

## Idea

App social para hacer amigos adultos en Madrid usando los clubes de lectura como
pretexto. La mision no es leer mejor ni descubrir libros — es conectar personas con
afinidad literaria parecida. El libro es la excusa, no el fin.

No compite con Goodreads ni con Meetup. Compite con "como hago amigos de adulto sin
que sea raro".

### Problema

Hay gente que quiere leer en compania y conocer personas con gustos parecidos, pero
hoy no tiene donde. Meetup esta vacio, los grupos de WhatsApp son cerrados, y buscar
un club en Google no lleva a ningun lado. La puerta de entrada para conectar via
lectura no existe.

### Publico

- **Lectores** que buscan sumarse a un club y conocer gente.
- **Organizadores** con perfil "juntador" (no academico) — gente a la que le gusta
  armar encuentros y usa el libro como vehiculo.

### Propuesta

- Explorar clubes de lectura cerca como primera accion al abrir la app.
- Perfil basado en auto-definicion por lectura (libros favoritos, generos).
- Soporta clubes **presenciales** (en Madrid) y **online** (sin limite geografico),
  los dos por igual.
- Permite sumarse a clubes existentes y crear clubes nuevos.

### Vibe

Casual, social, joven — estilo "Bumble BFF literario". NO es LinkedIn de lectores
ni un foro serio de critica literaria.

### Ciudad de arranque

Madrid. Una sola ciudad al inicio para que no parezca desierto; la expansion llega
despues.

## Decisiones

- **Foco social, no literario**: el valor esta en conectar personas. El libro es el
  vehiculo, no el objetivo. Evita competir de frente con Goodreads.
- **Ciudad unica al arranque (Madrid)**: multi-ciudad vacio es peor que una ciudad con
  densidad. Reduce el riesgo de "desierto".
- **Perfil por auto-definicion literaria**: el usuario se presenta con lo que lee
  (libros favoritos, generos). No hay quiz ni match algoritmico forzado.
- **Presencial y online con mismo peso**: el producto soporta los dos flujos por igual
  desde el dia 1.
- **Primer movimiento = explorar clubes cerca**: puerta de entrada clara. Crear club o
  armar perfil son acciones secundarias.
- **Vibe Bumble BFF literario**: casual, social, joven. NO LinkedIn de lectores, NO foro
  academico.
- **Soporta clubes existentes Y nuevos**: los amigos del usuario van a semillar clubes
  al inicio.

## Gaps y pendientes

- [ ] Mecanismos de confianza para bajar el miedo de "ir a un club y que no me caiga
  nadie" — el usuario dijo que le gustan (trial sin compromiso / reviews del club /
  chat previo) pero no se eligio cual priorizar.
- [ ] Como se siembra el inventario inicial de clubes en Madrid. Hay amigos del usuario
  que armaran algunos, pero falta plan concreto de carga inicial.
- [ ] Data mock al arranque — como evitar que la app se vea vacia en los primeros dias.
- [ ] Privacidad del perfil: ¿los libros favoritos son publicos a cualquiera, solo a
  miembros de clubes compartidos, etc.?
- [ ] Moderacion / reporte de usuarios: no discutido. En un producto social tiene que
  existir en algun momento.
