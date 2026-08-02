// La Mesita de la semana que viene debe verse "limpia" desde el viernes a
// las 20hs (no recién el lunes), para que el equipo pueda empezar a
// anotarse con anticipación apenas termina la semana en curso.
export function getEffectiveMesitaDate(date = new Date()): Date {
  const dayOfWeek = date.getDay() // 0 = domingo ... 6 = sábado
  const isFridayNight = dayOfWeek === 5 && date.getHours() >= 20
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

  if (!isFridayNight && !isWeekend) {
    return date
  }

  const daysUntilMonday = (8 - dayOfWeek) % 7
  const result = new Date(date)
  result.setDate(result.getDate() + daysUntilMonday)
  return result
}
