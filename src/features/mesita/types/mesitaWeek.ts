import type { Timestamp } from "firebase/firestore"

export const SLOT_STATUSES = {
  EMPTY: "empty",
  PARTIAL: "partial",
  COMPLETE: "complete",
  BLOCKED: "blocked",
} as const

export type SlotStatus = (typeof SLOT_STATUSES)[keyof typeof SLOT_STATUSES]

export const DEFAULT_SLOT_CAPACITY = 2

// Lunes = 1 ... Viernes = 5 (ISO weekday).
export const MESITA_DAYS = [1, 2, 3, 4, 5] as const
export type MesitaDay = (typeof MESITA_DAYS)[number]

// Bloques horarios de una hora, de 8 a 17 (el último bloque termina a las 18).
export const MESITA_START_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const

export const MESITA_DAY_LABELS: Record<MesitaDay, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
}

// Metadatos de la semana. Los horarios viven en la subcolección "slots"
// (ver DATABASE.md: "documentos pequeños... dividir en subcolecciones").
export interface MesitaWeekMeta {
  id: string
  weekStart: Timestamp
  weekEnd: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface MesitaSlot {
  id: string
  day: MesitaDay
  startHour: number
  endHour: number
  assignedUsers: string[]
  capacity: number
  blocked: boolean
  notes: string | null
}

export function getSlotId(day: MesitaDay, startHour: number): string {
  return `${day}-${startHour}`
}

export function getSlotStatus(slot: Pick<MesitaSlot, "assignedUsers" | "capacity" | "blocked">): SlotStatus {
  if (slot.blocked) return SLOT_STATUSES.BLOCKED
  if (slot.assignedUsers.length === 0) return SLOT_STATUSES.EMPTY
  if (slot.assignedUsers.length >= slot.capacity) return SLOT_STATUSES.COMPLETE
  return SLOT_STATUSES.PARTIAL
}
