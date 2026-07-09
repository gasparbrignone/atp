import type { Timestamp } from "firebase/firestore"

// Documento único (DATABASE.md: "Debe existir un único documento").
export const SETTINGS_DOC_ID = "general"

export interface AppSettings {
  organizationName: string
  minUsersPerSlot: number
  reminderHour: string
  senderEmail: string
  updatedAt: Timestamp | null
}
