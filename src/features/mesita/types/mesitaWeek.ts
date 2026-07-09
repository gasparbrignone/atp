import type { Timestamp } from "firebase/firestore"

export const SLOT_STATUSES = {
  EMPTY: "empty",
  PARTIAL: "partial",
  COMPLETE: "complete",
  BLOCKED: "blocked",
} as const

export type SlotStatus = (typeof SLOT_STATUSES)[keyof typeof SLOT_STATUSES]

export interface MesitaSlot {
  day: number
  startHour: number
  endHour: number
  assignedUsers: string[]
  capacity: number
  status: SlotStatus
  notes: string | null
}

export interface MesitaWeek {
  id: string
  weekStart: Timestamp
  weekEnd: Timestamp
  coverage: number
  slots: MesitaSlot[]
  blockedSlots: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
