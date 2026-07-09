export const routes = {
  login: "/login",
  dashboard: "/",
  mesita: "/mesita",
  meetings: "/reuniones",
  meetingNew: "/reuniones/nueva",
  meetingDetail: (id: string) => `/reuniones/${id}`,
  meetingEdit: (id: string) => `/reuniones/${id}/editar`,
} as const

// Patrones de ruta con parámetros dinámicos, para declarar <Route path=.../>.
// routes.meetingDetail/meetingEdit (arriba) son para generar links reales.
export const routePatterns = {
  meetingDetail: "/reuniones/:id",
  meetingEdit: "/reuniones/:id/editar",
} as const
