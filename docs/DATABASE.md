# DATABASE.md

# Base de datos

## Objetivo

La base de datos debe ser:

- simple;
- consistente;
- escalable;
- fácil de consultar;
- fácil de mantener.

Toda la información del sistema se almacenará en Cloud Firestore.

---

# Principios

## Normalización

Evitar duplicar información.

Siempre que sea posible almacenar referencias en lugar de copiar datos completos.

---

## Documentos pequeños

Los documentos deben mantenerse livianos.

La información muy extensa deberá dividirse en subcolecciones o documentos independientes.

---

## IDs

Todos los documentos utilizarán IDs automáticos generados por Firestore.

Nunca utilizar nombres como identificadores.

---

## Fechas

Todas las fechas deberán almacenarse como Timestamp de Firestore.

Nunca guardar fechas como texto.

---

## Auditoría

Todos los documentos importantes deberán contener:

createdAt

updatedAt

createdBy

updatedBy

---

# Colecciones principales

users

meetings

tasks

events

mesitaWeeks

notifications

settings

faq

resources

---

# users

Representa a cada integrante de ATP.

Campos sugeridos:

id

firstName

lastName

displayName

email

photoURL

role

status

phone

createdAt

updatedAt

lastLogin

Debe existir un único documento por usuario.

---

# Estados de usuario (status)

Valores permitidos:

pending (recién autoregistrado, sin aprobar)

active

inactive

suspended

Un usuario autoregistrado siempre se crea con role "member" y status
"pending"; ambos campos quedan forzados por las reglas de Firestore para
que no pueda autoasignarse un rol ni activarse a sí mismo. Solo un admin
puede cambiarlos.

---

# Roles

Valores permitidos:

admin

coordinator

member

Nunca utilizar texto libre.

---

# Status

Valores permitidos:

active

inactive

suspended

---

# meetings

Representa una reunión.

Campos:

date

title

summary

weeklyBalance

attendees

topics

decisions

createdBy

createdAt

updatedAt

---

# topics

Cada reunión podrá contener múltiples temas.

Cada tema incluye:

title

discussion

decision

order

---

# tasks

Representa una tarea.

Campos:

title

description

status

priority

assignedUsers

dueDate

completedAt

createdBy

createdAt

updatedAt

---

# Status de tareas

pending

in_progress

completed

cancelled

---

# Prioridades

low

medium

high

urgent

---

# events

Representa actividades del calendario.

Campos:

title

description

location

allDay

startDate

endDate

color

responsibleUsers

participants

status

createdBy

createdAt

updatedAt

startDate/endDate admiten actividades de varios días: la duración surge de
la diferencia entre ambas, no de un campo aparte. Cuando allDay es true, se
ignora la hora de ambos campos (se guardan como 00:00 y 23:59 del día
correspondiente).

---

# Colores de eventos

blue

green

amber

red

purple

pink

teal

gray

---

# mesitaWeeks

Cada documento representa una semana.

Ejemplo:

2026-W28

Dentro del documento:

weekStart

weekEnd

coverage

slots

blockedSlots

createdAt

updatedAt

---

# slots

Cada bloque horario incluye:

day

startHour

endHour

assignedUsers

capacity

status

notes

---

# Estados del horario

empty

partial

complete

blocked

---

# notifications

Representa una notificación.

Campos:

title

message

userId

type

read

createdAt

readAt

---

# Tipos de notificación

meeting

task

mesita

calendar

system

---

# settings

Configuración general.

Ejemplos:

cantidad mínima de personas por horario

hora de recordatorios

correo de envío

nombre de la organización

etc.

Debe existir un único documento.

---

# faq

Preguntas frecuentes.

Campos:

question

answer

category

order

published

---

# resources

Repositorio interno.

Puede almacenar:

manuales

documentos

enlaces

contraseñas compartidas

archivos

---

# Contraseñas compartidas

Las contraseñas nunca deberán almacenarse en texto plano.

Deberán cifrarse antes de guardarse.

Solo podrán acceder usuarios autorizados.

Toda visualización deberá quedar registrada.

---

# Relaciones

users

↓

tasks

↓

assignedUsers

---

users

↓

meetings

↓

attendees

---

users

↓

events

↓

participants

---

users

↓

mesita

↓

assignedUsers

---

# Eliminación

Nunca eliminar información importante físicamente.

Utilizar soft delete cuando corresponda.

Ejemplo:

deleted

deletedAt

deletedBy

---

# Consultas

Las consultas deberán diseñarse para minimizar lecturas.

Siempre pensar primero en cómo se consultarán los datos y luego en cómo se almacenarán.

---

# Índices

Todo nuevo campo utilizado para filtros deberá considerar la creación de índices en Firestore.

---

# Escalabilidad

La base debe permitir incorporar nuevas colecciones sin modificar las existentes.

Ejemplos futuros:

inventory

surveys

projects

votes

expenses

socialMedia

documents

attendance

training

elections

---

# Convenciones

Todas las colecciones:

- nombres en inglés;
- minúsculas;
- plural;
- camelCase para campos;
- IDs automáticos.

---

# Integridad

El sistema deberá garantizar:

- datos consistentes;
- referencias válidas;
- validaciones antes de escribir;
- permisos antes de modificar;
- auditoría de operaciones importantes.

---

# Ajustes de implementación

Durante la implementación de cada módulo aparecieron detalles que este
documento no especificaba, o donde el diseño original chocaba con cómo
Firestore resuelve seguridad/consultas en la práctica. Se optó por la
alternativa más simple dentro de los principios ya definidos arriba
(documentos pequeños, mínimo privilegio, sin índices compuestos
innecesarios). Quedan registrados acá para que el documento siga siendo
la fuente de verdad real del sistema.

## mesitaWeeks

Los horarios **no** se guardan como array `slots` dentro del documento de
la semana, sino como subcolección `mesitaWeeks/{weekId}/slots/{day-startHour}`
(un documento por bloque día+hora). Motivo: es la aplicación directa del
principio "documentos pequeños" de este mismo documento, y permite que
reglas de Firestore autoricen a cada integrante a anotarse/cancelar su
propio horario sin poder tocar el de otros ni el resto de los campos —
algo impracticable de validar con un array grande dentro de un único
documento.

Cada slot: `day` (1=Lunes...5=Viernes), `startHour`, `endHour`,
`assignedUsers`, `capacity` (sin tope máximo fijo), `blocked` (boolean,
reemplaza el string "status"; el estado visual empty/partial/complete se
calcula en el cliente a partir de `assignedUsers.length` vs `capacity`),
`notes`.

El documento padre `mesitaWeeks/{weekId}` (con `weekStart`, `weekEnd`,
`coverage`, `blockedSlots`) no se llega a crear: esos valores se calculan
en el cliente a partir de la subcolección de slots en el momento, para
no tener un campo `coverage` que pueda desincronizarse del contenido real.

## meetings y events

Se agregan `deleted`, `deletedAt`, `deletedBy` (soft delete), aplicando
la sección "Eliminación" de este documento, que no los listaba
explícitamente en los campos de estas dos colecciones.

## events

El campo `participants` se reemplaza por `attendance`: un mapa
`uid -> "yes" | "no" | "maybe"`. Motivo: FEATURES.md pide que cada
integrante pueda responder Asistiré / No asistiré / Todavía no sé, algo
que un array plano de participantes no puede representar sin arrays
paralelos. Las reglas de Firestore permiten que cada usuario escriba
únicamente su propia clave dentro de `attendance`.

`status` pasa de texto libre a un enum acotado: `confirmed` | `cancelled`.

## tasks

Se agrega `notes` (Observaciones), presente en FEATURES.md pero no en
la lista de campos original de esta colección.

## notifications

Se agrega `relatedId`: id del documento relacionado (tarea/reunión/
actividad), para que la notificación pueda navegar directamente a su
origen en vez de ser solo informativa.

La creación desde el cliente (antes reservada por completo a Cloud
Functions) se habilita para coordinadores/admin, ya que son quienes
disparan estas notificaciones al crear tareas/reuniones/actividades y
todavía no existe ninguna Cloud Function desplegada en el proyecto.
Falta implementar "cambio de horario" y "recordatorio de Mesita"
(requieren lógica server-side/programada).

## settings

Documento único con id fijo `general`. Primer conjunto de campos
implementado: `organizationName`, `minUsersPerSlot`, `reminderHour`,
`senderEmail`. Todavía no hay otros módulos leyendo estos valores en
tiempo real (ej. la capacidad por defecto de un slot de Mesita sigue
siendo una constante en código); es el próximo paso natural de este
módulo.
