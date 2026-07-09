# DESIGN_SYSTEM.md

# Sistema de Diseño

## Objetivo

El Portal ATP debe transmitir una sensación de simplicidad, rapidez y orden.

El diseño debe priorizar la legibilidad, la consistencia y la facilidad de uso antes que los efectos visuales.

La interfaz debe sentirse moderna, limpia y liviana.

---

# Principios

Todo componente debe respetar los siguientes principios.

- Simple.
- Consistente.
- Reutilizable.
- Accesible.
- Responsive.
- Fácil de mantener.

Nunca diseñar un componente específico si puede resolverse reutilizando uno existente.

---

# Estilo general

La aplicación debe evitar el aspecto de un sistema administrativo antiguo.

Debe parecer una aplicación moderna.

Inspiraciones:

- Linear
- Notion
- GitHub
- Vercel
- Stripe Dashboard
- Google Material 3 (solo algunos patrones)
- shadcn/ui

No copiar exactamente ninguno de ellos.

---

# Filosofía visual

El diseño debe transmitir:

- claridad;
- organización;
- tranquilidad;
- rapidez;
- confianza.

Nunca debe sentirse recargado.

---

# Mobile First

Toda pantalla deberá diseñarse primero para teléfonos.

El escritorio será una adaptación del diseño móvil.

Nunca al revés.

---

# Layout

Toda pantalla utilizará la misma estructura.

Header

↓

Contenido principal

↓

Espacio inferior de seguridad

↓

Bottom Navigation (solo móvil)

---

# Espaciado

Utilizar una escala consistente.

4

8

12

16

20

24

32

40

48

64

Evitar márgenes arbitrarios.

---

# Bordes

Todos los componentes deberán utilizar radios consistentes.

Pequeño

Mediano

Grande

Extra grande

No mezclar estilos.

---

# Sombras

Las sombras deberán ser muy suaves.

Priorizar separación mediante espacios antes que sombras intensas.

---

# Tipografía

Utilizar una única familia tipográfica.

Priorizar:

Inter

o

Geist

No combinar múltiples tipografías.

---

# Jerarquía tipográfica

Display

H1

H2

H3

Título de tarjeta

Texto principal

Texto secundario

Caption

Toda la aplicación deberá respetar la misma jerarquía.

---

# Colores

La paleta debe ser reducida.

Color primario.

Color secundario.

Color de éxito.

Color de advertencia.

Color de error.

Color informativo.

Escala de grises.

No utilizar colores decorativos innecesarios.

---

# Iconografía

Utilizar exclusivamente Lucide React.

No mezclar librerías de iconos.

Todos los iconos deberán mantener tamaño consistente.

---

# Botones

Tipos permitidos:

Primary

Secondary

Outline

Ghost

Destructive

Link

Todos deberán compartir:

altura

padding

bordes

tipografía

estados

---

# Estados del botón

Default

Hover

Active

Focus

Disabled

Loading

Nunca dejar botones sin feedback.

---

# Inputs

Todos los formularios utilizarán el mismo estilo.

Campos:

Input

Textarea

Select

Checkbox

Radio

Switch

Date Picker

Search

No crear variantes innecesarias.

---

# Cards

Las tarjetas son el componente principal del sistema.

Toda información importante deberá mostrarse mediante Cards.

Cada Card debe contener únicamente la información necesaria.

---

# Badges

Utilizar badges para:

roles

estados

prioridades

categorías

Nunca utilizar colores sin significado.

---

# Estados visuales

Todo componente debe contemplar:

Loading

Empty

Success

Warning

Error

No dejar estados sin diseñar.

---

# Skeletons

Toda carga superior a unos pocos cientos de milisegundos deberá mostrar Skeletons.

Evitar spinners cuando sea posible.

---

# Toasts

Los mensajes temporales deberán utilizar Toasts.

Duración corta.

Texto claro.

Nunca utilizar lenguaje técnico.

---

# Dialogs

Los diálogos solo deberán utilizarse para acciones importantes.

Ejemplos:

Eliminar.

Cerrar reunión.

Cancelar tarea.

Nunca abrir múltiples diálogos simultáneamente.

---

# Navegación

La navegación debe ser evidente.

El usuario nunca debe preguntarse dónde está.

Siempre mostrar claramente la pantalla actual.

---

# Bottom Navigation

En dispositivos móviles utilizar navegación inferior.

Máximo cinco elementos principales.

Más funcionalidades deberán agruparse en "Más" o mediante accesos secundarios.

---

# Feedback

Toda acción del usuario debe generar una respuesta visual inmediata.

Ejemplos:

Guardar.

Eliminar.

Actualizar.

Enviar.

Asignar.

Nunca dejar acciones silenciosas.

---

# Animaciones

Las animaciones deben ser discretas.

Duración corta.

Nunca bloquear el flujo de trabajo.

No utilizar animaciones únicamente decorativas.

---

# Tablas

Evitar tablas tradicionales.

Preferir:

Cards

Listas

Acordeones

Timeline

Solo utilizar tablas cuando realmente aporten valor.

---

# Formularios

Los formularios deben:

dividir información extensa;

mostrar validaciones inmediatas;

mantener etiquetas claras;

agrupar campos relacionados.

Nunca crear formularios excesivamente largos.

---

# Dashboard

Debe mostrar únicamente información relevante.

Priorizar:

Próximas tareas.

Próximas actividades.

Cobertura de Mesita.

Notificaciones.

Accesos rápidos.

No sobrecargar la pantalla.

---

# Accesibilidad

Todos los componentes deben contemplar:

contraste suficiente;

navegación mediante teclado;

estados de foco visibles;

áreas táctiles amplias;

texto legible.

---

# Responsive

Breakpoints sugeridos.

Mobile

Tablet

Desktop

Large Desktop

Todo componente deberá adaptarse automáticamente.

---

# Consistencia

Nunca crear un componente que rompa el sistema visual.

Si aparece un nuevo patrón reutilizable deberá incorporarse al Design System antes de utilizarse.

El sistema de diseño es la única fuente de verdad para la interfaz.
