import type { Timestamp } from "firebase/firestore"

// Paleta reducida de colores para diferenciar actividades a simple vista.
// Se guarda la clave (no un hex suelto) para mantener un único lugar de
// verdad sobre qué colores existen y cómo se ven (ver eventColors.ts).
export const EVENT_COLORS = {
  BLUE: "blue",
  GREEN: "green",
  AMBER: "amber",
  RED: "red",
  PURPLE: "purple",
  PINK: "pink",
  TEAL: "teal",
  GRAY: "gray",
} as const

export type EventColor = (typeof EVENT_COLORS)[keyof typeof EVENT_COLORS]

export const EVENT_STATUSES = {
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
} as const

export type EventStatus = (typeof EVENT_STATUSES)[keyof typeof EVENT_STATUSES]

// Respuesta de participación de cada integrante. DATABASE.md define
// "participants" como campo del evento; se modela como un mapa
// uid -> respuesta en vez de un array plano para poder representar las
// tres respuestas de FEATURES.md (Asistiré / No asistiré / Todavía no sé)
// sin necesitar tres arrays paralelos.
export const RSVP_STATUSES = {
  YES: "yes",
  NO: "no",
  MAYBE: "maybe",
} as const

export type RsvpStatus = (typeof RSVP_STATUSES)[keyof typeof RSVP_STATUSES]

export interface CalendarEvent {
  id: string
  title: string
  description: string
  location: string
  allDay: boolean
  startDate: Timestamp
  endDate: Timestamp
  color: EventColor
  responsibleUsers: string[]
  attendance: Record<string, RsvpStatus>
  status: EventStatus
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  deleted: boolean
  deletedAt: Timestamp | null
  deletedBy: string | null
}
