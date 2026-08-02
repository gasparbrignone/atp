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

const monthFormatter = new Intl.DateTimeFormat("es-AR", { month: "long" })

export function formatWeekRange(monday: Date, friday: Date): string {
  const sameMonth =
    monday.getMonth() === friday.getMonth() && monday.getFullYear() === friday.getFullYear()

  if (sameMonth) {
    return `Semana del ${monday.getDate()} al ${friday.getDate()} de ${monthFormatter.format(monday)}`
  }

  return `Semana del ${monday.getDate()} de ${monthFormatter.format(monday)} al ${friday.getDate()} de ${monthFormatter.format(friday)}`
}

// day: 1 (Lunes) a 5 (Viernes), relativo al lunes de la semana.
export function getDateForDay(monday: Date, day: MesitaDay, hour: number): Date {
  const date = new Date(monday)
  date.setDate(monday.getDate() + (day - 1))
  date.setHours(hour, 0, 0, 0)
  return date
}
