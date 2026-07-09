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
