export const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function addMonths(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(1)
  result.setMonth(result.getMonth() + amount)
  return result
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

// Lunes = 0 ... Domingo = 6, para armar semanas que empiezan el lunes.
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7
}

export function startOfWeek(date: Date): Date {
  return addDays(date, -mondayIndex(date))
}

export function getWeekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

// Grilla de semanas completas que cubre el mes de `anchor` (siempre
// múltiplo de 7 días, incluyendo días de los meses adyacentes).
export function getMonthGridDays(anchor: Date): Date[] {
  const firstOfMonth = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const gridStart = startOfWeek(firstOfMonth)
  const lastOfMonth = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0)
  const gridEnd = startOfWeek(lastOfMonth)
  const weeks = Math.round((gridEnd.getTime() - gridStart.getTime()) / (7 * 86400000)) + 1

  return Array.from({ length: weeks * 7 }, (_, i) => addDays(gridStart, i))
}
