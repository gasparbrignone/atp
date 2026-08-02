# FEATURES.md

# Funcionalidades

Este documento describe el comportamiento esperado de cada módulo del Portal ATP.

Toda implementación deberá respetar estas especificaciones.

---

# Dashboard

## Objetivo

Ser el centro de operaciones del usuario.

Debe mostrar únicamente información relevante.

No debe convertirse en una pantalla saturada.

---

## Información mostrada

Como mínimo:

- saludo personalizado;
- porcentaje de cobertura semanal;
- próximos turnos de Mesita;
- próximas actividades;
- tareas pendientes;
- notificaciones recientes.

Toda la información debe actualizarse automáticamente.

---

## Acciones rápidas

El Dashboard deberá ofrecer accesos directos a las acciones más frecuentes.

Ejemplos:

- Anotarse en Mesita.
- Crear reunión.
- Crear actividad.
- Ver calendario.
- Consultar tareas.

---

# Mesita ATP

## Objetivo

Organizar la cobertura semanal de la mesa de ATP.

---

## Cobertura

Cada semana posee bloques horarios de una hora.

Cada bloque tiene:

- día;
- horario;
- capacidad máxima;
- integrantes asignados.

---

## Estados

Cada horario podrá encontrarse en uno de los siguientes estados:

Vacío

Parcial

Completo

Bloqueado

Cada estado deberá poseer una representación visual clara.

---

## Acciones permitidas

Los integrantes podrán:

- anotarse;
- cancelar su participación;
- consultar disponibilidad.

Los coordinadores podrán además:

- bloquear horarios;
- desbloquear horarios;
- modificar capacidad;
- realizar asignaciones manuales.

---

## Indicadores

El módulo deberá mostrar:

- porcentaje de cobertura;
- cantidad de horarios completos;
- cantidad de horarios incompletos;
- próximos turnos.

---

## Historial

Toda modificación deberá quedar registrada.

---

# Reuniones

## Objetivo

Registrar toda la actividad de las reuniones de ATP.

---

## Información

Cada reunión contendrá:

- fecha;
- asistentes;
- balance semanal;
- temas tratados;
- decisiones;
- tareas asignadas;
- observaciones.

---

## Acciones

Crear.

Editar.

Consultar.

Exportar PDF.

Buscar.

Duplicar reunión.

---

# Actas

Cada reunión genera un acta.

El acta debe poder:

- visualizarse;
- editarse;
- exportarse;
- descargarse posteriormente.

---

# Calendario

## Objetivo

Centralizar todas las actividades.

---

## Cada actividad incluirá

Título.

Descripción.

Fecha (de inicio y de fin; una actividad puede durar varios días).

Todo el día (opcional; oculta el horario).

Horario (si no es todo el día).

Color (a elección de quien la crea, para diferenciarla a simple vista).

Lugar.

Responsables.

Participantes.

Estado.

---

## Vistas

Mes: grilla mensual con un punto de color por actividad en cada día.

Semana: grilla de horarios por día, con las actividades ubicadas según su
hora de inicio y fin. Las actividades "todo el día" se muestran aparte,
arriba de la grilla horaria.

---

## Participación

Cada integrante podrá responder:

Asistiré.

No asistiré.

Todavía no lo sé.

Los organizadores podrán consultar el estado de asistencia.

---

# Tareas

## Objetivo

Administrar el trabajo interno.

---

## Cada tarea incluirá

Título.

Descripción.

Responsables.

Prioridad.

Estado.

Fecha límite.

Observaciones.

---

## Estados

Pendiente.

En progreso.

Finalizada.

Cancelada.

---

## Prioridades

Baja.

Media.

Alta.

Urgente.

---

## Acciones

Crear.

Editar.

Asignar.

Completar.

Cancelar.

Filtrar.

Buscar.

---

# Notificaciones

El sistema deberá generar notificaciones automáticas.

Ejemplos:

Nueva tarea.

Nuevo evento.

Nueva reunión.

Cambio de horario.

Recordatorio de Mesita.

---

## Canales

Dentro del sistema.

Correo electrónico.

---

# Usuarios

Cada usuario tendrá:

perfil;

rol;

estado;

foto;

correo.

---

## Alta de usuarios

Existen dos formas de dar de alta un usuario:

Autoregistro: cualquier persona puede crear su propia cuenta desde una
pantalla pública de registro (nombre, apellido, correo, contraseña). Queda
con rol "Integrante" y estado "Pendiente" hasta que un administrador la
apruebe.

Alta manual: un administrador puede generar los datos de un usuario desde
el panel de Administración para crearlo directamente en Firebase Console
(sin pasar por el registro público).

Un usuario con estado distinto de "Activo" no puede utilizar la aplicación:
ve una pantalla explicando su situación (pendiente, inactivo o suspendido)
con la opción de cerrar sesión.

---

## Estados

Pendiente: se registró y espera aprobación.

Activo: puede usar la aplicación con normalidad.

Inactivo: fue desactivado por un administrador.

Suspendido: fue rechazado o bloqueado por un administrador.

---

## Acciones

Editar perfil.

Cambiar contraseña.

Actualizar fotografía.

Consultar actividad reciente.

---

# Administración

Panel exclusivo para administradores.

Permitirá:

gestionar usuarios (incluida la aprobación de registros pendientes y la asignación de rol);

administrar permisos;

configurar parámetros generales;

consultar estadísticas.

---

# Recursos

Repositorio interno.

Podrá almacenar:

- enlaces;
- documentos;
- archivos;
- manuales;
- credenciales;
- material gráfico.

---

## Búsqueda

Toda la plataforma deberá incorporar búsqueda.

La búsqueda deberá localizar contenido perteneciente a cualquier módulo.

---

# Historial

Los módulos deberán conservar historial cuando tenga sentido.

Ejemplos:

Reuniones.

Tareas.

Mesita.

Eventos.

---

# Responsive

Todas las funcionalidades deberán utilizarse correctamente desde dispositivos móviles.

No podrá existir ninguna funcionalidad exclusiva para escritorio.

---

# Offline

Cuando Firestore lo permita, la aplicación deberá continuar mostrando información previamente sincronizada aun sin conexión.

---

# Futuras funcionalidades

La arquitectura deberá permitir incorporar fácilmente:

- FAQ.
- Encuestas.
- Inventario.
- Biblioteca.
- Gestión de campañas.
- Votaciones.
- Gestión documental.
- Estadísticas.
- Panel de métricas.
- Integraciones externas.

---

# Criterios generales

Toda funcionalidad nueva deberá:

ser intuitiva;

mantener coherencia visual;

respetar la arquitectura del proyecto;

utilizar componentes reutilizables;

funcionar correctamente en dispositivos móviles;

contemplar estados de carga, error y ausencia de datos.

La simplicidad siempre tendrá prioridad sobre agregar nuevas funciones.
