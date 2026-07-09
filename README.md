# Portal ATP

Plataforma web privada de la Agrupación ATP (Facultad de Ciencias Médicas, UNR). Centraliza las herramientas internas de la agrupación en una única aplicación modular y escalable.

Ver `/docs` para la documentación completa del proyecto (producto, arquitectura, base de datos, diseño, funcionalidades, seguridad y flujo de trabajo).

## Stack

React + TypeScript + Vite + React Router + Tailwind CSS + shadcn/ui + TanStack Query + React Hook Form + Zod + Firebase (Auth, Firestore, Storage).

## Desarrollo

```bash
npm install
cp .env.example .env   # completar con las credenciales del proyecto Firebase
npm run dev
```

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción (typecheck + build).
- `npm run lint` — lint con Oxlint.
- `npm run preview` — sirve el build de producción localmente.
