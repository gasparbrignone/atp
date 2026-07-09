export function getCurrentWeekId(date = new Date()): string {
  const target = new Date(date.valueOf())
  const dayNumber = (date.getDay() + 6) % 7 // lunes = 0
  target.setDate(target.getDate() - dayNumber + 3) // jueves de la semana ISO

  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const firstDayNumber = (firstThursday.getDay() + 6) % 7
  firstThursday.setDate(firstThursday.getDate() - firstDayNumber + 3)

  const weekNumber =
    1 +
    Math.round(
      (target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)
    )

  return `${target.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`
}
