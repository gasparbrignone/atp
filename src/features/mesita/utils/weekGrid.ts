import {
  DEFAULT_SLOT_CAPACITY,
  MESITA_DAYS,
  MESITA_START_HOURS,
  getSlotId,
  type MesitaSlot,
} from "@/features/mesita/types/mesitaWeek"

// Completa la grilla semanal (5 días x 10 bloques horarios) con los slots
// existentes en Firestore; los bloques sin documento se consideran vacíos.
export function buildWeekGrid(slots: MesitaSlot[]): MesitaSlot[] {
  const slotsById = new Map(slots.map((slot) => [slot.id, slot]))

  return MESITA_DAYS.flatMap((day) =>
    MESITA_START_HOURS.map((startHour) => {
      const id = getSlotId(day, startHour)
      return (
        slotsById.get(id) ?? {
          id,
          day,
          startHour,
          endHour: startHour + 1,
          assignedUsers: [],
          capacity: DEFAULT_SLOT_CAPACITY,
          blocked: false,
          notes: null,
        }
      )
    })
  )
}

export interface WeekCoverageStats {
  coveragePercentage: number
  idealCount: number
  gapCount: number
  totalSlots: number
}

export function computeWeekCoverage(slots: MesitaSlot[]): WeekCoverageStats {
  const grid = buildWeekGrid(slots)
  const activeSlots = grid.filter((slot) => !slot.blocked)

  const coveredCount = activeSlots.filter(
    (slot) => slot.assignedUsers.length > 0
  ).length
  const idealCount = activeSlots.filter(
    (slot) => slot.assignedUsers.length >= slot.capacity
  ).length
  const gapCount = activeSlots.length - coveredCount

  const coveragePercentage =
    activeSlots.length > 0
      ? Math.round((coveredCount / activeSlots.length) * 100)
      : 0

  return {
    coveragePercentage,
    idealCount,
    gapCount,
    totalSlots: activeSlots.length,
  }
}
