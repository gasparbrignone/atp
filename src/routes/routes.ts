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
} as const

// Patrones de ruta con parámetros dinámicos, para declarar <Route path=.../>.
// routes.meetingDetail/meetingEdit/eventDetail/eventEdit (arriba) son para
// generar links reales.
export const routePatterns = {
  meetingDetail: "/reuniones/:id",
  meetingEdit: "/reuniones/:id/editar",
  eventDetail: "/calendario/:id",
  eventEdit: "/calendario/:id/editar",
} as const
