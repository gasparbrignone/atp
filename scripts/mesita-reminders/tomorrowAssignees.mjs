// --- Duplicado intencional de src/features/mesita/utils/weekId.ts ---
// Este script corre fuera del proyecto Vite (Node plano en GitHub Actions),
// no puede importar los módulos TypeScript de la app directamente.
function getWeekId(date) {
  const target = new Date(date.valueOf())
  const dayNumber = (date.getDay() + 6) % 7 // lunes = 0
  target.setDate(target.getDate() - dayNumber + 3)

  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const firstDayNumber = (firstThursday.getDay() + 6) % 7
  firstThursday.setDate(firstThursday.getDate() - firstDayNumber + 3)

  const weekNumber =
    1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000))

  return `${target.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`
}

export const DAY_LABELS = { 1: "lunes", 2: "martes", 3: "miércoles", 4: "jueves", 5: "viernes" }

// Devuelve { dayLabel, users } con las personas anotadas en Mesita para
// mañana (users trae el perfil completo de Firestore de cada una). Si
// mañana es fin de semana o nadie está anotado, users queda vacío.
export async function getTomorrowAssignees(db) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isoWeekday = tomorrow.getDay() === 0 ? 7 : tomorrow.getDay() // 1=lunes ... 7=domingo
  const dayLabel = DAY_LABELS[isoWeekday]

  if (isoWeekday > 5) {
    return { dayLabel: null, users: [] }
  }

  const weekId = getWeekId(tomorrow)

  const slotsSnapshot = await db
    .collection("mesitaWeeks")
    .doc(weekId)
    .collection("slots")
    .where("day", "==", isoWeekday)
    .get()

  const uids = new Set()
  slotsSnapshot.forEach((doc) => {
    const slot = doc.data()
    if (!slot.blocked) {
      for (const uid of slot.assignedUsers ?? []) uids.add(uid)
    }
  })

  const users = []
  for (const uid of uids) {
    const userDoc = await db.collection("users").doc(uid).get()
    if (userDoc.exists) users.push({ id: uid, ...userDoc.data() })
  }

  return { dayLabel, users }
}
