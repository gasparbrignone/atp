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

startDate

endDate

type

responsibleUsers

participants

status

createdBy

createdAt

updatedAt

---

# Tipos de eventos

meeting

campaign

training

academic

other

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
