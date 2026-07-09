import type { Timestamp } from "firebase/firestore"

export const EVENT_TYPES = {
  MEETING: "meeting",
  CAMPAIGN: "campaign",
  TRAINING: "training",
  ACADEMIC: "academic",
  OTHER: "other",
} as const

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES]

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  meeting: "Reunión",
  campaign: "Campaña",
  training: "Capacitación",
  academic: "Actividad académica",
  other: "Otro",
}

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
  startDate: Timestamp
  endDate: Timestamp
  type: EventType
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
