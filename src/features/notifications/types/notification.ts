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
  read: boolean
  createdAt: Timestamp
  readAt: Timestamp | null
}
