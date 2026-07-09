# ARCHITECTURE.md

# Arquitectura del proyecto

## Objetivo

La arquitectura del Portal ATP debe priorizar:

- simplicidad;
- escalabilidad;
- mantenibilidad;
- reutilización de componentes;
- separación de responsabilidades.

El sistema deberá poder crecer durante años sin necesidad de ser reestructurado.

---

# Filosofía

Toda nueva funcionalidad deberá implementarse como un módulo independiente.

Ningún módulo debe depender directamente de otro.

La comunicación entre módulos deberá realizarse mediante servicios compartidos o acceso controlado al estado global.

Se evitarán dependencias innecesarias.

---

# Stack tecnológico

El proyecto utilizará exclusivamente las siguientes tecnologías.

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Lucide React

## Estado y datos

- TanStack Query
- React Context únicamente para estado global simple

## Formularios

- React Hook Form
- Zod

## Backend

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Functions
- Firebase Hosting

---

# Principios arquitectónicos

## Componentes pequeños

Los componentes deben tener una única responsabilidad.

Si un componente comienza a crecer demasiado, deberá dividirse.

---

## Reutilización

Antes de crear un componente nuevo siempre deberá verificarse si existe uno reutilizable.

Se priorizará la composición sobre la duplicación.

---

## Tipado estricto

Todo el proyecto utilizará TypeScript estricto.

No utilizar `any`.

Siempre definir interfaces o tipos.

---

## Separación de responsabilidades

La lógica de negocio nunca deberá mezclarse con la interfaz.

Cada capa tendrá una responsabilidad clara.

---

# Organización de carpetas

```text
src/
│
├── app/
├── assets/
├── components/
│   ├── common/
│   ├── forms/
│   ├── layout/
│   ├── ui/
│   └── feedback/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── mesita/
│   ├── meetings/
│   ├── calendar/
│   ├── tasks/
│   ├── notifications/
│   ├── profile/
│   └── admin/
│
├── hooks/
├── lib/
├── providers/
├── routes/
├── services/
├── types/
├── utils/
└── styles/
```

---

# Organización interna de cada módulo

Cada módulo deberá mantener una estructura similar.

Ejemplo:

```text
features/
mesita/
├── components/
├── pages/
├── hooks/
├── services/
├── types/
├── utils/
├── validations/
└── index.ts
```

Cada módulo debe poder evolucionar sin afectar a los demás.

---

# Componentes

Los componentes deberán clasificarse según su responsabilidad.

## UI

Componentes completamente reutilizables.

Ejemplos:

- Button
- Input
- Card
- Badge
- Dialog
- Avatar

Nunca deberán contener lógica de negocio.

---

## Common

Componentes reutilizados por varios módulos.

Ejemplos:

- Header
- PageTitle
- EmptyState
- ErrorState
- LoadingState

---

## Feature Components

Componentes específicos de un módulo.

Ejemplo:

MesitaCalendar

MeetingSummary

TaskCard

No deberán utilizarse fuera de su módulo salvo que posteriormente se generalicen.

---

# Estado de la aplicación

Se evitará almacenar información global innecesaria.

Utilizar:

TanStack Query

para:

- Firestore
- consultas
- caché
- sincronización

React Context únicamente para:

- usuario autenticado
- tema visual (si existe)
- configuración general

No utilizar Context para datos de negocio.

---

# Servicios

Toda interacción con Firebase deberá pasar por una capa de servicios.

Nunca acceder directamente a Firestore desde un componente visual.

Ejemplo:

```text
MesitaPage
↓
MesitaService
↓
Firestore
```

---

# Validaciones

Toda validación deberá realizarse mediante Zod.

No duplicar validaciones.

Los mismos esquemas deberán utilizarse para:

- formularios
- servicios
- backend cuando sea posible

---

# Navegación

Todas las rutas deberán centralizarse.

No escribir rutas como texto dentro de los componentes.

Ejemplo:

```typescript
routes.dashboard
routes.calendar
routes.profile
```

---

# Manejo de errores

Toda operación asíncrona debe contemplar:

- loading
- success
- error

Nunca dejar pantallas vacías.

Siempre informar claramente el problema al usuario.

---

# Carga de datos

La aplicación deberá minimizar las consultas innecesarias.

Priorizar:

- caché
- actualización automática
- consultas paginadas cuando corresponda
- carga diferida (lazy loading)

---

# Rendimiento

Se utilizará:

- React.lazy()
- Suspense
- Code Splitting
- Memoización únicamente cuando aporte beneficios reales

No optimizar prematuramente.

---

# Responsive

Toda la aplicación seguirá una estrategia Mobile First.

El diseño de escritorio será una adaptación del diseño móvil.

No diseñar primero para escritorio.

---

# Escalabilidad

Cada nuevo módulo deberá poder agregarse mediante una estructura similar a:

```text
features/
nuevoModulo/
components/
pages/
hooks/
services/
types/
utils/
validations/
```

Sin modificar la arquitectura existente.

---

# Dependencias

Antes de incorporar una nueva librería deberá verificarse:

- si React ya resuelve el problema;
- si ya existe una librería instalada;
- si realmente aporta valor.

Se evitará aumentar innecesariamente el tamaño del proyecto.

---

# Principios finales

Toda decisión técnica deberá respetar los siguientes principios:

- código legible antes que código ingenioso;
- simplicidad antes que complejidad;
- reutilización antes que duplicación;
- composición antes que herencia;
- tipado fuerte antes que flexibilidad excesiva;
- módulos independientes antes que componentes gigantes;
- mantenimiento sencillo antes que optimizaciones prematuras.
