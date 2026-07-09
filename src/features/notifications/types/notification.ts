import type { Timestamp } from "firebase/firestore"

export const NOTIFICATION_TYPES = {
  MEETING: "meeting",
  TASK: "task",
  MESITA: "mesita",
  CALENDAR: "calendar",
  SYSTEM: "system",
} as const

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

export interface Notification {
  id: string
  title: string
  message: string
  userId: string
  type: NotificationType
  // Id del documento relacionado (tarea/reunión/actividad), para poder
  // navegar directamente a él al tocar la notificación. No está en
  // DATABASE.md; es una extensión mínima para que la notificación sea
  // accionable en vez de solo informativa.
  relatedId: string | null
  read: boolean
  createdAt: Timestamp
  readAt: Timestamp | null
}
