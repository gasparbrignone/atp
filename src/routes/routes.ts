export const routes = {
  login: "/login",
  dashboard: "/",
  mesita: "/mesita",
  meetings: "/reuniones",
  meetingNew: "/reuniones/nueva",
  meetingDetail: (id: string) => `/reuniones/${id}`,
  meetingEdit: (id: string) => `/reuniones/${id}/editar`,
  calendar: "/calendario",
  eventNew: "/calendario/nueva",
  eventDetail: (id: string) => `/calendario/${id}`,
  eventEdit: (id: string) => `/calendario/${id}/editar`,
  tasks: "/tareas",
  taskNew: "/tareas/nueva",
  taskDetail: (id: string) => `/tareas/${id}`,
  taskEdit: (id: string) => `/tareas/${id}/editar`,
  notifications: "/notificaciones",
  admin: "/administracion",
  profile: "/perfil",
} as const

// Patrones de ruta con parámetros dinámicos, para declarar <Route path=.../>.
// Las funciones en "routes" (arriba) son para generar links reales.
export const routePatterns = {
  meetingDetail: "/reuniones/:id",
  meetingEdit: "/reuniones/:id/editar",
  eventDetail: "/calendario/:id",
  eventEdit: "/calendario/:id/editar",
  taskDetail: "/tareas/:id",
  taskEdit: "/tareas/:id/editar",
} as const
