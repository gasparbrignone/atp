import type { Timestamp } from "firebase/firestore"

export const EVENT_TYPES = {
  MEETING: "meeting",
  CAMPAIGN: "campaign",
  TRAINING: "training",
  ACADEMIC: "academic",
  OTHER: "other",
} as const

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES]

export interface CalendarEvent {
  id: string
  title: string
  description: string
  location: string
  startDate: Timestamp
  endDate: Timestamp
  type: EventType
  responsibleUsers: string[]
  participants: string[]
  status: string
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
