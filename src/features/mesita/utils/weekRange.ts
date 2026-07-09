import type { MesitaDay } from "@/features/mesita/types/mesitaWeek"

export function getWeekRange(date = new Date()): { monday: Date; friday: Date } {
  const dayNumber = (date.getDay() + 6) % 7 // lunes = 0

  const monday = new Date(date)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(monday.getDate() - dayNumber)

  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  friday.setHours(23, 59, 59, 999)

  return { monday, friday }
}

// day: 1 (Lunes) a 5 (Viernes), relativo al lunes de la semana.
export function getDateForDay(monday: Date, day: MesitaDay, hour: number): Date {
  const date = new Date(monday)
  date.setDate(monday.getDate() + (day - 1))
  date.setHours(hour, 0, 0, 0)
  return date
}
