# DEVELOPMENT.md

# Guía de Desarrollo

## Objetivo

Este documento define las reglas obligatorias para el desarrollo del Portal ATP.

Todas las implementaciones deberán respetar estas convenciones para mantener un código consistente, legible y fácil de mantener.

Estas reglas tienen prioridad sobre preferencias individuales.

---

# Filosofía

Siempre priorizar:

- simplicidad;
- claridad;
- mantenibilidad;
- escalabilidad;
- reutilización.

Nunca escribir código únicamente porque sea más corto.

El código debe ser fácil de entender incluso varios meses después.

---

# Antes de programar

Antes de implementar cualquier funcionalidad:

1. comprender completamente el requerimiento;
2. revisar la documentación correspondiente;
3. verificar si ya existe una solución similar;
4. analizar el impacto sobre otros módulos.

Nunca comenzar a escribir código inmediatamente.

---

# Reutilización

Antes de crear:

- componente;
- hook;
- servicio;
- utilidad;
- tipo;
- validación;

verificar si ya existe uno reutilizable.

La duplicación debe evitarse siempre que sea posible.

---

# Componentes

Cada componente debe tener una única responsabilidad.

Si un componente comienza a crecer demasiado deberá dividirse.

Los componentes deben ser pequeños y fáciles de leer.

Evitar componentes de cientos de líneas.

---

# Hooks

Extraer lógica reutilizable a Custom Hooks.

No utilizar Hooks únicamente para reducir líneas de código.

Un Hook debe representar comportamiento reutilizable.

---

# Servicios

Toda interacción con Firebase deberá realizarse mediante Services.

Los componentes nunca deberán contener llamadas directas a Firestore.

Ejemplo:

Página

↓

Hook

↓

Service

↓

Firebase

---

# Tipado

Todo debe estar completamente tipado.

No utilizar:

any

unknown

type assertions innecesarias

Preferir interfaces y tipos bien definidos.

---

# Funciones

Las funciones deben:

tener un único propósito;

ser pequeñas;

tener nombres descriptivos;

evitar efectos secundarios.

---

# Estado

Mantener el estado lo más cerca posible del lugar donde se utiliza.

No convertir información local en estado global innecesariamente.

---

# React Context

Utilizar Context únicamente para:

usuario autenticado;

tema;

configuración general.

No utilizar Context para reemplazar TanStack Query.

---

# Firestore

Toda lectura deberá realizarse mediante Services.

Toda escritura deberá validar previamente:

permisos;

datos;

estado actual.

Nunca escribir directamente desde un componente.

---

# Formularios

Todos los formularios deberán utilizar:

React Hook Form

+

Zod

No implementar validaciones manuales salvo casos excepcionales.

---

# Errores

Todo error debe ser manejado.

Nunca utilizar:

console.log()

como mecanismo de manejo de errores.

Mostrar mensajes comprensibles para el usuario.

Registrar información útil para depuración cuando corresponda.

---

# Loading

Toda operación asíncrona deberá contemplar estados de carga.

Nunca dejar pantallas vacías mientras se esperan datos.

---

# Empty States

Toda lista deberá contemplar:

sin datos;

error;

cargando;

contenido.

Nunca asumir que siempre existirán registros.

---

# Confirmaciones

Solicitar confirmación únicamente para acciones destructivas.

Ejemplos:

Eliminar.

Cancelar.

Cerrar reunión.

Nunca solicitar confirmación para acciones reversibles.

---

# Navegación

No utilizar rutas escritas manualmente.

Toda navegación deberá utilizar las constantes definidas por la aplicación.

---

# Constantes

No escribir textos repetidos.

No escribir nombres de colecciones manualmente.

No escribir roles manualmente.

No escribir estados manualmente.

Todo deberá centralizarse en constantes.

---

# Imports

Preferir imports absolutos cuando la configuración del proyecto lo permita.

Mantener el orden consistente.

---

# Archivos

Cada archivo debe tener una única responsabilidad.

Evitar archivos excesivamente largos.

Como referencia:

Ideal:

hasta 200 líneas.

Aceptable:

hasta 350 líneas.

Más de eso generalmente indica que debe dividirse.

---

# Comentarios

El código debe ser suficientemente claro para no requerir comentarios.

Solo comentar:

decisiones complejas;

algoritmos no evidentes;

limitaciones técnicas.

Nunca comentar lo obvio.

---

# Nombres

Los nombres deben describir intención.

Buenos ejemplos:

createMeeting

calculateCoverage

sendReminder

Bad examples:

handleData

process

temp

value

test

---

# CSS

Toda la interfaz deberá construirse utilizando Tailwind.

No crear archivos CSS específicos salvo casos muy excepcionales.

---

# Dependencias

Antes de instalar una librería nueva verificar:

¿Ya existe una solución?

¿React lo resuelve?

¿Tailwind lo resuelve?

¿La librería realmente aporta valor?

Evitar aumentar innecesariamente las dependencias del proyecto.

---

# Performance

Optimizar únicamente cuando exista un problema real.

No utilizar:

memo

useMemo

useCallback

por defecto.

Utilizarlos únicamente cuando exista una justificación clara.

---

# Accesibilidad

Toda funcionalidad nueva debe contemplar:

teclado;

lectores de pantalla;

foco visible;

contraste;

tamaño táctil adecuado.

---

# Testing Manual

Antes de considerar terminada una funcionalidad verificar:

funciona correctamente;

es responsive;

maneja errores;

maneja estados vacíos;

maneja loading;

no rompe otros módulos.

---

# Refactorización

Si durante una implementación aparece una oportunidad clara de mejorar código existente:

realizar la refactorización únicamente si:

mejora la arquitectura;

no introduce riesgos;

no retrasa significativamente el desarrollo.

Evitar refactorizaciones masivas innecesarias.

---

# Documentación

Cuando una decisión importante modifique la arquitectura o el comportamiento esperado del sistema:

actualizar la documentación correspondiente dentro de `/docs`.

La documentación debe mantenerse sincronizada con el código.

---

# Pull Requests internos

Cada cambio importante deberá responder:

¿Qué problema resuelve?

¿Por qué esta solución?

¿Qué módulos afecta?

¿Existe impacto sobre otras funcionalidades?

---

# Regla principal

Siempre escribir código pensando que otra persona deberá mantenerlo dentro de varios años.

La claridad tiene prioridad sobre la creatividad.

La consistencia tiene prioridad sobre la velocidad.

La mantenibilidad tiene prioridad sobre la complejidad técnica.
