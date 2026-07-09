# PROJECT.md

# Portal ATP

## Descripción

Portal ATP es una plataforma web privada desarrollada exclusivamente para los integrantes de la Agrupación ATP de la Facultad de Ciencias Médicas de la Universidad Nacional de Rosario.

Su objetivo es centralizar en un único lugar todas las herramientas internas que actualmente funcionan de manera independiente, simplificando la organización cotidiana del equipo y mejorando la comunicación, la planificación y el seguimiento de las actividades.

El sistema no está destinado al público general. Todo su contenido requiere autenticación y únicamente puede ser utilizado por integrantes autorizados.

---

# Objetivos

Los objetivos principales del proyecto son:

- Centralizar todas las herramientas internas de ATP.
- Reducir la cantidad de aplicaciones y sitios web diferentes utilizados por el equipo.
- Simplificar la organización diaria de la agrupación.
- Facilitar la participación de todos los integrantes.
- Disminuir errores de coordinación.
- Ahorrar tiempo en tareas repetitivas.
- Generar un historial organizado de la actividad de la agrupación.
- Construir una plataforma escalable que pueda incorporar nuevos módulos en el futuro.

---

# Público objetivo

El sistema será utilizado por:

- Integrantes de ATP.
- Coordinadores.
- Responsables de áreas.
- Administradores del sistema.

No existen usuarios externos.

---

# Filosofía del proyecto

El Portal ATP debe sentirse como una aplicación sencilla, rápida y agradable de utilizar.

Cada funcionalidad debe poder encontrarse fácilmente sin necesidad de capacitación previa.

La prioridad no es ofrecer cientos de funciones, sino resolver muy bien las necesidades reales del equipo.

La plataforma debe transmitir orden, simplicidad y confianza.

---

# Principios de diseño

Todas las decisiones del proyecto deberán respetar los siguientes principios.

## Simplicidad

La solución más simple suele ser la mejor.

No agregar pasos innecesarios.

No agregar pantallas innecesarias.

No agregar configuraciones innecesarias.

---

## Mobile First

La plataforma será utilizada principalmente desde teléfonos celulares.

Todo el diseño deberá pensarse primero para pantallas pequeñas.

La versión de escritorio será una adaptación de la experiencia móvil, no al revés.

---

## Rapidez

Las acciones frecuentes deben requerir la menor cantidad posible de toques.

Siempre que sea posible:

- menos navegación
- menos clics
- menos formularios
- menos escritura manual

---

## Consistencia

Toda la plataforma debe comportarse de forma uniforme.

Los mismos componentes deben verse iguales.

Los botones deben mantener el mismo estilo.

Los formularios deben funcionar igual en todos los módulos.

La navegación debe ser consistente.

---

## Escalabilidad

Cada módulo debe poder evolucionar sin afectar al resto del sistema.

La incorporación de nuevas funcionalidades no debe requerir modificar la arquitectura existente.

---

# Funcionalidades principales

El sistema estará organizado en módulos independientes.

Inicialmente incluirá:

- Dashboard principal.
- Gestión de Mesita ATP.
- Gestión de reuniones y actas.
- Calendario de actividades.
- Gestión de tareas.
- Sistema de notificaciones.
- Gestión de usuarios.
- Perfil personal.

En el futuro podrán incorporarse nuevos módulos sin modificar la estructura general.

---

# Criterios de calidad

Una funcionalidad se considera terminada únicamente cuando:

- funciona correctamente;
- es responsive;
- mantiene la coherencia visual del sistema;
- respeta la arquitectura definida;
- posee validaciones adecuadas;
- contempla estados de carga y error;
- utiliza componentes reutilizables;
- no introduce deuda técnica innecesaria.

---

# Qué NO es este proyecto

El Portal ATP no busca convertirse en un sistema administrativo complejo.

No pretende reemplazar herramientas profesionales de gestión de proyectos.

No busca incorporar funciones únicamente por ser técnicamente posibles.

Cada nueva característica deberá resolver una necesidad real de la agrupación.

---

# Visión a largo plazo

Portal ATP debe convertirse en la herramienta central de trabajo de la agrupación.

Idealmente, cualquier integrante debería poder abrir la aplicación y encontrar allí toda la información necesaria para desarrollar sus actividades, sin depender de múltiples plataformas externas.

La arquitectura deberá permitir que el sistema continúe creciendo durante los próximos años sin necesidad de ser reconstruido desde cero.
